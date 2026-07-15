"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@repo/db";

export async function createUser(formData: FormData) {
  await prisma.user.create({
    data: {
      fullName: String(formData.get("fullName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      role: String(formData.get("role") || ""),
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidatePath("/crm/master/users");
}
