"use server";

import { redirect } from "next/navigation";

import { prisma } from "@repo/db";

function optionalValue(formData: FormData, name: string) {
  return (formData.get(name) as string) || null;
}

export async function createApplication(formData: FormData) {
  await prisma.studentApplication.create({
    data: {
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
    },
  });

  redirect("/crm/application");
}
