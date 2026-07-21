"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@repo/db";

export async function uploadBulkLeads(formData: FormData) {
  const file = formData.get("file") as File;
  const leads = JSON.parse(await file.text()) as {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    country?: string;
    interestedField?: string;
    purpose?: string;
    englishTest?: string;
  }[];
  const source = formData.get("source") as string;
  const status = formData.get("status") as string;

  await prisma.lead.createMany({
    data: leads.map((lead) => ({
      name: lead.name ?? "",
      phone: lead.phone ?? "",
      email: lead.email ?? "",
      address: lead.address ?? "",
      source,
      interestedField: lead.interestedField ?? "",
      country: lead.country || null,
      purpose: lead.purpose ?? "",
      status,
      englishTest: lead.englishTest ?? "",
    })),
  });

  revalidatePath("/crm/lead");
  revalidatePath("/crm/lead/unallocated");
  redirect("/crm/lead/unallocated");
}
