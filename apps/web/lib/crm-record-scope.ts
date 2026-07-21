import { cookies } from "next/headers";

import { USER_ROLES } from "@repo/shared";

import { getUserFromToken, USER_COOKIE_NAME } from "@/lib/auth-cookie";

export async function getCrmRecordScope() {
  const user = await getUserFromToken(
    (await cookies()).get(USER_COOKIE_NAME)?.value,
  );

  if (user?.role === USER_ROLES.ADMIN) {
    return {
      leadWhere: {},
      studentWhere: {},
      applicationWhere: {},
      visaWhere: {},
      leadHistoryWhere: {},
      studentFollowUpWhere: {},
    };
  }

  if (user?.role === USER_ROLES.COUNSELOR || user?.role === USER_ROLES.TELECALLER) {
    const leadWhere = { assignedToUserId: user.id };
    const studentWhere = { lead: { assignedToUserId: user.id } };
    const studentRecordWhere = { student: { lead: { assignedToUserId: user.id } } };

    return {
      leadWhere,
      studentWhere,
      applicationWhere: studentRecordWhere,
      visaWhere: studentRecordWhere,
      leadHistoryWhere: { lead: leadWhere },
      studentFollowUpWhere: { student: studentWhere },
    };
  }

  return {
    leadWhere: { id: "" },
    studentWhere: { lead: { id: "" } },
    applicationWhere: { student: { lead: { id: "" } } },
    visaWhere: { student: { lead: { id: "" } } },
    leadHistoryWhere: { lead: { id: "" } },
    studentFollowUpWhere: { student: { lead: { id: "" } } },
  };
}
