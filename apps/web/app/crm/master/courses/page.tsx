import { COURSES } from "@repo/shared";

import { MasterDataPage } from "../_components/master-data-page";

export default function CoursesPage() {
  return (
    <MasterDataPage
      title="Courses"
      description="Programs and courses used across lead preferences"
      data={COURSES}
    />
  );
}
