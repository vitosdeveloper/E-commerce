import NavBar from './NavBar.jsx'
import { useCarrinhoItens, useSetCarrinhoItens, useItensDaLoja } from '../LoginContext.jsx';
import { Link } from 'react-router-dom';

function Carrinho(){
    //carrinho
    const carrinho = useCarrinhoItens();
    const setCarrinho = useSetCarrinhoItens();
    //todos itens
    const todosItens = useItensDaLoja();


    //deletar do carrinho 
    function carDelete(e){
        const idToDelete = e.target.name;
        setCarrinho(
            carrinho.filter((item)=>{
                return item._id !== idToDelete
            })
        );
    }

    //preço total
    let preco = [];
    todosItens.forEach((item)=>{
        const itemToAdd = parseFloat(item.productPrice.replace(',', '.'));
        carrinho.forEach((carItem)=>{
            if (item._id === carItem._id && item.estoque > 0){
                preco.push(itemToAdd * carItem.quantidade)
            }
        })
    });
    let precoTotal = 0;
    preco.forEach((item)=>{
        precoTotal = precoTotal + item;
    })  

    //add ou remover quantidade
    function addItem(e){
        let itemQuantidade = ++e.currentTarget.id;
        const itemId = e.currentTarget.name;
        const disponiveis = e.currentTarget.value;

        if (itemQuantidade <= disponiveis) {
            const carrinhoFiltrado = carrinho.filter((itemFilter)=>{
                return itemFilter._id !== itemId
            })
            carrinho.forEach((item)=>{
                if (item._id === itemId) {
                    setCarrinho(
                        [...carrinhoFiltrado, { _id: itemId, quantidade: itemQuantidade }]
                    )
                }
            })
        }
    }
    function removerItem(e){
        let itemQuantidade = e.currentTarget.id;
        const itemId = e.currentTarget.name;
        //const disponiveis = e.currentTarget.value;
        if (itemQuantidade > 1) {
            const carrinhoFiltrado = carrinho.filter((itemFilter)=>{
                return itemFilter._id !== itemId
            })
            carrinho.forEach((item)=>{
                if (item._id === itemId) {
                    setCarrinho(
                        [...carrinhoFiltrado, { _id: itemId, quantidade: --itemQuantidade }]
                    )
                }
            })
        }
    }
    

    return (
        <div>
            <NavBar />
            <div className="favoritados">
                <h1 className="favTitle">Carrinho 🛒</h1>

                {
                        carrinho.length > 0 ? 
                            todosItens.map((item, index)=>{
                                return (
                                    carrinho.map((carItem)=>{
                                        return carItem._id === item._id ?
                                            <div key={index} className="listaDeItens">
                                                <div className="favButtons">
                                                    <div className="quantidade">
                                                        
                                                        {
                                                            item.estoque === 0 ?
                                                            <>
                                                                Item atualmente indisponível
                                                            </>
                                                            :
                                                            <>
                                                                <span className="disp">
                                                                    Disponíveis: {item.estoque}
                                                                </span>
                                                                Quantidade:<span> </span>
                                                                <button value={item.estoque} onClick={removerItem} name={item._id} id={carItem.quantidade} className="quantityBut">
                                                                    -
                                                                </button>
                                                                <span> </span>
                                                                {carItem.quantidade}
                                                                <span> </span>
                                                                <button value={item.estoque} onClick={addItem} id={carItem.quantidade} name={item._id} className="quantityBut">
                                                                    +
                                                                </button>
                                                            </>
                                                        }
                                                    </div>
                                                    <button type="submit" name={item._id} onClick={carDelete} className="favAddCart favButComum">
                                                        Excluir do carrinho
                                                    </button>
                                                </div>
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
                                                        <h5 className="price">{item.productPrice}</h5>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        : null
                                    })
                                )
                            })
                        : 
                        <div className="ifNotLogged">
                            <h2>Parece que seu carrinho ainda não possui nenhum item.</h2>
                            <h4><Link to="/">Página principal</Link></h4>
                        </div>
                    }
                    <div className="precoTotal" style={ carrinho.length === 1 ? {marginTop: '60px'} : {}}>
                    {   
                        carrinho.length > 0 ?
                        <h3>Preço total: {precoTotal}</h3>
                        : null
                    }
                    {
                        carrinho.length === 0 ?
                        null
                        :carrinho.length > 1?
                        <button type="submit" className="comprarBut">
                            <h1>Comprar itens</h1>
                        </button>
                        :
                        <button type="submit" className="comprarBut">
                            <h1>Comprar item</h1>
                        </button>
                    }
                    </div>
            </div>
        </div>
    )
}
export default Carrinho;