import { COUNTRIES } from "@repo/shared";

import { MasterDataPage } from "../_components/master-data-page";

export default function CountriesPage() {
  return (
    <MasterDataPage
      title="Countries"
      description="Destination countries available for student inquiries"
      data={COUNTRIES}
    />
  );
}
