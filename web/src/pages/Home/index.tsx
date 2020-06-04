import React from 'react';
import { Link } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'

import './style.scss'
import data from './data';
import { Header } from '../../components';

const Home: React.FC = () => {
  return (
    <div id="page-home">
      <div className="content">
        <Header />

        <main>
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          
          <Link to={data.link.href} >
            <span>
              <FiLogIn />
            </span>
            <strong>
              {data.link.title}
            </strong>
          </Link>
        </main>
      </div>
    </div>
  )
}

export default Home;