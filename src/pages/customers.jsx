import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/customers/view';

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Clinic | Patients </title>
      </Helmet>

      <UserView />
    </>
  );
}
