import { useState, useEffect } from 'react';
import { useItensDaLoja, useFavoritos, useSetFavoritos } from '../LoginContext.jsx';
import { Link } from 'react-router-dom';
import Footer from './Footer.jsx';

function Catalog(props) {
    //fake data provisória
    const storeModel = useItensDaLoja();
    
    //lista de todos departamentos
    const [catalogList, setCatalogList] = useState([]);
    //nomes de classe repetidos são ignorados
    storeModel.forEach((item)=>{
        if (!catalogList.includes(item.class) /* && item.status==='promoção' */) {
            setCatalogList([...catalogList, item.class]);
        }
    })

    //lista de promoções
    const [catalogListPromo, setCatalogListPromo] = useState([]);
    //nomes de classe repetidos são ignorados
    storeModel.forEach((item)=>{
        if (!catalogListPromo.includes(item.class) && item.status==='promoção') {
            setCatalogListPromo([...catalogListPromo, item.class])
        }
    })

    //lista de mais comprados
    const [catalogMaisComprados, setCatalogMaisComprados] = useState([]);
    //nomes de classe repetidos são ignorados³
    storeModel.forEach((item)=>{
        if (!catalogMaisComprados.includes(item.class) && item.numDeCompras >= 1){
            setCatalogMaisComprados([...catalogMaisComprados, item.class])
        }
    })
    
    //qual sessão de compras está selecionada?
    const [selectedList, setSelectedList] = useState('TODOS')
    function filterList(e) {
        setSelectedList(e.target.innerText)
    }

    //favHeart
    const fav = useFavoritos();
    const setFav = useSetFavoritos();

    function favoritar(e, itemId){
        if (!fav.includes(itemId)){
            setFav((prevData)=>{
                return [
                    ...prevData, 
                    itemId
                ]
            });
        }
        e.target.style.transform = 'scale(0.9)';
        e.target.style.color = 'red';
    }
    
    function itemHtmlGenerator(item, index, isHidden) {
        return (
            <Link key={index} to={item._id} style={isHidden?{display: 'none'}:null}>
            <div className="itemToBuy">
            {
                window.innerWidth < 1200 ?
                <img src='img/favHeart.png'
                className="favoriteHeart"
                style={{right: '4px'}}
                onClick={(e)=>{
                    e.preventDefault();
                    favoritar(e, item._id);
                    e.target.setAttribute('src', 'img/favHeart2.png');
                    }}
                alt="" />
                : <span onClick={(e)=>{e.preventDefault(); favoritar(e, item._id);}} className="favoriteHeart">♥</span>
            }
            
            {
                item.status==='promoção'? <img className="promoHot" src="https://i.pinimg.com/originals/c8/cb/ff/c8cbffccee47e8d229aaf97f08cb1e2b.png" alt="hotPromo" />
                : null
            }
            
            <div className="productImgDiv">
              <img className="itemImg" src={item.productImg} alt="" />
            </div>
            <div className="productContent">
              <h4>{item.productTitle.length >= 66 ?
                item.productTitle.slice(0, 66)+'...':
                item.productTitle
              }</h4>
            </div>
            <div className="prices">
              <h2 className="price">R$ {item.productPrice}</h2>
              <h5 className="priceComplement">À vista no PIX</h5>
            </div>
              <div className="estoque">
                <p>({item.estoque} em estoque)</p>
              </div>
              {props.catalogIs==='mais comprados' ?
              <p className="numDeVendas">Vendido {item.numDeCompras} vezes</p>
              : null
              }
              
            </div></Link>
        )
    }
    //altura da bolinha do menu
    const [bolinhaHeight, setBolinhaHeight] = useState(139);
    //sempre que o menu voltar, a bolinha e a tag obviamente devem voltar pro inicial TODOS
    useEffect(() => {
        const topDoUl = document.querySelector('.classificações ul').getBoundingClientRect().top
        const topDoLi = document.querySelectorAll('.classificações ul li')[0].getBoundingClientRect().top
        setBolinhaHeight(topDoUl - topDoLi + 13)
        setSelectedList('TODOS')
    }, [props.catalogIs]);

    //colocar maiores numeros de compra do maior pro menor (organização)
    let maisCompradosPreco = []
    storeModel.forEach((item)=>{
        if (item.numDeCompras > 0 && !maisCompradosPreco.includes(item.numDeCompras)){
            maisCompradosPreco.push(item.numDeCompras)
        }
    })
    maisCompradosPreco.sort((a, b)=>{
        return b - a;
    });

    //mudar lugar da bolinha clicando nos menus e nao na ul õ_õ
    function bolinhaAltura(e){
        //só vai pegar se clicar no LI uwu
        if (e.target.constructor.name === 'HTMLLIElement'){
            setBolinhaHeight(Math.round(e.target.getBoundingClientRect().top - e.currentTarget.getBoundingClientRect().top + 13))
        }
    }

    //detecção de itens para paginação
    const [numDeItens, setNumDeItens] = useState(0);

    const [paginaSelecionada, setPaginaSelecionada] = useState(1);

    useEffect(()=>{
        const everyCard = document.querySelectorAll('.itemToBuy');
        everyCard.forEach((item, index)=>{
            item.style.display = 'none';
        });
        setNumDeItens(everyCard.length)
        everyCard.forEach((item, index)=>{
            if (index < paginaSelecionada * 6 && index > paginaSelecionada * 6 -7) {
                item.style.display = 'inline-block';
            }
        })
            // eslint-disable-next-line
    }, [selectedList, props.catalogIs, []])

    useEffect(()=>{
        setPaginaSelecionada(1)
    }, [props.catalogIs])

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(()=>{
        window.scrollTo({top: 0, behavior: "smooth"})
    }, [paginaSelecionada])

    return (
        <div>
        <div className="itensCatalogo">
            <div className="bolinhaMenu" style={{top: bolinhaHeight + 'px'}}>
                <span>●</span>
            </div>
            <div className="classificações">
                <ul 
                className={!!isMenuOpen? 'showCatalogue' : 'hideCatalogue' }
                onClick={bolinhaAltura}>
                    <li onClick={(e)=>{filterList(e); setPaginaSelecionada(1)}}>TODOS</li>
                    {   //render pra abas de todos departamentos
                        props.catalogIs==='normal' ?
                        catalogList.map((item, index)=>{
                            return <li className="liNormal" onClick={(e)=>{filterList(e); setPaginaSelecionada(1)}} key={index} >{item}</li>
                        })
                        : props.catalogIs==='promoção' ?
                        //render pra abas de promoção
                        catalogListPromo.map((item, index)=>{
                            return props.catalogIs==='promoção' ?
                            <li onClick={(e)=>{filterList(e); setPaginaSelecionada(1)}} key={index} >{item}</li>
                            : null
                        })
                        : props.catalogIs==='mais comprados' ?
                        catalogMaisComprados.map((item, index)=>{
                            return <li onClick={(e)=>{filterList(e); setPaginaSelecionada(1)}} key={index} >{item}</li>
                        })
                        : null
                    }
                </ul>
            </div>
            <button
            className='mobileMenuButton'
            onClick={()=>{
                setIsMenuOpen(!!isMenuOpen?false:true)
            }}
            style={{textAlign: 'center', margin: '0'}}
            >Show Catalogue</button>
            <div className="ecommerceItensDiv">
                {props.catalogIs==='promoção'?
                storeModel.map((item, index)=>{
                    return item.status==='promoção' && item.class === selectedList?
                    //se estiver em promoção
                    itemHtmlGenerator(item, index)
                    //mostrar todos que estiverem em promoção
                    : selectedList === 'TODOS' && item.status==='promoção' ?
                    itemHtmlGenerator(item, index)
                    : null 
                })
                :props.catalogIs==='normal'?
                storeModel.map((item, index)=>{
                    return item.class === selectedList ?
                    //mostrar apenas itens de determinada classe
                    itemHtmlGenerator(item, index, false)
                    :
                    //mostrar todos itens
                    selectedList === 'TODOS' ?
                    itemHtmlGenerator(item, index, false)
                    : null
                })
                :props.catalogIs==='mais comprados' ?
                    maisCompradosPreco.map((item)=>{
                        return storeModel.map((itemZ, indexZ)=>{
                            return item === itemZ.numDeCompras ?
                                itemZ.class === selectedList ?
                                    itemHtmlGenerator(itemZ, indexZ)
                                    :
                                    selectedList === 'TODOS' ?
                                    itemHtmlGenerator(itemZ, indexZ)
                                : null
                            : null
                        })
                    })
                : null
                }
            </div>
        </div>
        <div className="pageLinks linkLindo">[
            {   numDeItens !== 0 ?
                new Array(numDeItens).fill(undefined).map((item, index)=>{
                    return index % 6 === 0 ?
                    <div className="everyPage linkLindo" key={index} 
                    onClick={()=>{
                        setPaginaSelecionada(index / 6 +1)
                        }}
                    >
                        {index / 6 +1}
                    </div>
                    : null
                })
                : 'loading...'
            }
        ]</div>
        <Footer />
        </div>
    )
}
export default Catalog;