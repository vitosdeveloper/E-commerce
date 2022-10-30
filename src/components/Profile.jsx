import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext, useSetGlobalContext } from '../GlobalContext.jsx';
import { Navigate } from 'react-router-dom';
import Axios from 'axios';
import Footer from './Footer.jsx';

function Profile() {
  const setGlobalContext = useSetGlobalContext();
  const { isLoggedIn, usuariosDados, serverUrl, jwt, setJwt } =
    useGlobalContext();

  const [redirect, setRedirect] = useState('');
  const [editando, setEditando] = useState(false);
  const [backupInfo, setBackupInfo] = useState({});
  function editToggle() {
    profResHtml().innerText = '';
    !editando ? setEditando(true) : setEditando(false);
  }
  function editarDeFato(e) {
    const { value, name } = e.target;
    setGlobalContext((prev) => {
      return {
        ...prev,
        usuariosDados: {
          ...prev.usuariosDados,
          [name]: value,
        },
      };
    });
  }
  //pro botao cancelar do editar
  function backupDasInfos() {
    setBackupInfo(usuariosDados);
  }
  function voltarAoBackup() {
    setGlobalContext((prev) => {
      return {
        ...prev,
        usuariosDados: backupInfo,
      };
    });
    //setUsuarioDados(backupInfo)
  }

  function deslogar() {
    setGlobalContext((prev) => {
      return {
        ...prev,
        isLoggedIn: false,
        usuariosDados: {
          _id: '',
          login: '',
          nome: '',
          endereco: '',
          sexo: '',
          itensComprados: [],
        },
      };
    });
    setTimeout(() => {
      setRedirect(<Navigate to='/' />);
    }, 1500);
    setJwt();
  }
  //nao da pra declarar como constante fora da function porque na primeira lida o elemento realmente n existe,
  //já que no lugar da tela de profile, está a tela/component de login no lugar
  function profResHtml() {
    const profileResult = document.querySelector('.profileChangeResult');
    return profileResult;
  }

  async function enviarForm() {
    try {
      const dadosComJwt = { ...usuariosDados, jwt };
      profResHtml().style.opacity = '100';
      profResHtml().style.color = 'black';
      profResHtml().innerText = 'Processando...';
      const response = await Axios.post(serverUrl + '/editarUser', {
        dadosComJwt,
      });
      if (response.data.status === 'success') {
        setJwt(response.data.jwt);
        profResHtml().innerText = 'Alterações realizadas com sucesso.';
        profResHtml().style.color = 'green';
      } else if (response.data.status === 'err') {
        profResHtml().innerText =
          'Houve algum erro. Por favor, tente mais tarde..';
        profResHtml().style.color = 'red';
      }
    } catch (err) {
      profResHtml().innerText =
        'Algo errado com o servidor. Por favor, tente mais tarde..';
      profResHtml().style.color = 'red';
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        <div className='loginScreen'>
          <div className='aboutAcc'>
            <h1>Sobre a conta</h1>
            <h4>Nome:</h4>
            {!editando ? (
              <p>{usuariosDados.nome}</p>
            ) : (
              <input
                placeholder='Insira seu nome'
                maxLength='50'
                value={usuariosDados.nome}
                name='nome'
                onChange={editarDeFato}
                className='inputEdit'
              />
            )}
            <h4>Endereço:</h4>
            {!editando ? (
              <p>{usuariosDados.endereco}</p>
            ) : (
              <div>
                <input
                  placeholder='Insira seu endereço'
                  value={usuariosDados.endereco}
                  name='endereco'
                  onChange={editarDeFato}
                  className='inputEdit'
                />
                <br />
              </div>
            )}
            <h4>Sexo:</h4>
            {!editando ? (
              <p>{usuariosDados.sexo}</p>
            ) : (
              <div>
                <select
                  className='inputEdit'
                  name='sexo'
                  onChange={editarDeFato}
                >
                  <option value=''>Escolha seu sexo</option>
                  <option value='Masculino'>Masculino</option>
                  <option value='Feminino'>Feminino</option>
                  <option value='Não-binário'>Não-binário</option>
                  <option value='Prefiro não informar'>
                    Prefiro não informar
                  </option>
                  <option value='Outros'>Outros</option>
                </select>
                <br />
              </div>
            )}
            {!editando ? (
              <button
                className='editButton'
                onClick={() => {
                  editToggle();
                  backupDasInfos();
                }}
              >
                Editar profile
              </button>
            ) : (
              <div>
                <button
                  className='editButton'
                  onClick={() => {
                    editToggle();
                    enviarForm();
                  }}
                >
                  Salvar
                </button>
                <br />
                <button
                  className='editButton'
                  onClick={() => {
                    editToggle();
                    voltarAoBackup();
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
          <div>
            <h4
              className='profileChangeResult'
              style={{ opacity: '0', margin: '0' }}
            >
              {' '}
            </h4>
          </div>
          <div className='linksDoProfile'>
            <Link className='linkLindo' to='/carrinho'>
              <p>Ir para carrinho</p>
            </Link>
            <Link className='linkLindo' to='/meus-pedidos'>
              <p>Ver para histórico de pedidos</p>
            </Link>
            <br />
            <h3 className='logoffButtonLogin' onClick={deslogar}>
              Deslogar
            </h3>
          </div>
        </div>
      ) : (
        <div className='loginScreen'>
          <h4>Logue para acessar essa página.</h4>
          <h4>Redirecionando...</h4>
          <br />
          <Link to='/login'>
            <h3 className='loginButtonLogin'>Logar</h3>
          </Link>
          {redirect}
        </div>
      )}
      <Footer />
    </div>
  );
}
export default Profile;
