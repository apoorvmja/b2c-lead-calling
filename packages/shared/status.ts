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


export const APPLICATION_STATUS = {
    APPLICATION_SENT_TO_COLLEGE: "Application Sent to College",
    APPLICATION_RECEIVED: "Application Received",
    FEES_PAID: "Fees Paid",
    OFFER_RECEIVED: "Offer Received",
    OFFER_ACCEPTED: "Offer Accepted",
    DOCUMENTS_PENDING: "Documents Pending",
    INTERVIEW_PREPARATION: "Interview Preparation",
    CAS_IN_PROGRESS: "CAS In Progress",
    CAS_DOCUMENTS_PENDING: "CAS Documents Pending",
    VISA_APPLICATION_IN_PROGRESS: "Visa Application In Progress",
    VISA_APPLIED: "Visa Applied",
    INTERVIEW_RESULT_PENDING: "Interview Result Pending",
    VISA_RECEIVED: "Visa Received",
    OFFER_PENDING: "Offer Pending",
    ON_HOLD: "On Hold",
} as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export const VISA_STATUS = {
    NOT_STARTED: "Not Started",
    DOCUMENTS_PENDING: "Documents Pending",
    APPOINTMENT_BOOKED: "Appointment Booked",
    BIOMETRICS_COMPLETED: "Biometrics Completed",
    UNDER_PROCESS: "Under Process",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    EXPIRED: "Expired",
    CANCELLED: "Cancelled",
} as const;

export type VisaStatus = (typeof VISA_STATUS)[keyof typeof VISA_STATUS];
