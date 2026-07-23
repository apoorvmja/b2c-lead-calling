"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@repo/db";

function leadData(formData: FormData) {
  return {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    address: formData.get("address") as string,
    source: formData.get("source") as string,
    interestedField: formData.get("interestedField") as string,
    country: (formData.get("country") as string) || null,
    purpose: formData.get("purpose") as string,
    status: formData.get("status") as string,
    englishTest: formData.get("englishTest") as string,
  };
}

export async function createLead(formData: FormData) {
  const assignedToUserId = formData.get("assignedToUserId") as string;

  await prisma.lead.create({
    data: {
      ...leadData(formData),
      assignedToUser: assignedToUserId
        ? { connect: { id: assignedToUserId } }
        : undefined,
    },
  });
  redirect("/crm/lead");
}

export async function updateLead(id: string, formData: FormData) {
  const assignedToUserId = formData.get("assignedToUserId") as string;

  await prisma.lead.update({
    where: { id },
    data: {
      ...leadData(formData),
      assignedToUser: assignedToUserId
        ? { connect: { id: assignedToUserId } }
        : { disconnect: true },
    },
  });

  redirect("/crm/lead");
}

export async function allocateUnallocatedLeads(formData: FormData) {
  const assignedToUserId = formData.get("assignedToUserId") as string;
  const leads = await prisma.lead.findMany({
    where: { assignedToUserId: null },
    select: { id: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  await prisma.lead.updateMany({
    where: { id: { in: leads.map((lead) => lead.id) } },
    data: { assignedToUserId },
  });

  revalidatePath("/crm/lead/unallocated");
  revalidatePath("/crm/lead");
}

export async function unallocateAssignedLeads(formData: FormData) {
  const assignedToUserId = formData.get("assignedToUserId") as string;
  const leads = await prisma.lead.findMany({
    where: { assignedToUserId },
    select: { id: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  await prisma.lead.updateMany({
    where: { id: { in: leads.map((lead) => lead.id) } },
    data: { assignedToUserId: null },
  });

  revalidatePath("/crm/lead/allocated");
  revalidatePath("/crm/lead/unallocated");
  revalidatePath("/crm/lead");
}

export async function createLeadHistory(leadId: string, formData: FormData) {
  const status = formData.get("status") as string;

  await prisma.$transaction([
    prisma.leadHistory.create({
      data: {
        leadId,
        status,
        activity: formData.get("activity") as string,
        remarks: formData.get("remarks") as string,
        followUp: formData.get("followUp") === "on",
        followUpDate: formData.get("followUpDate")
          ? new Date(formData.get("followUpDate") as string)
          : null,
      },
    }),
    prisma.lead.update({
      where: { id: leadId },
      data: { status },
    }),
  ]);

  revalidatePath(`/crm/lead/${leadId}/edit`);
  revalidatePath("/crm/lead");
  revalidatePath("/crm/lead/follow-up");
}
