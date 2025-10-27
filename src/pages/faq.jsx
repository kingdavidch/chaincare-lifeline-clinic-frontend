import { Helmet } from 'react-helmet-async';

import { FaqPage } from 'src/sections/faq/view';

export default function Faq() {
  return (
    <>
      <Helmet>
        <title>Faq Section</title>
      </Helmet>

      <FaqPage />
    </>
  );
}
