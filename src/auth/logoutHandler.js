let logoutCallback = null;

export const setLogoutHandler = (cb) => {
  logoutCallback = cb;
};

export const triggerLogout = () => {
  if (typeof logoutCallback === 'function') {
    logoutCallback();
  }
};
