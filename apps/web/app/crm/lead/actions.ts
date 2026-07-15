"use server";

import { redirect } from "next/navigation";

import { prisma } from "@repo/db";

export async function createLead(formData: FormData) {
  await prisma.lead.create({
    data: {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      source: formData.get("source") as string,
      assignedToUserId: formData.get("assignedToUserId") as string,
      interestedField: formData.get("interestedField") as string,
      country: formData.get("country") as string,
      purpose: formData.get("purpose") as string,
      status: formData.get("status") as string,
      englishTest: formData.get("englishTest") as string,
    },
  });

  redirect("/crm/lead");
}
