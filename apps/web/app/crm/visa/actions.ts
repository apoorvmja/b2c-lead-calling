"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@repo/db";

function optionalValue(formData: FormData, name: string) {
  return (formData.get(name) as string) || null;
}

function visaData(formData: FormData) {
  return {
    studentId: formData.get("studentId") as string,
    country: optionalValue(formData, "country"),
    visaType: formData.get("visaType") as string,
    visaNumber: optionalValue(formData, "visaNumber"),
    visaDone: formData.get("visaDone") === "on",
    status: (formData.get("status") as string) || "Not Started",
  };
}

export async function createVisa(formData: FormData) {
  await prisma.studentVisa.create({
    data: visaData(formData),
  });

  redirect("/crm/visa");
}

export async function updateVisa(id: string, formData: FormData) {
  await prisma.studentVisa.update({
    where: { id },
    data: visaData(formData),
  });

  redirect("/crm/visa");
}

export async function createVisaUpdate(visaId: string, formData: FormData) {
  const status = formData.get("status") as string;

  await prisma.$transaction([
    prisma.studentVisaUpdate.create({
      data: {
        visaId,
        status,
        remarks: formData.get("remarks") as string,
      },
    }),
    prisma.studentVisa.update({
      where: { id: visaId },
      data: { status },
    }),
  ]);

  revalidatePath("/crm/visa");
  revalidatePath(`/crm/visa/${visaId}/edit`);
}
