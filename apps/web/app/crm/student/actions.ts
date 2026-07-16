"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@repo/db";
import { LEAD_ACTIVITIES } from "@repo/shared";

function studentData(formData: FormData) {
  return {
    enrollmentNumber: formData.get("enrollmentNumber") as string,
    enrollmentDate: new Date(formData.get("enrollmentDate") as string),

    firstName: formData.get("firstName") as string,
    middleName: formData.get("middleName") as string,
    surname: formData.get("surname") as string,

    birthDate: formData.get("birthDate")
      ? new Date(formData.get("birthDate") as string)
      : null,

    emergencyName: formData.get("emergencyName") as string,
    emergencyPhone: formData.get("emergencyPhone") as string,
    emergencyEmail: formData.get("emergencyEmail") as string,

    status: formData.get("status") as string,
    intake: formData.get("intake") as string,

    details: formData.get("details") as string,
  };
}

export async function convertLeadToStudent(leadId: string, formData: FormData) {
  await prisma.$transaction(async (tx) => {
    const lead = await tx.lead.findUnique({
      where: { id: leadId },
      select: {
        status: true,
        isConverted: true,
      },
    });

    if (!lead || lead.isConverted) {
      return;
    }

    await tx.student.create({
      data: {
        ...studentData(formData),
        leadId,
      },
    });

    await tx.lead.update({
      where: { id: leadId },
      data: {
        isConverted: true,
        convertedAt: new Date(),
      },
    });
    await tx.leadHistory.create({
      data: {
        leadId,
        status: lead.status,
        activity: LEAD_ACTIVITIES.CONVERTED_TO_STUDENT,
        remarks: "Converted to student",
      },
    });
  });

  revalidatePath("/crm/lead");
  revalidatePath(`/crm/lead/${leadId}/edit`);
  redirect("/crm/student");
}

export async function updateStudent(id: string, formData: FormData) {
  await prisma.student.update({
    where: { id },
    data: studentData(formData),
  });

  redirect("/crm/student");
}

export async function createStudentFollowUp(
  studentId: string,
  formData: FormData,
) {
  const status = formData.get("status") as string;

  await prisma.$transaction([
    prisma.studentFollowUp.create({
      data: {
        studentId,
        status,
        remarks: formData.get("remarks") as string,
        followUp: formData.get("followUp") === "on",
        followUpDate: formData.get("followUpDate")
          ? new Date(formData.get("followUpDate") as string)
          : null,
      },
    }),
    prisma.student.update({
      where: { id: studentId },
      data: { status },
    }),
  ]);

  revalidatePath(`/crm/student/${studentId}/edit`);
  revalidatePath("/crm/student");
}
