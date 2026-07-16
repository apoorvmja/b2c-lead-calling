import { prisma } from "@repo/db";

export async function nextEnrollmentNumber() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const prefix = `SO/${year}/`;

  const lastStudent = await prisma.student.findFirst({
    where: { enrollmentNumber: { startsWith: prefix } },
    orderBy: { enrollmentNumber: "desc" },
    select: { enrollmentNumber: true },
  });

  const lastNumber = Number(lastStudent?.enrollmentNumber.split("/").at(-1) ?? 0);
  const nextNumber = lastNumber + 1;

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}
