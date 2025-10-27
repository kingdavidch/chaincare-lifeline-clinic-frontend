import { Suspense } from 'react';

import Router from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import 'src/index.css';
import ThemeProvider from 'src/theme';

import Loading from './sections/Loader/Loader';

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Suspense fallback={<Loading />}>
        <Router />
      </Suspense>
    </ThemeProvider>
  );
}
