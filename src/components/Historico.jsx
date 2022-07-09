import NavBar from './NavBar.jsx';
import { useUsuarioDados, useItensDaLoja, useLoggedIn } from '../LoginContext.jsx';
import { Link } from 'react-router-dom';

function Historico(){
    const usuarioDados = useUsuarioDados();
    const itensDaLoja = useItensDaLoja();
    const isloggedIn = useLoggedIn();

    return (
        <div>
            <NavBar />
            
            <div className="favoritados">
                <h1 className="favTitle">Meus pedidos ⌛</h1>
                {    !isloggedIn?
                    
                    <div className="ifNotLogged">
                        <h2>Você precisa logar para acessar essa página.</h2>
                        <h4><Link to="/login">Login/Register</Link></h4>
                    </div> 
                    : isloggedIn === true && usuarioDados.itensComprados.length > 0 ?

                    usuarioDados.itensComprados.map((item, index)=>{
                        return (
                            <div key={index} className="historicoLista">
                                <h3>Data e horário da compra: {item.detalhes.dataDaCompra}</h3>
                                
                                    {   
                                        item.itens.map((itemToPost, indexToPost)=>{
                                            
                                            return  (   
                                                        <div key={indexToPost}>
                                                            {   
                                                                itensDaLoja.map((readyToPost, readyIndex)=>{
                                                                    return (
                                                                        readyToPost._id === itemToPost._id ?
                                                                        <div className="readyItem" key={readyIndex}>
                                                                            <div className="imgBox">
                                                                                <img className="img" src={readyToPost.productImg} alt="" />
                                                                            </div>
                                                                            <div className="descri">
                                                                                <h2>
                                                                                    {readyToPost.productTitle}
                                                                                </h2>
                                                                            </div>
                                                                            <h4>Quantidade: {itemToPost.quantidade}</h4>
                                                                            <h4 className="segundaInfo">Preço por unidade: {itemToPost.preco} R$</h4>
                                                                        </div>
                                                                        :
                                                                        null
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    )
                                                })
                                    }
                                
                                <h1 className="precoTotalHist">Preço total: {item.detalhes.valor} R$.</h1>
                            </div>
                        )
                    })
                    : isloggedIn === true && usuarioDados.itensComprados.length === 0 ?
                        <div className="ifNotLogged">
                            <h2>Parece que você ainda não comprou nada.</h2>
                            <h4>Aproveite e encomende seus itens preferidos através da <Link to="/">página principal</Link></h4>
                        </div>  
                      
                    : null
                }
                
            </div>
        </div>
    )
}
export default Historico;