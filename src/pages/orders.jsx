import { Helmet } from 'react-helmet-async';

import { OrdersPage } from 'src/sections/order/view';

export default function OrderPage() {
  return (
    <>
      <Helmet>
        <title> Clinic | Orders </title>
      </Helmet>

      <OrdersPage />
    </>
  );
}
