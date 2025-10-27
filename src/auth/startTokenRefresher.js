import api from '../api/axiosConfig';
import { triggerLogout } from './logoutHandler';

export const startTokenRefresher = () => {
  let consecutiveFailures = 0;
  const maxConsecutiveFailures = 3;

  const intervalId = setInterval(
    async () => {
      try {
        await api.post('/clinic/refresh-token');
        consecutiveFailures = 0; 
      } catch (error) {// Reset on success
        consecutiveFailures += 1; 
        if (consecutiveFailures >= maxConsecutiveFailures) {
          clearInterval(intervalId);
          triggerLogout();
        }
      }
    },
    1000 * 60 * 14
  ); // 14 minutes

  return intervalId;
};
