function NavBar(props) {
    //pra cada item adicionado, ajustar margin-top do 
    //.navContainer .listMaker.instaHideIt 
    //e do .navContainer .listMaker.hidding
    const navBarOneItens = [
      {
        name: props.isLoggedIn? 'Home' : "Login/Register"
      }, {
        name: 'Carrinho'
      }, {
        name: 'Favoritados'
      }, {
        name: 'Meus pedidos'
      }
    ];
    
    return (
        <div className="navBarOne">
            <div className="logo">
              Fictional ecommerce
            </div>
            <div className="searchInput">
              <input />
              <img src="https://cdn-icons-png.flaticon.com/512/109/109859.png" alt="no" />
            </div>
            <div>
              <ul>
                {navBarOneItens.map((item, index)=>{
                  return <li key={index}>{item.name}</li>
                })}
              </ul>
            </div>
        </div>
    )
}
export default NavBar;