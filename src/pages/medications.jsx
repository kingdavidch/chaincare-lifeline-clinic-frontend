import { Helmet } from 'react-helmet-async';

import TestsGridView from 'src/sections/medications/view/TestsGridView';

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Clinic | Test </title>
      </Helmet>

      <TestsGridView />
    </>
  );
}
