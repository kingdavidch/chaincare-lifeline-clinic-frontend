/* eslint-disable import/no-extraneous-dependencies */
import { io } from 'socket.io-client';

const baseURL = import.meta.env.VITE_BASE_URL;

const socket = io(baseURL);

export default socket;
