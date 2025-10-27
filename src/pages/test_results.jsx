import { Helmet } from 'react-helmet-async';

import { TestResultsPage } from 'src/sections/test-results/view';



export default function TestPage() {
  return (
    <>
      <Helmet>
        <title> Clinic | Test Result </title>
      </Helmet>

      <TestResultsPage />
    </>
  );
}
