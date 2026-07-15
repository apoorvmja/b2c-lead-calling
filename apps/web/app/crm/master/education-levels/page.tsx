import { EDUCATION_LEVELS } from "@repo/shared";

import { MasterDataPage } from "../_components/master-data-page";

export default function EducationLevelsPage() {
  return (
    <MasterDataPage
      title="Education Levels"
      description="Academic levels captured for student profiles"
      data={EDUCATION_LEVELS}
    />
  );
}
