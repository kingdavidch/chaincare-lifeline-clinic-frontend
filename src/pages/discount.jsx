import { Helmet } from 'react-helmet-async';

import DiscountsPage from 'src/sections/discount/view/DiscountsView';


export default function Discounts() {
  return (
    <>
      <Helmet>
        <title> Clinic | Discounts </title>
      </Helmet>

      <DiscountsPage />
    </>
  );
}
