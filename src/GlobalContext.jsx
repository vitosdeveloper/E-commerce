import React, { useContext, useState, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';
import Axios from 'axios';

//context global
const GlobalContext = React.createContext();
export function useGlobalContext(){
    return useContext(GlobalContext)
}
const SetGlobalContext = React.createContext();
export function useSetGlobalContext(){
    return useContext(SetGlobalContext)
}

export function GlobalProvider({ children }){

    const [favoritos, setFavoritos] = useLocalStorage('fav', []);
    const [carrinhoItens, setCarrinhoItens] = useLocalStorage('carrinho', []);
    const [jwt, setJwt] = useLocalStorage('jwt', '');

    const jwtCheck = async ()=>{
        const response = await Axios.post(globalContextState.serverUrl+"/checkJwt", {jwt});
        if (response.data.status==='ok') {
            setGlobalContextState(prev=>{
                return {
                    ...prev, 
                    usuariosDados: response.data.user,
                    isLoggedIn: true
                };
            })
        } else if (response.data.status==='err') {
            setJwt('');
            setGlobalContextState(prev=>{
                return {
                    ...prev,
                    isLoggedIn: false,
                    usuariosDados: {
                        _id: '',
                        login: '',
                        nome: '',
                        endereco: '',
                        sexo: '',
                        itensComprados: []
                    }
                }
            })
        }
    }

    const [globalContextState, setGlobalContextState] = useState({
        isLoggedIn: false,
        usuariosDados: {
            _id: '',
            login: '',
            nome: '',
            endereco: '',
            sexo: '',
            itensComprados: []
        },
        itensDaLoja: [],
        comprasDoUser: [],
        checkJwt: jwtCheck,
        favoritos: favoritos,
        setFavoritos: setFavoritos,
        carrinhoItens: carrinhoItens,
        setCarrinhoItens: setCarrinhoItens,
        jwt: jwt,
        setJwt: setJwt,
        serverUrl: 'https://vitos-ecommerce-server.onrender.com'
    })
    //esse é pra atualizar alguns detalhes do obj qnd for preciso, pois o valor do state não atualiza depois de setado no objeto como outra variável, segundo meus testes
    useEffect(()=>{
        setGlobalContextState(prev=>{
            return {
                ...prev,
               jwt: jwt,
               carrinhoItens: carrinhoItens,
               favoritos: favoritos
            }
        })
    }, [carrinhoItens, favoritos, jwt])
    //faz carregamento inicial de itens da loja
    useEffect(() => {
        const asyncInsideUseEffect = async()=>{
            const response = fetch(globalContextState.serverUrl+"/itensDaLoja");
            const data = await (await response).json();
            const dataEmbaralhada = data.sort(()=>{ return Math.random() - 0.5 })
            setGlobalContextState(prev=>{
                return {
                    ...prev,
                    itensDaLoja: dataEmbaralhada
                }
            });
        }
        asyncInsideUseEffect();
    }, [globalContextState.serverUrl]);
    //antihack em nao vai brincar de alterar jwt
    useEffect(()=>{
        jwtCheck();
        // eslint-disable-next-line
    }, [jwt])

    //antes o jwt carregava itens comprados pelo usuário, o que sobrecarregava o tamanho do jwt, agora é feito um fetch direto após verificação jwt
    useEffect(()=>{
        const atualizarComprasDoUser = async ()=>{
            const dataToVerify = {
                userId: globalContextState.usuariosDados._id,
                jwt: jwt
            }
            if((dataToVerify.userId).length > 0 && (dataToVerify.jwt).length>0) {
                const checkJwtAndGetUserHist = await Axios.post(globalContextState.serverUrl+"/alimentarHistorico", {dataToVerify});
                const compradosPeloUser = checkJwtAndGetUserHist.data.status;
                setGlobalContextState(prev=>{
                    return {
                        ...prev,
                        comprasDoUser: compradosPeloUser
                    }
                })
            }
        }
        atualizarComprasDoUser();
    }, [globalContextState.usuariosDados, jwt, globalContextState.serverUrl])
    
    return (
        <GlobalContext.Provider value={globalContextState}>
            <SetGlobalContext.Provider value={setGlobalContextState}>
                {children}
            </SetGlobalContext.Provider>
        </GlobalContext.Provider>
    )
}