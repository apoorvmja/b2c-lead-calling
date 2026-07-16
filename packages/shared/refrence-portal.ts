export const REFERENCE_PORTALS = {
    CCPL: "CCPL",
    BITTRACK: "BITTRACK",
    APPLY_BORD: "APPLY BORD",
    KC: "KC",
    UCOL: "UCOL",
    VATSALAY: "VATSALAY",
} as const;

export type ReferencePortal = (typeof REFERENCE_PORTALS)[keyof typeof REFERENCE_PORTALS];