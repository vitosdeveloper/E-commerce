import NavBar from './NavBar.jsx';
import useGlobalStorage from 'use-global-storage';
import { Link } from 'react-router-dom';

function Profile(){
    const useStorage = useGlobalStorage({
        storageOptions: { name: 'store-db' }
    });
    // eslint-disable-next-line
    const [isLoggedIn, setIsLoggedIn] = useStorage('loggin', false);

    function deslogar(){
        window.location.href = '/';
        setIsLoggedIn(false)
    }
    function redirecionarLogin() {
        window.location.href = '/login';
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
                </div>
            }
        </div>
    )
}
export default Profile;