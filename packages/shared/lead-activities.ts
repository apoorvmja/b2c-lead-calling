export const LEAD_ACTIVITIES = {
    CALL_DONE: "Call Done",
    CALL_SCHEDULED: "Call Scheduled",
    MISSED_CALL: "Missed Call",

    WHATSAPP_SENT: "WhatsApp Sent",
    WHATSAPP_REPLIED: "WhatsApp Replied",
    WHATSAPP_CALL: "WhatsApp Call",

    EMAIL_SENT: "Email Sent",
    EMAIL_REPLIED: "Email Replied",

    FOLLOW_UP: "Follow-up",
    DEMO_BOOKED: "Demo Booked",
    COUNSELING_DONE: "Counseling Done",

    DOCUMENTS_REQUESTED: "Documents Requested",
    DOCUMENTS_RECEIVED: "Documents Received",

    NOT_RESPONDING: "Not Responding",
    INTERESTED: "Interested",
    NOT_INTERESTED: "Not Interested",

    MEETING_SCHEDULED: "Meeting Scheduled",
    WALK_IN_VISIT: "Walk-in Visit",

    CONVERTED_TO_STUDENT: "Converted to Student",
    CLOSED: "Closed",

    OTHER: "Other",
} as const;

export type LeadActivity = (typeof LEAD_ACTIVITIES)[keyof typeof LEAD_ACTIVITIES];