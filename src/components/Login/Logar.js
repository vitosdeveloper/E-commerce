import React from 'react';
import { Link } from 'react-router-dom';
import useForm from '../../Hooks/useForm';
import Button from '../Form/Button';
import Input from '../Form/Input';
import styles from './Logar.module.css';
import useFetch from '../../Hooks/useFetch';
import Error from '../Helper/Error';

const Logar = () => {
  const { error, loading, logar } = useFetch();

  const username = useForm();
  const password = useForm();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.validate() && password.validate()) {
      const toLogin = {
        user: username.value,
        pass: password.value,
      };
      await logar('post', '/logar', { toLogin });
    }
  };

  return (
    <form className={`${styles.form} container`} onSubmit={handleSubmit}>
      <h1 className='title'>Login</h1>
      <h4>Bem-vindo de volta, </h4>
      <h3>{username.value}</h3>
      <Input type='text' label='Usuário' id='username' {...username} />
      <Input type='password' label='Senha' id='password' {...password} />
      <Error error={error} />
      {loading ? <Button disabled>Logando...</Button> : <Button>Logar</Button>}
      <Link to='/login'>Back</Link>
    </form>
  );
};

export default Logar;
