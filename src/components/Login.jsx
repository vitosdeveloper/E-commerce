import NavBar from './NavBar.jsx';
import { useState } from 'react';
import { useGlobalContext } from '../GlobalContext.jsx';
import { Navigate } from 'react-router-dom';
import Axios from 'axios';
import Footer from './Footer.jsx';

function Login (){
    const {serverUrl, isLoggedIn, setJwt} = useGlobalContext();

    const [logOrReg, setLogOrReg] = useState('choose');
    
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
        }, 500);
    }
    //registro
    const [toRegister, setToRegister] = useState({
        user: '',
        pass: '',
        repeatPass: ''
    })
    function makeRegForm(e){
        const {name, value} = e.target;
        setToRegister((prevValue)=>{
            return {
                ...prevValue,
                [name]: value
            }
        })
    }
    async function registerForm(){
        const logName = document.querySelector('.logName');
        const botao = document.querySelector('.loginButtonLogin');
        botao.style.display = 'none';
        logName.innerText = 'Processando...'
        if (toRegister.pass !== toRegister.repeatPass) {
            logName.innerText = 'Repita a senha corretamente.';
            botao.style.display = 'inline';
        } else {
            if (toRegister.user.length>0
                && toRegister.pass.length>0
                && toRegister.repeatPass.length>0
            ) {
                const response = await Axios.post(serverUrl+"/registerUser", {toRegister});
                if (response.data.status==='success') {
                    logName.innerText = 'Registrado com sucesso!';
                    setLogOrReg('registrou');
                } else {
                    logName.innerText = 'O usuário já está sendo utilizado.';
                    botao.style.display = 'inline';
                }
            } else {
                logName.innerText = 'Preencha todos campos.';
                botao.style.display = 'inline';
            }
        }
    }

    //login
    const [toLogin, setToLogin] = useState({
        user: '',
        pass: ''
    })
    function makeLoginForm(e){
        const {name, value} = e.target;
        setToLogin((prevValue)=>{
            return {
                ...prevValue,
                [name]: value
            }
        })
    }
    async function logar(){
        const resultElement = document.querySelector('.result');
        const botaoLogin = document.querySelector('.loginButtonLogin');
        resultElement.innerText = 'Processando...';
        botaoLogin.style.display = 'none';
        if (toLogin.user.length>0 && toLogin.pass.length>0) {
            try {
                const response = await Axios.post(serverUrl+"/logar", {toLogin});
                if(response.data.status==='success'){
                    setJwt(response.data.jwt);
                    setLogOrReg('logou');
                    logadoComSucesso();
                } else if (response.data.status==='404user'){
                    resultElement.innerText="Usuário não encontrado";
                    resultElement.style.color = '#e91111';
                    botaoLogin.style.display = 'inline';
                } else if (response.data.status==='wrongPass'){
                    resultElement.innerText="Senha incorreta";
                    resultElement.style.color = '#e91111';
                    botaoLogin.style.display = 'inline';
                } 
            } catch(err){
                resultElement.innerText="Algo errado com o servidor. @_@";
                resultElement.style.color = '#e91111';
            }
        } else {
            document.querySelector('.logName').innerText = 'Preencha todos campos.';
            botaoLogin.style.display = 'inline';
            resultElement.innerText = '';
        }
    }

    return (
        <div>
            <NavBar />
            <div className="loginOrRegister">
                {isLoggedIn ? <Navigate to="/" /> :
                    logOrReg==='choose' ?
                        <div className="logChoose">
                            <h3 className="loginButtons" onClick={()=>{setLogOrReg('log')}}>Login</h3> 
                            <h4 className="loginOr">or</h4>
                            <h3 className="loginButtons" onClick={()=>{setLogOrReg('reg')}}>Register</h3>
                        </div>
                    : logOrReg==='log' ?
                        <div>
                        <form id="loginForm" action="submit">
                            <h3>Login</h3>
                            <h4>Bem-vindo de volta, </h4>
                            <h3 className="logName" value={toLogin.user}>{toLogin.user}</h3><br/>
                            <input 
                            name="user" 
                            value={toLogin.user} 
                            onChange={makeLoginForm} 
                            type="text" placeholder='Login' maxLength='32' className="loginInput" />
                            <input 
                            value={toLogin.pass} 
                            name="pass" 
                            onChange={makeLoginForm} 
                            type='password' placeholder='Password' className="loginInput"></input>
                            <br/>
                            <h3 className="loginButtonLogin" type="submit" 
                            onClick={logar}
                            >Login</h3><br/>
                            <h5 className="result" style={{position: 'absolute', left:'50%', top: '68%', transform: 'translate(-50%, -50%)'}}> </h5>
                            <h3 className="loginButtonsBack" onClick={()=>{setLogOrReg('choose')}}>Back</h3>
                        </form>
                        </div>
                        
                        
                    : logOrReg==='reg' ?
                        <div>
                            <h3>Register</h3>
                            <h4>Seja bem-vindo, </h4>
                            <h3 className="logName" value={toRegister.user}>{toRegister.user}</h3><br/>
                            <input type="text" placeholder='Login' maxLength='32' className="loginInput" 
                            name="user"
                            onChange={(e)=>{
                                makeRegForm(e);
                                }}
                            value={toRegister.user}
                            />
                            <input type='password' placeholder='Password' className="loginInput" 
                            name="pass" 
                            onChange={(e)=>{
                                makeRegForm(e);
                            }}
                            value={toRegister.pass}
                            />
                            <input type='password' placeholder='Repeat password' className="loginInput" 
                            name="repeatPass"
                            onChange={(e)=>{
                                makeRegForm(e);
                            }}
                            value={toRegister.repeatPass}
                            />
                            <br/>
                            <h3 className="loginButtonLogin" onClick={registerForm}>Register</h3><br/>
                            <h3 className="regButtonsBack" onClick={()=>{setLogOrReg('choose')}}>Back</h3>
                        </div>
                    : logOrReg==='processando' ?  
                        <div className="logou">
                            <h4>Processando</h4>
                            <h4>Por favor, aguarde...</h4>
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
            <div style={{position: 'relative', top: '60px'}}>
                <Footer />
            </div>
        </div>
    )
}
export default Login;