import { Helmet } from 'react-helmet-async';

import { ReportsView } from 'src/sections/reports/view';

export default function ReportsPage() {
  return (
    <>
      <Helmet>
        <title> Pharmacy | Report </title>
      </Helmet>

      <ReportsView />
    </>
  );
}
