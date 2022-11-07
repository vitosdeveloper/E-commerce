import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Logar.module.css';

const Escolha = () => {
  return (
    <div className={`${styles.form} ${styles.container}`}>
      <Link to='logar' className='loginButtons'>
        Login
      </Link>
      <h4>or</h4>
      <Link to='registrar' className='loginButtons'>
        Register
      </Link>
    </div>
  );
};

export default Escolha;
