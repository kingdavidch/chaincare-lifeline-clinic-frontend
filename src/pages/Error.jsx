import { Helmet } from 'react-helmet-async';

import ErrorBoundaryView from 'src/sections/error/ErrorBoundaryView';

export default function ErrorPage() {
  return (
    <>
      <Helmet>
        <title> Clinic | Error </title>
      </Helmet>

      <ErrorBoundaryView />
    </>
  );
}
