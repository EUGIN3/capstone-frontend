import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <CircularProgress color="primary"/>
  </div>
);

export default Loader;
