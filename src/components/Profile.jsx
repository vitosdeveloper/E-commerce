import NavBar from './NavBar.jsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoggedIn, useLoggedInUpdate } from '../LoginContext.jsx';
import { Navigate } from 'react-router-dom';

function Profile(){

    const isLoggedIn = useLoggedIn();
    const setIsLoggedIn = useLoggedInUpdate();

    const [redirect, setRedirect] = useState('');

    function deslogar(){
        setTimeout(() => {
            setRedirect(<Navigate to="/" />)
        }, 1500);
        setIsLoggedIn(false);
        
    }
    function redirecionarLogin() {
        <Navigate to="/login" />
    }

    return (
        <div>
            <NavBar />
            {
                isLoggedIn ?
                <div className="loginScreen">
                    <div className="aboutAcc">
                        <h1>Sobre a conta</h1>
                        <h4>nome:</h4>
                        <p>Leozinho felipe kei parklez loucura haru te amo</p>
                        <h4>endereço:</h4>
                        <p>sim</p>
                    </div>
                    <div className="linksDoProfile">
                        <Link className="linkLindo" to="carrinho"><p>Ir para carrinho</p></Link>
                        <Link className="linkLindo" to="meus-pedidos"><p>Ver para histórico de pedidos</p></Link>
                        <br/><h3 className="loginButtonLogin" onClick={deslogar}>Deslogar</h3>
                    </div>
                    
                </div>
                : <div className="loginScreen">
                    <h4>Logue para acessar essa página.</h4>
                    <h4>Redirecionando...</h4>
                    <br/><h3 className="loginButtonLogin" onClick={redirecionarLogin}>Logar</h3>
                    {redirect}
                </div>
            }
            
        </div>
    )
}
export default Profile;