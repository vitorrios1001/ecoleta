import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import { Home, CreatePoint } from '../pages'

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreatePoint} path="/create-point" />
    </BrowserRouter>
  );
}

export default Routes;