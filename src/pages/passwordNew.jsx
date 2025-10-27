import { Helmet } from 'react-helmet-async';

import { PasswordNew } from 'src/sections/PasswordNew';

export default function ResetPasswordNewPage() {
  return (
    <>
      <Helmet>
        <title> Clinic | Pharmacy </title>
      </Helmet>

      <PasswordNew />
    </>
  );
}
