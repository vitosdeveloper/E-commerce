import NavBar from './NavBar.jsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoggedIn, useLoggedInUpdate, useUsuarioDados, useSetUsuarioDados, useSetJwt, useJwt, useCheckJwt } from '../LoginContext.jsx';
import { Navigate } from 'react-router-dom';
import Axios from 'axios';
import { useEffect } from 'react';

function Profile(){

    const jwt = useJwt();
    const setJwt = useSetJwt();

    const checkJwt = useCheckJwt();

    const isLoggedIn = useLoggedIn();
    const setIsLoggedIn = useLoggedInUpdate();
    const [redirect, setRedirect] = useState('');
 
    const usuarioDados = useUsuarioDados();
    const setUsuarioDados = useSetUsuarioDados();

    const [editando, setEditando] = useState(false);
    const [backupInfo, setBackupInfo] = useState({});
    function editToggle(){
        !editando ? setEditando(true) : setEditando(false)
    };
    function editarDeFato(e){
        const {value, name} = e.target;
        setUsuarioDados((lastValues)=>{
            return {
                ...lastValues,
                [name]: value,
            }
        })
    };
    //pro botao cancelar do editar
    function backupDasInfos(){
        setBackupInfo(usuarioDados)
    };
    function voltarAoBackup(){
        setUsuarioDados(backupInfo)
    };

    function deslogar(){
        setTimeout(() => {
            setRedirect(<Navigate to="/" />)
        }, 1500);
        setIsLoggedIn(false);
        setJwt();
        setUsuarioDados({
            _id: '',
            login: '',
            nome: '',
            endereco: '',
            sexo: '',
            itensComprados: []
        })
    };

    function enviarForm(){
            const dadosComJwt = {...usuarioDados, jwt};

            Axios.post('http://localhost:5000/editarUser', {dadosComJwt})
            .then((response)=>{
                const profileResult = document.querySelector('.profileChangeResult');
                if (response.data.status==='success') {
                    setJwt(response.data.jwt);
                    profileResult.innerText = 'Alterações realizadas com sucesso. Relogue aplicar as alterações.';
                    profileResult.style.color = 'green';
                    profileResult.style.opacity = '100';
                } else if (response.data.status==='err') {
                    profileResult.innerText = 'Houve algum erro. Por favor, tente mais tarde..';
                    profileResult.style.color = 'red';
                    profileResult.style.opacity = '100';
                }
            })
    }

    //useEffect(()=>{
    //    checkJwt();
    //    // eslint-disable-next-line
    //}, [])

    return (
        <div>
            <NavBar />
            {
                isLoggedIn ?
                <div className="loginScreen">
                    <div className="aboutAcc">
                        <h1>Sobre a conta</h1>
                        <h4>Nome:</h4>
                        {!editando ? <p>{usuarioDados.nome}</p> : <input placeholder="Insira seu nome" maxLength="50" value={usuarioDados.nome} name="nome" onChange={editarDeFato} className="inputEdit"/>}
                        <h4>Endereço:</h4>
                        {!editando ? <p>{usuarioDados.endereco}</p> : <div><input placeholder="Insira seu endereço" value={usuarioDados.endereco} name="endereco" onChange={editarDeFato} className="inputEdit"/><br/></div>}
                        <h4>Sexo:</h4>
                        {
                        !editando ? <p>{usuarioDados.sexo}</p> : 
                            <div>
                                <select className="inputEdit" name="sexo" onChange={editarDeFato}>
	                                	<option value="">Escolha seu sexo</option>
	                                	<option value="Masculino">Masculino</option>
	                                	<option value="Feminino">Feminino</option>
	                                	<option value="Não-binário">Não-binário</option>
	                                	<option value="Prefiro não informar">Prefiro não informar</option>
	                                	<option value="Outros">Outros</option>
	                            </select><br/>
                            </div>
                        }
                        {!editando ? <button className="editButton" onClick={()=>{editToggle(); backupDasInfos();}}>Editar profile</button> : 
                        <div>
                            <button className="editButton" onClick={()=>{editToggle(); enviarForm();}}>Salvar</button><br/><button className="editButton" onClick={()=>{editToggle(); voltarAoBackup();}}>Cancelar</button>
                        </div>}
                    </div>
                    {!editando ?
                    <h4 className="profileChangeResult" style={{opacity: '0', margin: '0'}}>hidden content</h4>
                    : null
                    }
                    <div className="linksDoProfile">
                        <Link className="linkLindo" to="/carrinho"><p>Ir para carrinho</p></Link>
                        <Link className="linkLindo" to="/meus-pedidos"><p>Ver para histórico de pedidos</p></Link>
                        <br/><h3 className="logoffButtonLogin" onClick={deslogar}>Deslogar</h3>
                    </div>
                    
                </div>
                : <div className="loginScreen">
                    <h4>Logue para acessar essa página.</h4>
                    <h4>Redirecionando...</h4>
                    <br/><Link to="/login"><h3 className="loginButtonLogin">Logar</h3></Link>
                    {redirect}
                </div>
            }
        </div>
    )
}
export default Profile;