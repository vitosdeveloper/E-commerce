import NavBar from './NavBar.jsx'
import { useGlobalContext } from '../GlobalContext.jsx';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Axios from 'axios';
import Footer from './Footer.jsx';

function Carrinho(){
    const {checkJwt, itensDaLoja, isLoggedIn, usuariosDados, serverUrl, jwt, setJwt, setCarrinhoItens, carrinhoItens} = useGlobalContext();
    
    const [redirectPosCompra, setRedirectPosCompra] = useState(false);

    //deletar do carrinho 
    function carDelete(e){
        const idToDelete = e.target.name;
        setCarrinhoItens(
            carrinhoItens.filter((item)=>{
                return item._id !== idToDelete
            })
        );
    }

    //preço total
    let preco = [];
    itensDaLoja.forEach((item)=>{
        const itemToAdd = parseFloat(item.productPrice.replace(',', '.'));
        carrinhoItens.forEach((carItem)=>{
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
        const precoDoItem = e.currentTarget.getAttribute('href');
        if (itemQuantidade <= disponiveis) {
            carrinhoItens.forEach((item)=>{
                if (item._id === itemId) {
                    setCarrinhoItens((lastValues)=>{
                        const carrinhoFiltrado = lastValues.filter((itemFilter)=>{
                            return itemFilter._id !== itemId
                        })
                        return [...carrinhoFiltrado, { _id: itemId, quantidade: itemQuantidade, preco: precoDoItem }]
                    } 
                )}
            })
        }
    }
    function removerItem(e){
        let itemQuantidade = e.currentTarget.id;
        const itemId = e.currentTarget.name;
        const precoDoItem = e.currentTarget.getAttribute('href');
        if (itemQuantidade > 1) {
            carrinhoItens.forEach((item)=>{
                if (item._id === itemId) {
                    setCarrinhoItens((lastValues)=>{
                        const carrinhoFiltrado = lastValues.filter((itemFilter)=>{
                            return itemFilter._id !== itemId
                        })
                        return [...carrinhoFiltrado, { _id: itemId, quantidade: --itemQuantidade, preco: precoDoItem }]
                    })
                }
            })
        }
    }
    //confirmação de compra, endereço, método de pagamento, frete
    const [confirmarCompra, setConfirmarCompra] = useState(false);

    //depois fazer formulário e enviar os dados pra db com axios ou algo, testar com console.log
    async function formularioDaCompra(){
        const diaCompleto = new Date();
        
        //lembrar de descontar do estoque
        let amOrPm = '';
        if (diaCompleto.getHours() < 12) {
            amOrPm = ' am';
        } else {
            amOrPm = ' pm';
        }
        const horario = (diaCompleto.getMonth()+1).toString().padStart(2, 0)+'/'+diaCompleto.getDate().toString().padStart(2, 0)+', às '+diaCompleto.getHours().toString().padStart(2, 0)+':'+(diaCompleto.getMinutes().toString().padStart(2, 0));

        const carrinhoFiltrado = carrinhoItens.filter((item)=>{
            return item.quantidade >= 1;
        })
    
        const formulario = {
            userId: usuariosDados._id,
            valorDaCompra: precoTotal,
            itensByIdAndItsQuantity: carrinhoFiltrado,
            horarioDeCompra: horario+amOrPm,
            jwt: jwt
        }

        document.querySelector('button.finalizarCompra').remove();
        document.querySelector('.divResponse').innerText = "Processando...";

        const response = await Axios.post(serverUrl+"/efetuarCompra", {formulario});
        if (response.data.status==="success") {
            setJwt(response.data.jwt);
            setConfirmarCompra(false);
            setCarrinhoItens([])
            setRedirectPosCompra(<Navigate to="/success" />);
        } else if (response.data.status==="err") {
            document.querySelector('.divResponse').innerText = "Alguma coisa deu errado, relogue e tente novamente.";
            setTimeout(() => {
                checkJwt();
                setRedirectPosCompra(<Navigate to="/login" />);
            }, 2000);
        } else if (response.data.status==='estoqueFail'){
            document.querySelector('.divResponse').innerText = "Algum dos itens está fora de estoque!";
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }

    return (
        <div>
            <NavBar />
            <div className="favoritados">
                <h1 className="favTitle">Carrinho 🛒</h1>

                {
                    carrinhoItens.length > 0 ? 
                            itensDaLoja.map((item, index)=>{
                                return (
                                    carrinhoItens.map((carItem)=>{
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
                                                                <div className="maisOuMenos">
                                                                    <button value={item.estoque} 
                                                                    onClick={removerItem} name={item._id} href={item.productPrice} id={carItem.quantidade} className="quantityBut">
                                                                        -
                                                                    </button>
                                                                    <span> </span>
                                                                    {carItem.quantidade}
                                                                    <span> </span>
                                                                    <button value={item.estoque} href={item.productPrice} onClick={addItem} id={carItem.quantidade} name={item._id} 
                                                                    className="quantityBut">
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </>
                                                        }
                                                    </div>
                                                    <button type="submit" name={item._id} onClick={carDelete} className="favAddCart favButComum">
                                                        Excluir do carrinho
                                                    </button>
                                                </div>
                                                <Link className="linkLindo" to={"/"+item._id}>
                                                    <div className="item">
                                                        <div className="imgBox">
                                                            <img className="img" src={item.productImg} alt="" />
                                                        </div>
                                                        <div className="descri fromCar">
                                                            <h5 className="desH5">{
                                                                item.productTitle.length >= 35 ?
                                                                item.productTitle.slice(0, 35) + '...'
                                                                : item.productTitle.slice(0, 35)
                                                                }</h5>
                                                            <h5 className="price">
                                                            {'R$ '+item.productPrice}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </Link>
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
                    <div className="precoTotal" style={ carrinhoItens.length === 1 ? {marginTop: '60px'} : {}}>
                    {   
                        carrinhoItens.length > 0 ?
                        <h3>Preço total: <br />{precoTotal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}</h3>
                        : null
                    }
                    {
                        carrinhoItens.length === 0 ?
                            null
                            :
                            isLoggedIn === false ?
                                <Link className="link" to="/login">
                                    <button type="submit" className="loguePls">
                                    <h1>Logue para efetuar a compra!</h1>
                                </button></Link>
                        
                            :carrinhoItens.length > 1?
                                <button onClick={()=>{checkJwt(); setConfirmarCompra(true); window.scrollTo({top: 0, behavior: "smooth"})}} type="submit" className="comprarBut">
                                    <h1>Comprar itens</h1>
                                </button>
                            :
                                <button onClick={()=>{checkJwt(); setConfirmarCompra(true)}} type="submit" className="comprarBut">
                                    <h1>Comprar item</h1>
                                </button>
                    }
                </div>
            </div><Footer />
            
            {confirmarCompra?
                <div className="confirmarCompra">
                <div>
                    <span className='closeWindow' onClick={()=>{
                        setConfirmarCompra(false);
                    }}>🗙</span>
                    <h4>Seu endereço:</h4>
                    <small><p>{usuariosDados.endereco.slice(0, 26) + '...'}</p></small>
                    <Link to="/profile"><button className="trocarEndereço">Trocar meu endereço</button></Link>
                    <h4>Escolha o serviço de frete:</h4>
                    <div>
	                    <select className="inputEdit" name="sexo">
	                    	<option value="">PAC</option>
	                    	<option value="Masculino">Sedex</option>
	                    	<option value="Feminino">Sedex Hoje</option>
	                    	<option value="Não-binário">Correio Mini Envios</option>
	                    </select><br/>
                    </div>
                    <div>
                        <h4 className="card">Cartão:</h4>
                        <p>****-****-****-8477 (Visa)</p>
                    </div>
                    <div>
                        <h3 className="totalAPager">Total a pagar:</h3><br/>
                        <h1 className="valorTotal">{precoTotal}</h1>
                    </div>
                </div>
                <div className="divResponse">
                    {
                        precoTotal !== 0 ?
                            <button onClick={formularioDaCompra} className="finalizarCompra"><h2>Efetuar compra</h2></button>
                        :   <button className="finalizarCompra"><h2 style={{textAlign: 'center'}}>Item fora de estoque</h2></button>
                    }
                    
                </div>
            </div>
            : null
            }
            {redirectPosCompra}
            
        </div>
    )
}
export default Carrinho;