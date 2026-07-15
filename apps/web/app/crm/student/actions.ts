"use server";

import { redirect } from "next/navigation";
import { prisma } from "@repo/db";

function studentData(formData: FormData) {
  return {
    enrollmentNumber: formData.get("enrollmentNumber") as string,
    enrollmentDate: new Date(formData.get("enrollmentDate") as string),

    firstName: formData.get("firstName") as string,
    middleName: formData.get("middleName") as string,
    surname: formData.get("surname") as string,

    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    address: formData.get("address") as string,
    birthDate: formData.get("birthDate")
      ? new Date(formData.get("birthDate") as string)
      : null,

    country: formData.get("country") as string,

    emergencyName: formData.get("emergencyName") as string,
    emergencyPhone: formData.get("emergencyPhone") as string,
    emergencyEmail: formData.get("emergencyEmail") as string,

    source: formData.get("source") as string,
    purpose: formData.get("purpose") as string,
    interestedField: formData.get("interestedField") as string,

    status: formData.get("status") as string,
    assignedToUserId: formData.get("assignedToUserId") as string,
    intake: formData.get("intake") as string,

    details: formData.get("details") as string,

    followUp: formData.get("followUp") === "on",
    followUpDate: formData.get("followUpDate")
      ? new Date(formData.get("followUpDate") as string)
      : null,
    followUpRemark: formData.get("followUpRemark") as string,

    englishTest: formData.get("englishTest") as string,
  };
}

export async function createStudent(formData: FormData) {
  await prisma.student.create({
    data: studentData(formData),
  });

  redirect("/crm/student");
}

export async function updateStudent(id: string, formData: FormData) {
  await prisma.student.update({
    where: { id },
    data: studentData(formData),
  });

  redirect("/crm/student");
}
