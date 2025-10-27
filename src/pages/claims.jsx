import { Helmet } from 'react-helmet-async';

import { ClaimsView } from 'src/sections/claims/view';

export default function ClaimPage() {
  return (
    <>
      <Helmet>
        <title> Clinic | Claims </title>
      </Helmet>

      <ClaimsView />
    </>
  );
}
