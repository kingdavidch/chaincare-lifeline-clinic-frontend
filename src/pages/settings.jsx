import { Helmet } from 'react-helmet-async';

import SettingsMain from 'src/sections/settings/SettingsMain';

export default function Settings() {
  return (
    <>
      <Helmet>
        <title> Settings </title>
      </Helmet>

      <SettingsMain />
    </>
  );
}
