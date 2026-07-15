import { SOURCES } from "@repo/shared";

import { MasterDataPage } from "../_components/master-data-page";

export default function InquirySourcesPage() {
  return (
    <MasterDataPage
      title="Inquiry Sources"
      description="Lead source values used for inquiry tracking"
      data={SOURCES}
    />
  );
}
