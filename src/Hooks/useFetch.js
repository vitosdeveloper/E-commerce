import Axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../GlobalContext';

const useFetch = () => {
  const { serverUrl, setJwt } = useGlobalContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logar = async (method, route, body) => {
    let response;
    try {
      setError(null);
      setLoading(true);
      response = await Axios[method](serverUrl + route, body);
      if (response.data.status === 'wrongPass')
        throw new Error('Senha incorreta.');
      if (response.data.status === '404user')
        throw new Error('Usuário inexistente.');
      if (response.data.status !== 'success' || !response.data.status)
        throw new Error('Houve algum erro.');
    } catch (err) {
      response = null;
      setLoading(false);
      setError(err.message);
    } finally {
      setLoading(false);
      if (response) {
        setJwt(response.data.jwt);
        navigate('/login/logou');
      } else {
        setJwt('');
      }
    }
  };

  const registrar = async (method, route, body) => {
    let response;
    try {
      setError(null);
      setLoading(true);
      response = await Axios[method](serverUrl + route, body);
      if (response.data.status === 'err')
        throw new Error('O usuário já existe.');
    } catch (err) {
      response = null;
      setLoading(false);
      setError(err.message);
    } finally {
      setLoading(false);
      if (response) {
        navigate('/login/registrou');
      } else {
        setJwt('');
      }
    }
  };

  return {
    error,
    loading,
    logar,
    registrar,
  };
};

export default useFetch;
