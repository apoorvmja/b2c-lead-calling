import { INTAKES } from "@repo/shared";

import { MasterDataPage } from "../_components/master-data-page";

export default function IntakesPage() {
  return (
    <MasterDataPage
      title="Intakes"
      description="Available intake windows for study abroad planning"
      data={INTAKES}
    />
  );
}
