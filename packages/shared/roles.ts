export const USER_ROLES = {
    ADMIN: "ADMIN",
    COUNSELOR: "COUNSELOR",
    TELECALLER: "TELECALLER",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_ROUTES: { path: string; roles: UserRole[] }[] = [
    {
        path: "/crm/lead/unallocated",
        roles: [USER_ROLES.ADMIN],
    },
    {
        path: "/crm/lead/bulk-upload",
        roles: [USER_ROLES.ADMIN],
    },
    {
        path: "/crm/master",
        roles: [USER_ROLES.ADMIN],
    },
];
