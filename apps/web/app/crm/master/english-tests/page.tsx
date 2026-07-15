import { ENGLISH_TESTS } from "@repo/shared";

import { MasterDataPage } from "../_components/master-data-page";

export default function EnglishTestsPage() {
  return (
    <MasterDataPage
      title="English Tests"
      description="Accepted English test options for applications"
      data={ENGLISH_TESTS}
    />
  );
}
