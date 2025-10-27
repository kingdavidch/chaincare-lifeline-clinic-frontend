import { Helmet } from 'react-helmet-async';

import SignUpView from 'src/sections/sign-up/SignUpView';

export default function SignUpPage() {
  return (
    <>
      <Helmet>
        <title> Sign Up | Clinic </title>
      </Helmet>

      <SignUpView />
    </>
  );
}
