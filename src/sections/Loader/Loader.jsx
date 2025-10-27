import React from 'react';

import { Container } from '@mui/material';

import './Loader.css';

function Loader() {
  return (
    <div className="loader">
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />
    </div>
  );
}

const Loading = () => (
  <Container
    sx={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Loader />
  </Container>
);

export default Loading;
