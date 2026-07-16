export const VISA_TYPES = {
    STUDENT: "Student",
    VISITOR: "Visitor",
    DEPENDENT: "Dependent",
    WORK: "Work",
    TRANSIT: "Transit",
    PERMANENT_RESIDENT: "Permanent Resident",
    OTHER: "Other",
} as const;

export type VisaType = (typeof VISA_TYPES)[keyof typeof VISA_TYPES];
