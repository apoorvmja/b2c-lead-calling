export const LEAD_STATUS = {
    NEW: "New",
    COLD: "Cold",
    WARM: "Warm",
    HOT: "Hot",
    VERY_INTERESTED: "Very Interested",
} as const;

export const STUDENT_STATUS = {
    ACTIVE: "Active",
    FOLLOW_UP: "Follow-up",
    APPLICATION_IN_PROGRESS: "Application In Progress",
    OFFER_RECEIVED: "Offer Received",
    OFFER_ACCEPTED: "Offer Accepted",
    VISA_IN_PROGRESS: "Visa In Progress",
    VISA_APPROVED: "Visa Approved",
    VISA_REJECTED: "Visa Rejected",
    ENROLLED: "Enrolled",
    DROPPED: "Dropped",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
} as const;

export type StudentStatus = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];