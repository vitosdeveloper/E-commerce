import NavBar from './NavBar.jsx';
import { useState } from 'react';
import { useLoggedIn, useLoggedInUpdate, useSetJwt } from '../LoginContext.jsx';
//pegar url atual e tals
import { Navigate } from 'react-router-dom';
import Axios from 'axios';
import Footer from './Footer.jsx';

function Login (){
    const isLoggedIn = useLoggedIn();
    const setIsLoggedIn = useLoggedInUpdate();
    const setJwt = useSetJwt();

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
            setIsLoggedIn(true)
        }, 2500);
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
    function registerForm(){
        if (toRegister.pass !== toRegister.repeatPass) {
            document.querySelector('.logName').innerText = 'Repita a senha corretamente.'
        } else {
            if (toRegister.user.length>0
                && toRegister.pass.length>0
                && toRegister.repeatPass.length>0
            ) {
                Axios.post("https://ecommercefakedb.herokuapp.com/registerUser", {toRegister})
                .then(response => {
                    if (response.data.status==='success') {
                        document.querySelector('.logName').innerText = 'Registrado com sucesso!';
                        setLogOrReg('registrou');
                    } else {
                        document.querySelector('.logName').innerText = 'O usuário já está sendo utilizado.'
                    }
                })
            } else {
                document.querySelector('.logName').innerText = 'Preencha todos campos.'
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
    function logar(){
        if (toLogin.user.length>0 && toLogin.pass.length>0) {
            Axios.post("https://ecommercefakedb.herokuapp.com/logar", {toLogin})
            .then(response => {
                const result = document.querySelector('.result');
                if(response.data.status==='success'){
                    setJwt(response.data.jwt);
                    result.innerText="Logado com sucesso!";
                    result.style.color = 'green';
                    //passar o jwt pro useLocalStorage
                    //depois, sempre q ele for validado com açao do usuário
                    //o site será alimentado no useState
                    setLogOrReg('logou');
                    logadoComSucesso();
                } else if (response.data.status==='404user'){
                    result.innerText="Usuário não encontrado";
                    result.style.color = '#e91111';
                } else if (response.data.status==='wrongPass'){
                    result.innerText="Senha incorreta";
                    result.style.color = '#e91111';
                }
            })
        } else {
            document.querySelector('.logName').innerText = 'Preencha todos campos.'
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
                            <h3 className="loginButtonLogin" 
                            onClick={logar}
                            >Login</h3><br/>
                            <h5 className="result" style={{position: 'absolute', left:'50%', top: '68%', transform: 'translate(-50%, -50%)'}}> </h5>
                            <h3 className="loginButtonsBack" onClick={()=>{setLogOrReg('choose')}}>Back</h3>
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