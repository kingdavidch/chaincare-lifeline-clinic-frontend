import { Helmet } from 'react-helmet-async';

import { WithdrawalsView } from 'src/sections/withdraw/view';



export default function WithdrawPage() {
  return (
    <>
      <Helmet>
        <title> Clinic | Withdraw </title>
      </Helmet>

      <WithdrawalsView />
    </>
  );
}
