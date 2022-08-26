import NavBar from './NavBar.jsx';
import { useGlobalContext } from '../GlobalContext.jsx';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Footer from './Footer.jsx';

function Favoritados(){
    const {itensDaLoja, favoritos, setFavoritos, carrinhoItens, setCarrinhoItens} = useGlobalContext();
    
    //efeitos nos botoes
    useEffect(() => {
        const botaoAnimation = document.querySelectorAll('.favButComum');
        botaoAnimation.forEach((item)=>{
            item.addEventListener('mousedown', ()=>{
                item.style.transform = 'scale(0.97)';
            });
            document.addEventListener('mouseup', ()=>{
                item.style.transform = 'scale(1)';
            });
        });
    }, [carrinhoItens]);

    //deletar favoritos
    function favDelete(e){
        const idToDelete = e.currentTarget.name;
            setFavoritos(
                favoritos.filter((item)=>{
                    return item !== idToDelete
            })
        );
    }
    //copiar item para o carrinho

    function favToCart(e){
        const itemId = e.currentTarget.name;
        let pricePerItem = '';
        itensDaLoja.forEach((itemZ)=>{
            return itemZ._id === itemId ?
            pricePerItem = itemZ.productPrice
            : null;
        })

        setCarrinhoItens((prevItens)=>{
            let emFalta = 0;
            const itemFound = itensDaLoja.find((item)=>{
                return item._id === itemId;
            })
            if (itemFound.estoque > 1) {
                emFalta = 1;
            } else {
                emFalta = 0;
            }
            const carFilter = prevItens.filter((item)=>{
                return item._id !== itemId;
            })
            return [...carFilter, { _id: itemId, quantidade: emFalta, preco: pricePerItem }]
        })
        e.currentTarget.style.background = 'grey';
        e.currentTarget.innerText = 'Sucess!';
    }

    return (
        <div>
            <NavBar />
            <div className="favoritados">
                <h1 className="favTitle">Favoritos ❤️</h1>
                    
                    {   
                        favoritos.length >= 1 ? 
                            itensDaLoja.map((item, index)=>{
                                return (
                                    favoritos.includes(item._id)?
                                    <div key={index} className="listaDeItens">
                                        <div className="favButtons">
                                            <button name={item._id} onClick={favDelete} className="favExcluir favButComum">
                                                Excluir dos favoritos
                                            </button>
                                            <button name={item._id} onClick={
                                                (e)=>{
                                                    favToCart(e); 
                                                }
                                            } className="favAddCart favButComum">
                                                <h5>Colocar no carrinho</h5>
                                            </button>
                                        </div>
                                        <Link className="linkLindo" to={"/"+item._id}>
                                            <div className="item">
                                                <div className="imgBox">
                                                    <img className="img" src={item.productImg} alt="" />
                                                </div>
                                                <div className="descri">
                                                    <h5 className="desH5">{
                                                        item.productTitle.length >= 48 ?
                                                        item.productTitle.slice(0, 48) + '...'
                                                        : item.productTitle.slice(0, 48)
                                                        }</h5>
                                                    <h5 className="price">{item.productPrice+' R$'}</h5>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                    : null
                                )
                            })
                        : 
                        <div className="ifNotLogged">
                            <h2>Parece que você ainda não favoritou nenhum item.</h2>
                            <h4>Aproveite e favorite seus itens preferidos através da <Link to="/">página principal</Link></h4>
                        </div>
                    }
            </div>
            <Footer />
        </div>
    )
}
export default Favoritados;