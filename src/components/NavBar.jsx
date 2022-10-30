import { NavLink, Link } from 'react-router-dom';
import { useGlobalContext } from '../GlobalContext.jsx';
import { useState, useEffect } from 'react';
import './NavBar.css';

function NavBar() {
  const { isLoggedIn, itensDaLoja } = useGlobalContext();

  const navBarOneItens = [
    {
      name: isLoggedIn ? 'Profile' : 'Login',
      linkPath: isLoggedIn ? '/profile' : '/login',
    },
    {
      name: 'Favoritados',
      linkPath: '/favoritados',
    },
    {
      name: 'Carrinho',
      linkPath: '/carrinho',
    },
    {
      name: 'Meus pedidos',
      linkPath: '/meus-pedidos',
    },
  ];

  const [search, setSearch] = useState('');
  function editSearch(e) {
    setSearch(e.target.value);
  }
  //se nao achar resultado de pesquisa, bota um li falando que nao achou ://///

  const handleClick = () => {
    setSearch('');
  };

  useEffect(() => {
    const li = document.querySelectorAll('.resultadosDoSearch');
    const ul = document.querySelector('.searchUl ul');
    const novoElemento = document.createElement('li');
    novoElemento.classList.add('novoElemento');
    const selectNovoElemento = document.querySelector('.novoElemento');
    if (li.length === 0 && search.length > 0) {
      if (!!selectNovoElemento) {
        selectNovoElemento.remove();
      }
      novoElemento.innerText =
        'Sem resultados para: "' + search.slice(0, 10) + '...".';
      ul.appendChild(novoElemento);
    } else if (li.length > 0 && search.length > 0) {
      if (!!selectNovoElemento) {
        selectNovoElemento.remove();
      }
    } else if (search.length === 0) {
      if (!!selectNovoElemento) {
        selectNovoElemento.remove();
      }
    }
  }, [search]);

  return (
    <div className='navBarOne'>
      <div className='logo'>
        <NavLink className='linkLindo' to='/'>
          Fictional ecommerce
        </NavLink>
      </div>
      <div className='searchInput'>
        <input value={search} onChange={editSearch} />
        <img
          src='https://cdn-icons-png.flaticon.com/512/109/109859.png'
          alt='no'
        />
        <div className='searchUl'>
          <ul>
            {search.length > 0 &&
              itensDaLoja.map((item, index) => {
                return (
                  item.productTitle
                    .toLowerCase()
                    .includes(search.toLowerCase()) && (
                    <Link
                      className='linkLindo'
                      key={index}
                      to={'/' + item._id}
                      onClick={handleClick}
                    >
                      <li className='resultadosDoSearch'>
                        {item.productTitle.slice(0, 35) + '...'}
                        {item.length >= 36 ? '...' : null}
                      </li>
                    </Link>
                  )
                );
              })}
          </ul>
        </div>
      </div>
      <div>
        <ul className='ulMenuItens'>
          {navBarOneItens.map((item, index) => {
            return (
              <li className='menuItenss' key={index}>
                <NavLink className='linkLindo' to={item.linkPath}>
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
export default NavBar;
