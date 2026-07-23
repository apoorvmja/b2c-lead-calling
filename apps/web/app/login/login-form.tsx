"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { login, type LoginState } from "./actions";

function Field({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="grid gap-2 text-sm">
            <span className="font-medium">{label}</span>
            {children}
        </label>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="mt-2 w-full" disabled={pending}>
            {pending ? (
                <>
                    <LoaderCircle className="animate-spin" />
                    Signing in...
                </>
            ) : (
                "Sign in"
            )}
        </Button>
    );
}

const initialState: LoginState = {};

export function LoginForm() {
    const [state, formAction] = useActionState(login, initialState);

    return (
        <form action={formAction} className="grid gap-4">
            <Field label="Email">
                <div className="relative">
                    <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                        className="pl-8"
                    />
                </div>
            </Field>

            <Field label="Password">
                <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        autoComplete="current-password"
                        required
                        className="pl-8"
                    />
                </div>
            </Field>

            {state.error ? (
                <p className="text-sm text-destructive">{state.error}</p>
            ) : null}

            <SubmitButton />
        </form>
    );
}
