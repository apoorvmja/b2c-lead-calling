import { INTERESTED_FIELDS } from "@repo/shared";

import { MasterDataPage } from "../_components/master-data-page";

export default function InterestedFieldsPage() {
  return (
    <MasterDataPage
      title="Interested Fields"
      description="Study fields used to classify student interests"
      data={INTERESTED_FIELDS}
    />
  );
}
