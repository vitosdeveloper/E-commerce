import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Logar.module.css';

const Registrou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/login/logar');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);
  return (
    <div className={`${styles.form} container`}>
      <h2>Registrado com sucesso!</h2>
      <h3>Redirecionando...</h3>
    </div>
  );
};

export default Registrou;
