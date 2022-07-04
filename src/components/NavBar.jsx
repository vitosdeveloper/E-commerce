import { Link } from 'react-router-dom';
import { useLoggedIn } from '../LoginContext.jsx';
import { useUsuarioDados } from '../LoginContext.jsx';

function NavBar() {
    const isLoggedIn = useLoggedIn();
    //const setIsLoggedIn = useLoggedInUpdate;
    const usuarioDados = useUsuarioDados();

    const navBarOneItens = [
      {
        name: isLoggedIn ? 'Ola, ' + usuarioDados.nome.slice(0, usuarioDados.nome.indexOf(' ')) : "Login/Register",
        linkPath: isLoggedIn ? '/profile' : '/login'
      }, {
        name: 'Favoritados',
        linkPath: '/favoritados'
      }, {
        name: 'Carrinho',
        linkPath: '/carrinho'
      }, {
        name: 'Meus pedidos',
        linkPath: '/meus-pedidos'
      }
    ];
    
    return (
        <div className="navBarOne">
            <div className="logo">
              <Link className="linkLindo" to="/">Fictional ecommerce</Link>
            </div>
            <div className="searchInput">
              <input />
              <img src="https://cdn-icons-png.flaticon.com/512/109/109859.png" alt="no" />
            </div>
            <div>
              <ul>
                {navBarOneItens.map((item, index)=>{
                  return <li key={index}><Link className="linkLindo" to={item.linkPath}>{item.name}</Link></li>
                })}
              </ul>
            </div>
        </div>
    )
}
export default NavBar;