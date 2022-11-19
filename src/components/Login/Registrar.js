import { useRef } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../Hooks/useFetch';
import useForm from '../../Hooks/useForm';
import Button from '../Form/Button';
import Input from '../Form/Input';
import Error from '../Helper/Error';
import styles from './Logar.module.css';

const Registrar = () => {
  const { error, loading, registrar } = useFetch();
  const username = useForm();
  const password = useForm();
  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.validate() && password.validate()) {
      const toRegister = {
        user: username.value,
        pass: password.value,
        repeatPass: password.value,
      };
      await registrar('post', '/registerUser', { toRegister });
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form className={`${styles.form} container`} onSubmit={handleSubmit}>
      <h1 className='title'>Registrar</h1>
      <h4>Preencha o formulário</h4>
      <Input
        inputRefReg={inputRef}
        type='text'
        label='Usuário'
        id='username'
        {...username}
      />
      <Input type='password' label='Senha' id='password' {...password} />
      <Error error={error} />
      {loading ? (
        <Button disabled>Registrando...</Button>
      ) : (
        <Button>Registrar</Button>
      )}
      <Link to='/login'>Back</Link>
    </form>
  );
};

export default Registrar;
