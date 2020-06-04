import React from 'react';

import logo from '../../assets/logo.svg'

const Header: React.FC = ({ children }) => {
  return (
    <header>
      <img src={logo} alt="Ecoleta"/>
      {children}
    </header>
  )
}

export default Header;