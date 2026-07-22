"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { Delete, Mic, MicOff, Phone, PhoneCall, PhoneOff } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type VobizClient = {
  login: (username: string, password: string) => void;
  call: (destination: string, options: Record<string, unknown>) => void;
  answer: () => void;
  reject: () => void;
  hangup: () => void;
  logout: () => void;
  mute: () => void;
  unmute: () => void;
  sendDtmf: (key: string) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  callSession?: unknown;
  remoteView?: HTMLMediaElement;
  getPeerConnection?: () => {
    pc?: RTCPeerConnection;
  };
};

type VobizInstance = {
  client: VobizClient;
};

declare global {
  interface Window {
    Vobiz?: new (options: Record<string, unknown>) => VobizInstance;
  }
}

const username = process.env.NEXT_PUBLIC_VOBIZ_SDK_USERNAME ?? "";
const password = process.env.NEXT_PUBLIC_VOBIZ_SDK_PASSWORD ?? "";

const keys: [string, string][] = [
  ["1", ""],
  ["2", "ABC"],
  ["3", "DEF"],
  ["4", "GHI"],
  ["5", "JKL"],
  ["6", "MNO"],
  ["7", "PQRS"],
  ["8", "TUV"],
  ["9", "WXYZ"],
  ["*", ""],
  ["0", "+"],
  ["#", ""],
];

function statusClass(status: string) {
  if (status === "Registered") return "bg-emerald-500";
  if (["Connecting", "Ringing", "In Call", "Incoming Call"].includes(status)) {
    return "bg-primary";
  }
  return "bg-muted-foreground";
}

export function VobizDialer({ phoneNumber }: { phoneNumber?: string }) {
  const vobizRef = useRef<VobizInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioAttachedRef = useRef(false);
  const isInCallRef = useRef(false);
  const [destination, setDestination] = useState(phoneNumber ?? "");
  const [status, setStatus] = useState("Disconnected");
  const [incomingCaller, setIncomingCaller] = useState("");
  const [waitingCaller, setWaitingCaller] = useState("");
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const resetCallState = useCallback((nextStatus = "Registered") => {
    audioAttachedRef.current = false;
    isInCallRef.current = false;
    setIsInCall(false);
    setIsMuted(false);
    setIncomingCaller("");
    setWaitingCaller("");
    setStatus(nextStatus);
  }, []);

  const attachRemoteAudio = useCallback(() => {
    window.setTimeout(() => {
      const client = vobizRef.current?.client;
      let stream = client?.remoteView?.srcObject;
      const receiver = client
        ?.getPeerConnection?.()
        .pc?.getReceivers()
        .find((item) => item.track?.kind === "audio");

      if (!stream && receiver?.track) {
        stream = new MediaStream([receiver.track]);
      }

      if (!stream || !audioRef.current) return;

      audioRef.current.srcObject = stream;
      audioRef.current.play();
    }, 1500);
  }, []);

  const registerEvents = useCallback((client: VobizClient) => {
    client.on("onWebrtcNotSupported", () => setStatus("Unsupported"));
    client.on("onLogin", () => setStatus("Registered"));
    client.on("onLoginFailed", () => {
      vobizRef.current = null;
      setStatus("Login Failed");
    });
    client.on("onLogout", () => {
      vobizRef.current = null;
      resetCallState("Disconnected");
    });
    client.on("onCallRemoteRinging", () => setStatus("Ringing"));
    client.on("onCallAnswered", () => {
      if (audioAttachedRef.current) return;
      audioAttachedRef.current = true;
      isInCallRef.current = true;
      setIsInCall(true);
      setIncomingCaller("");
      setWaitingCaller("");
      setStatus("In Call");
      attachRemoteAudio();
    });
    client.on("onCallTerminated", () => resetCallState());
    client.on("onCallFailed", () => resetCallState());
    client.on("onIncomingCall", (callerName) => {
      const caller = String(callerName || "Unknown");

      if (isInCallRef.current) {
        setWaitingCaller(caller);
        setStatus("Call Waiting");
        return;
      }

      setIncomingCaller(caller);
      setStatus("Incoming Call");
    });
    client.on("onIncomingCallCanceled", () => {
      setIncomingCaller("");
      setWaitingCaller("");
      setStatus(isInCallRef.current ? "In Call" : "Registered");
    });
  }, [attachRemoteAudio, resetCallState]);

  const connect = useCallback(() => {
    if (!window.Vobiz || !username || !password || vobizRef.current) return;

    setStatus("Connecting");
    const vobiz = new window.Vobiz({
      debug: "ALL",
      permOnClick: true,
      enableTracking: true,
      closeProtection: false,
      maxAverageBitrate: 48000,
    });

    vobizRef.current = vobiz;
    registerEvents(vobiz.client);
    vobiz.client.login(username, password);
  }, [registerEvents]);

  function call() {
    if (!destination.trim() || !vobizRef.current) return;

    setStatus("Calling");
    isInCallRef.current = true;
    setIsInCall(true);
    vobizRef.current.client.call(destination.trim(), {});
  }

  function hangup() {
    vobizRef.current?.client.hangup();
  }

  function answer() {
    vobizRef.current?.client.answer();
    setIncomingCaller("");
    setWaitingCaller("");
    isInCallRef.current = true;
    setIsInCall(true);
  }

  function reject() {
    vobizRef.current?.client.reject();
    setIncomingCaller("");
    setWaitingCaller("");
    if (!isInCallRef.current) setStatus("Registered");
  }

  function switchCall() {
    vobizRef.current?.client.hangup();
    window.setTimeout(() => vobizRef.current?.client.answer(), 500);
    setWaitingCaller("");
    isInCallRef.current = true;
    setIsInCall(true);
  }

  function pressKey(key: string) {
    setDestination((value) => `${value}${key}`);
    if (vobizRef.current?.client.callSession) {
      vobizRef.current.client.sendDtmf(key);
    }
  }

  function toggleMute() {
    if (!vobizRef.current) return;

    if (isMuted) {
      vobizRef.current.client.unmute();
    } else {
      vobizRef.current.client.mute();
    }

    setIsMuted((value) => !value);
  }

  const doLogout = useCallback(() => {
    if (vobizRef.current) {
      vobizRef.current.client.logout();
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      doLogout();
    };
  }, [connect, doLogout]);

  const isRegistered = status === "Registered" || isInCall;

  return (
    <>
      <Script
        src="https://unpkg.com/vobiz-webrtc-sdk@1.0.3/dist/vobiz-webrtc-sdk.min.js"
        onReady={connect}
      />

      <div className="grid w-full mx-auto max-w-sm gap-3">
        {incomingCaller ? (
          <Card size="sm" className="border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-50">
            <CardContent className="flex items-center gap-3">
              <PhoneCall />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Incoming Call</p>
                <p className="truncate text-xs text-emerald-800 dark:text-emerald-200">
                  {incomingCaller}
                </p>
              </div>
              <Button size="sm" onClick={answer}>
                Answer
              </Button>
              <Button size="sm" variant="outline" onClick={reject}>
                Decline
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {waitingCaller ? (
          <Card size="sm" className="border-primary/30 bg-primary/10">
            <CardContent className="flex items-center gap-3">
              <PhoneCall />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Call Waiting</p>
                <p className="truncate text-xs text-muted-foreground">
                  {waitingCaller}
                </p>
              </div>
              <Button size="sm" onClick={switchCall}>
                Switch
              </Button>
              <Button size="sm" variant="outline" onClick={reject}>
                Decline
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Dialer</CardTitle>
            <CardDescription>
              {incomingCaller ? "Incoming call" : "Make outbound calls"}
            </CardDescription>
            <CardAction>
              <div className="inline-flex h-8 items-center gap-2 rounded-lg border px-2.5 text-xs font-medium text-muted-foreground">
                <span
                  className={cn("size-2 rounded-full", statusClass(status))}
                />
                {status}
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-3">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Destination Number</span>
              <div className="flex gap-2">
                <Input
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  placeholder="e.g. +919876543210"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setDestination((value) => value.slice(0, -1))}
                  aria-label="Delete digit"
                >
                  <Delete />
                </Button>
              </div>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {keys.map(([key, label]) => (
                <Button
                  key={key}
                  type="button"
                  variant="outline"
                  className="h-14 flex-col gap-0"
                  onClick={() => pressKey(key)}
                >
                  <span className="text-lg font-semibold leading-none">
                    {key}
                  </span>
                  {label ? (
                    <span className="text-[10px] leading-none text-muted-foreground">
                      {label}
                    </span>
                  ) : null}
                </Button>
              ))}
            </div>

            {isInCall ? (
              <Button
                type="button"
                variant="destructive"
                className="h-10"
                onClick={hangup}
              >
                <PhoneOff />
                Hangup
              </Button>
            ) : (
              <Button
                type="button"
                className="h-10"
                disabled={!isRegistered || !destination.trim()}
                onClick={call}
              >
                <Phone />
                Call
              </Button>
            )}

            {isInCall ? (
              <div className="flex justify-center">
                <Button type="button" variant="outline" onClick={toggleMute}>
                  {isMuted ? <MicOff /> : <Mic />}
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              </div>
            ) : null}

            {!username || !password ? (
              <p className="text-center text-xs text-muted-foreground">
                Vobiz SDK credentials are not configured.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <audio ref={audioRef} autoPlay className="hidden" />
    </>
  );
}
