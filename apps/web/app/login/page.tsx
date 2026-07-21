import type { ReactNode } from "react";

import { LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { login } from "./actions";

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

export default function LoginPage() {
    return (
        <main className="flex min-h-svh items-center justify-center bg-background p-4 text-foreground">
            <div className="grid w-full max-w-sm gap-6">
                <div className="grid gap-2 text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-lg border bg-muted">
                        <span className="text-sm font-semibold">GG</span>
                    </div>
                    <div className="grid gap-1">
                        <h1 className="text-xl font-medium">GoGlobal CRM</h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in to continue to lead operations
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Enter your CRM account details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={login} className="grid gap-4">
                            <Field label="Email">
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
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
                                        className="pl-8"
                                    />
                                </div>
                            </Field>

                            <Button type="submit" className="mt-2 w-full">
                                Sign in
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
