import { LEAD_STATUS } from "@repo/shared";

import { MasterDataPage } from "../_components/master-data-page";

export default function StatusPage() {
  return (
    <MasterDataPage
      title="Status"
      description="Lead status values used in the CRM pipeline"
      data={LEAD_STATUS}
    />
  );
}
