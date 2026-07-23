import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getUserFromToken, USER_COOKIE_NAME } from "@/lib/auth-cookie";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
    const user = await getUserFromToken(
        (await cookies()).get(USER_COOKIE_NAME)?.value
    );

    if (user) {
        redirect("/crm");
    }

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
                        <LoginForm />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
