import { Helmet } from 'react-helmet-async';

import { ResetPassword } from 'src/sections/ResetPassword';

export default function RequestEmail() {
  return (
    <>
      <Helmet>
        <title> Reset | Password </title>
      </Helmet>

      <ResetPassword />
    </>
  );
}
