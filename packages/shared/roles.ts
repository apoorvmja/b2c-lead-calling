export const USER_ROLES = {
    ADMIN: "ADMIN",
    COUNSELOR: "COUNSELOR",
    TELECALLER: "TELECALLER",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];