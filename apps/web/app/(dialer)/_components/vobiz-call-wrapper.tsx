"use client";

import { Phone } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { VobizDialer } from "./vobiz-dialer";

type VobizCallWrapperProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  phoneNumber?: string;
  trigger?: React.ReactElement;
};

export function VobizCallWrapper({
  open,
  defaultOpen,
  onOpenChange,
  phoneNumber,
  trigger,
}: VobizCallWrapperProps) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="outline" size="sm">
              <Phone />
              Call
            </Button>
          )
        }
      />
      <DialogContent showCloseButton={false} className="sm:max-w-m bg-transparent p-0 ring-0 shadow-none">
        <DialogTitle className="sr-only">Dialer</DialogTitle>
        <VobizDialer phoneNumber={phoneNumber} />
      </DialogContent>
    </Dialog>
  );
}
