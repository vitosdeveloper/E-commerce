import { useState, useEffect } from 'react';
import { useGlobalContext } from '../GlobalContext.jsx';
import { Link, Navigate, useParams } from 'react-router-dom';
import Axios from 'axios';

function EveryItem() {
  const [quantidadeDoItem, setQuantidadeDoItem] = useState(1);
  const [redirectPosCompra, setRedirectPosCompra] = useState();
  //confirmação de compra, endereço, método de pagamento, frete
  const [confirmarCompra, setConfirmarCompra] = useState(false);

  const params = useParams();
  const {
    checkJwt,
    isLoggedIn,
    usuariosDados,
    serverUrl,
    setCarrinhoItens,
    jwt,
    setJwt,
    itensDaLoja,
  } = useGlobalContext();

  const filtrar = (data) => data.filter((item) => item._id === params.id);
  const item = itensDaLoja.length && filtrar(itensDaLoja)[0];

  const precoTotal = quantidadeDoItem * parseFloat(item.productPrice);

  const addItem = () => {
    if (quantidadeDoItem > 0 && quantidadeDoItem < item.estoque) {
      setQuantidadeDoItem((prevItem) => {
        return prevItem + 1;
      });
    }
  };

  const subItem = () => {
    if (quantidadeDoItem > 1) {
      setQuantidadeDoItem((prevItem) => {
        return prevItem - 1;
      });
    }
  };

  const toCart = (e) => {
    const itemId = item._id;
    const pricePerItem = item.productPrice;

    setCarrinhoItens((prevItens) => {
      let emFalta = 0;

      if (item.estoque > 1) {
        emFalta = 1;
      } else {
        emFalta = 0;
      }

      const carFilter = prevItens.filter((item) => {
        return item._id !== itemId;
      });

      return [
        ...carFilter,
        { _id: itemId, quantidade: emFalta, preco: pricePerItem },
      ];
    });
    e.currentTarget.style.background = 'grey';
    e.currentTarget.innerText = 'Sucess!';
  };

  //depois fazer formulário e enviar os dados pra db com axios ou algo, testar com console.log
  const formularioDaCompra = async () => {
    const divDoBotao = document.querySelector('.divDaCompra');
    divDoBotao.querySelector('.finalizarCompra').style.display = 'none';
    divDoBotao.style.color = 'black';
    divDoBotao.innerText = 'Processando...';

    const diaCompleto = new Date();
    let amOrPm = '';
    if (diaCompleto.getHours() < 12) {
      amOrPm = ' am';
    } else {
      amOrPm = ' pm';
    }
    const horario =
      (diaCompleto.getMonth() + 1).toString().padStart(2, 0) +
      '/' +
      diaCompleto.getDate().toString().padStart(2, 0) +
      ', às ' +
      diaCompleto.getHours().toString().padStart(2, 0) +
      ':' +
      diaCompleto.getMinutes().toString().padStart(2, 0);

    const itemDaPage = {
      _id: item._id,
      quantidade: quantidadeDoItem,
      preco: item.productPrice,
    };

    const formulario = {
      userId: usuariosDados._id,
      valorDaCompra: quantidadeDoItem * parseFloat(item.productPrice),
      itensByIdAndItsQuantity: itemDaPage,
      horarioDeCompra: horario + amOrPm,
      jwt: jwt,
    };

    const response = await Axios.post(serverUrl + '/efetuarCompraPeloItem', {
      formulario,
    });
    if (response.data.status === 'success') {
      setJwt(response.data.jwt);
      setConfirmarCompra(false);
      setRedirectPosCompra(<Navigate to='/success' />);
    } else if (response.data.status === 'err') {
      divDoBotao.innerText = 'Houve algum erro. Tente novamente mais tarde.';
      divDoBotao.style.color = '#670707';
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else if (response.data.status === 'estoqueFail') {
      divDoBotao.innerText = 'Algum dos itens está fora de estoque!';
      divDoBotao.style.color = '#670707';
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (item.estoque < 1) {
      setQuantidadeDoItem(0);
    }
  }, [item.estoque]);

  return (
    !!item && (
      <div>
        <div className='itemIndividual'>
          <div className='itemTitle'>
            <h1>{item.productTitle}</h1>
          </div>
          <div className='imgDiv'>
            <div className='img'>
              <img src={item.productImg} alt='' />
            </div>
            <div className='descDiv'>
              <div className='botaoCarrinho'>
                <h4 className='dispo'>
                  Disponíveis no estoque: {item.estoque}
                </h4>
                <h4 className='dispo'>Comprado {item.numDeCompras} vezes.</h4>
                <div className='everyItemLinkToCar'>
                  <button
                    onClick={(e) => {
                      toCart(e);
                      setConfirmarCompra(false);
                    }}
                  >
                    Colocar no carrinho
                  </button>
                </div>
              </div>
              <div className='comprarAgora'>
                <div className='quantidadeParaComprar'>
                  <button
                    value={item.estoque}
                    onClick={subItem}
                    name={item._id}
                    href={item.productPrice}
                    className='quantityBut'
                  >
                    -
                  </button>
                  <span> </span>
                  <h4 className='h4Inline'>{quantidadeDoItem}</h4>
                  <span> </span>
                  <button
                    value={item.estoque}
                    href={item.productPrice}
                    onClick={addItem}
                    name={item._id}
                    className='quantityBut'
                  >
                    +
                  </button>
                  <br />
                </div>

                <h2 className='h4Inline bigFontEveryItem'>
                  {(
                    quantidadeDoItem * parseFloat(item.productPrice)
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </h2>
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      checkJwt();
                      setConfirmarCompra(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className='comprarBut everyCompra'
                  >
                    <h2>Comprar agora!</h2>
                  </button>
                ) : (
                  <Link style={{ textDecoration: 'none' }} to='/login'>
                    <button className='comprarBut everyCompra'>
                      Você precisa estar logado para comprar
                    </button>
                  </Link>
                )}

                <div className='aboutEveryItem'>
                  <h4>Sobre:</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque a interdum nunc, at laoreet lacus. Cras vitae
                    velit sapien. Sed ornare congue sapien hendrerit vehicula.
                    Nam sodales purus tellus, ac pretium metus porttitor vitae.
                    Aenean viverra fringilla pharetra. Pellentesque nec
                    malesuada mauris. Mauris eleifend quam vel ultrices
                    tristique.
                  </p>
                  <h4>Características:</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque a interdum nunc, at laoreet lacus. Cras vitae
                    velit sapien.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. .
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque a interdum nunc, at laoreet lacus. Cras.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque a interdum nunc, at laoreet lacus. Cras vitae
                    velit sapien.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {confirmarCompra ? (
            <div className='confirmarCompra'>
              <div>
                <span
                  className='closeWindow'
                  onClick={() => {
                    setConfirmarCompra(false);
                  }}
                >
                  🗙
                </span>
                <h4>Seu endereço:</h4>
                <small>
                  <p>{usuariosDados.endereco.slice(0, 26) + '...'}</p>
                </small>
                <Link to='/profile'>
                  <button className='trocarEndereço'>
                    Trocar meu endereço
                  </button>
                </Link>
                <h4>Escolha o serviço de frete:</h4>
                <div>
                  <select className='inputEdit' name='sexo'>
                    <option value=''>PAC</option>
                    <option value='Masculino'>Sedex</option>
                    <option value='Feminino'>Sedex Hoje</option>
                    <option value='Não-binário'>Correio Mini Envios</option>
                  </select>
                  <br />
                </div>
                <div>
                  <h4 className='card'>Cartão:</h4>
                  <p>****-****-****-8477 (Visa)</p>
                </div>
                <div>
                  <h3 className='totalAPager'>Total a pagar:</h3>
                  <br />
                  <h1 className='valorTotal'>{precoTotal}</h1>
                </div>
              </div>
              <div className='divDaCompra'>
                {isLoggedIn ? (
                  precoTotal !== 0 ? (
                    <button
                      onClick={formularioDaCompra}
                      className='finalizarCompra'
                    >
                      <h2>Efetuar compra</h2>
                    </button>
                  ) : (
                    <button className='finalizarCompra'>
                      <h2 style={{ textAlign: 'center' }}>
                        Item fora de estoque
                      </h2>
                    </button>
                  )
                ) : (
                  <Link to='/login'>
                    <button className='finalizarCompra'>
                      <h2>Você está deslogado</h2>
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ) : null}
          {redirectPosCompra}

          <div className='socials'>
            <a
              className='emotis'
              target='_blank'
              rel='noreferrer'
              href='https://github.com/vitosnatios'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='40'
                height='40'
                fill='black'
                className='bi bi-github'
                viewBox='0 0 16 16'
              >
                <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z'></path>
              </svg>
            </a>
            <a
              className='emotis'
              target='_blank'
              rel='noreferrer'
              href='https://www.linkedin.com/in/vitosnatios/'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='40'
                height='40'
                fill='black'
                className='bi bi-linkedin'
                viewBox='0 0 16 16'
              >
                <path d='M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z'></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    )
  );
}
export default EveryItem;
