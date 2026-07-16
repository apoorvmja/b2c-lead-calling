"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@repo/db";

function optionalValue(formData: FormData, name: string) {
  return (formData.get(name) as string) || null;
}

function applicationData(formData: FormData) {
  return {
    studentId: formData.get("studentId") as string,
    preferredCountry: optionalValue(formData, "preferredCountry"),
    college: optionalValue(formData, "college"),
    course: optionalValue(formData, "course"),
    courseDuration: optionalValue(formData, "courseDuration"),
    fee: optionalValue(formData, "fee"),
    referencePortal: optionalValue(formData, "referencePortal"),
    referencePortalLink: optionalValue(formData, "referencePortalLink"),
    applicationNo: optionalValue(formData, "applicationNo"),
    applicationDate: formData.get("applicationDate")
      ? new Date(formData.get("applicationDate") as string)
      : null,
    applicationStatus:
      (formData.get("applicationStatus") as string) ||
      "Application In Progress",
    intake: optionalValue(formData, "intake"),
    admissionDone: formData.get("admissionDone") === "on",
    applicationRemark: optionalValue(formData, "applicationRemark"),
  };
}

export async function createApplication(formData: FormData) {
  await prisma.studentApplication.create({
    data: applicationData(formData),
  });

  redirect("/crm/application");
}

export async function updateApplication(id: string, formData: FormData) {
  await prisma.studentApplication.update({
    where: { id },
    data: applicationData(formData),
  });

  redirect("/crm/application");
}

export async function createApplicationUpdate(
  applicationId: string,
  formData: FormData
) {
  const status = formData.get("status") as string;

  await prisma.$transaction([
    prisma.applicationUpdate.create({
      data: {
        applicationId,
        status,
        remarks: formData.get("remarks") as string,
      },
    }),
    prisma.studentApplication.update({
      where: { id: applicationId },
      data: { applicationStatus: status },
    }),
  ]);

  revalidatePath("/crm/application");
  revalidatePath(`/crm/application/${applicationId}/edit`);
}
