import { useState } from 'react';
function Departamentos(props) {
    function clickCatalog(z) {
        props.setCatalog(z)
    }
    //altura da barrinha
    //onde a barra deve começar

    const [posicaoDaBarra, setPosicaoDaBarra] = useState({
        altura: 0,
        posicaoNoBotao: -50
    });
    function posicionarBarra(e) {
        const barrinha = document.querySelector('.menuSublinhado');
        const menuSublinhadoWidth = barrinha.getBoundingClientRect().width / 2;
        const elementWidth = e.getBoundingClientRect().width / 2;
        const howMuchToChange = e.getBoundingClientRect().left + elementWidth - menuSublinhadoWidth;
        setPosicaoDaBarra((lastValues)=>{
            return {
                ...lastValues,
                posicaoNoBotao: howMuchToChange
            };
        });  
    };
    //substrair do tanto que a barra for movida

    setTimeout(() => {
        const departMenuBottom = document.querySelector('.departamentosDiv');
        const menuSublinhado = document.querySelector('.menuSublinhado');
        if (menuSublinhado){
        menuSublinhado.style.opacity = '0.5';
        }
        setPosicaoDaBarra((lastValues)=>{
            return {
                ...lastValues,
                altura: departMenuBottom.getBoundingClientRect().bottom - 140
            } 
        })
        
    }, 500); 

    return (
            <div className="departamentosDiv">
                <ul>
                    <li onClick={(e)=>{clickCatalog('normal'); posicionarBarra(e.target);}} className="borderRight">Todos departamentos</li>
                    <li onClick={(e)=>{clickCatalog('promoção'); posicionarBarra(e.target);}} className="borderRight">Promoções</li>
                    <li onClick={(e)=>{clickCatalog('mais comprados'); posicionarBarra(e.target);}}>Mais comprados</li>
                </ul>
                <h1 className="menuSublinhado" style={{
                        top: posicaoDaBarra.altura + 'px', 
                        opacity: '0',
                        left: posicaoDaBarra.posicaoNoBotao + 'px'
                    }}>_</h1>
            </div>
            )
}
export default Departamentos;