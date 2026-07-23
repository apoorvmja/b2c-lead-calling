"use server";

import { createHmac } from "crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@repo/db";
import { USER_COOKIE_NAME } from "@/lib/auth-cookie";

export type LoginState = {
    error?: string;
};

function signCookieValue(payload: string) {
    return createHmac("sha256", process.env.COOKIE_SECRET ?? "")
        .update(payload)
        .digest("base64url");
}

export async function login(state: LoginState, formData: FormData): Promise<LoginState> {
    void state;

    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const cookieSecret = process.env.COOKIE_SECRET;

    if (!cookieSecret) {
        return { error: "Invalid email or password." };
    }

    const user = await prisma.user.findFirst({
        where: { email, password, isActive: true },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
        },
    });

    if (!user) {
        return { error: "Invalid email or password." };
    }

    const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
    const signature = signCookieValue(payload);

    (await cookies()).set(USER_COOKIE_NAME, `${payload}.${signature}`,
        {
            expires: new Date("9999-12-31T23:59:59.999Z"),
            httpOnly: true,
            path: "/",
            sameSite: "lax",
        }
    );

    redirect("/crm");
}
