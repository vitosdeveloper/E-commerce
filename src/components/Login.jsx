import NavBar from './NavBar.jsx';
import { useState } from 'react';
import useGlobalStorage from 'use-global-storage';

function Login (){
    const useStorage = useGlobalStorage({
        storageOptions: { name: 'store-db' }
    });
    // eslint-disable-next-line
    const [isLoggedIn, setIsLoggedIn] = useStorage('loggin', false);

    const [logOrReg, setLogOrReg] = useState('choose');
    const [loginName, setLoginName] = useState('');
    //preview do login no bem-vindo
    function changeLogin(e){
        setLoginName(e.target.value)
    }
    //redirecionar do registro para o login
    function redirectReg(){
        setTimeout(() => {
            setLogOrReg('log')
        }, 1500);
    }
    //redirect após logado para a home
    function logadoComSucesso(){
        setTimeout(() => {
            window.location.href = '/';
            setIsLoggedIn(true)
        }, 1500);
    }

    return (
        <div>
            <NavBar />
            <div className="loginOrRegister">
                {
                    logOrReg==='choose' ?
                        <div className="logChoose">
                            <h3 className="loginButtons" onClick={()=>{setLogOrReg('log')}}>Login</h3> 
                            <h4 className="loginOr">or</h4>
                            <h3 className="loginButtons" onClick={()=>{setLogOrReg('reg')}}>Register</h3>
                        </div>
                    : logOrReg==='log' ?
                        <div>
                            <h3>Login</h3>
                            <h4>Bem-vindo de volta, </h4>
                            <h3 className="logName" value={loginName}>{loginName}</h3><br/>
                            <input type="text" placeholder='Login' maxLength='32' className="loginInput" onChange={(e)=>{changeLogin(e)}}></input>
                            <input type='password' placeholder='Password' className="loginInput"></input>
                            <br/>
                            <h3 className="loginButtonLogin" onClick={()=>{setLogOrReg('logou'); logadoComSucesso()}}>Login</h3><br/>
                            <h3 className="loginButtonsBack" onClick={()=>{setLogOrReg('choose')}}>Back</h3>
                        </div>
                        
                    : logOrReg==='reg' ?
                        <div>
                            <h3>Register</h3>
                            <h4>Seja bem-vindo, </h4>
                            <h3 className="logName" value={loginName}>{loginName}</h3><br/>
                            <input type="text" placeholder='Login' maxLength='32' className="loginInput" onChange={(e)=>{changeLogin(e)}}></input>
                            <input type='password' placeholder='Password' className="loginInput"></input>
                            <input type='password' placeholder='Repeat password' className="loginInput"></input>
                            <br/>
                            <h3 className="loginButtonLogin" onClick={()=>{setLogOrReg('registrou')}}>Register</h3><br/>
                            <h3 className="regButtonsBack" onClick={()=>{setLogOrReg('choose')}}>Back</h3>
                        </div>
                    : logOrReg==='logou' ?
                        <div className="logou">
                            <h4>Logado com sucesso!</h4>
                            <h4>Redirecionando...</h4>
                        </div>
                    : logOrReg==='registrou' ?
                        <div className="logou">
                            {redirectReg()}
                            <h4>Registrado com sucesso!</h4>
                            <h4>Faça login!</h4>
                        </div>
                    : null
                }
                
            </div>
        </div>
    )
}
export default Login;