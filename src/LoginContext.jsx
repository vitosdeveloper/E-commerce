import React, { useContext, useState, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';
import Axios from 'axios';

const IsLoggedInContext = React.createContext();
const SetIsLoggedInContext = React.createContext();
export function useLoggedIn(){
    return useContext(IsLoggedInContext)
};
export function useLoggedInUpdate(){
    return useContext(SetIsLoggedInContext)
};

const UsuarioDados = React.createContext();
const SetUsuarioDados = React.createContext();
export function useUsuarioDados(){
    return useContext(UsuarioDados)
};
export function useSetUsuarioDados(){
    return useContext(SetUsuarioDados)
};

const ItensDaLoja = React.createContext();
const SetItensDaLoja = React.createContext();
export function useItensDaLoja(){
    return useContext(ItensDaLoja)
};
export function useSetItensDaLoja(){
    return useContext(SetItensDaLoja)
};

//fav
const Favoritos = React.createContext();
const SetFavoritos = React.createContext();
export function useFavoritos(){
    return useContext(Favoritos)
};
export function useSetFavoritos(){
    return useContext(SetFavoritos)
};

//carrinho
const CarrinhoItens = React.createContext();
const SetCarrinhoItens = React.createContext();
export function useCarrinhoItens(){
    return useContext(CarrinhoItens)
};
export function useSetCarrinhoItens(){
    return useContext(SetCarrinhoItens)
};

//jwt
const Jwt = React.createContext();
const SetJwt = React.createContext();
export function useJwt(){
    return useContext(Jwt)
};
export function useSetJwt(){
    return useContext(SetJwt)
};

//check Jwt
const CheckJwt = React.createContext();
export function useCheckJwt(){
    return useContext(CheckJwt)
}

const UserHistory = React.createContext();
export function useUserHistory(){
    return useContext(UserHistory)
}
//endereço sem barra no final pf
export const serverUrl = 'https://vitos-e-commerce.herokuapp.com';

export function IsLoggedInProvider({ children }){

    const [isLoggedIn, setIsLoggedIn] = useLocalStorage('islogged', false)
    //usuario, ja ja vai buscar da DB
    const [usuariosDados, setUsuarioDados] = useState({
        _id: '',
        login: '',
        nome: '',
        endereco: '',
        sexo: '',
        itensComprados: []
    });
    
    //context para segurar favoritados no localStorage
    const [favoritos, setFavoritos] = useLocalStorage('fav', []);
    
    //context pra segurar itens do carrinho
    const [carrinhoItens, setCarrinhoItens] = useLocalStorage('carrinho', []);

    //itens da loja
    //o set só vai ser usado depois que tiver a plataforma de admin de adicionar itens na DB, obviamente.
    const [itensDaLoja, setItensDaLoja] = useState([]);

    const [jwt, setJwt] = useLocalStorage('jwt', )
    //checar valiadde do jwt e entregar dados do usuário
    const [comprasDoUser, setComprasDoUser] = useState([]);

    const checkJwt = async ()=>{
        const response = await Axios.post(serverUrl+"/checkJwt", {jwt});
        if (response.data.status==='ok') {
            setUsuarioDados(response.data.user);
            setIsLoggedIn(true);
        } else if (response.data.status==='err') {
            setIsLoggedIn(false);
            setUsuarioDados({
                _id: '',
                login: '',
                nome: '',
                endereco: '',
                sexo: '',
                itensComprados: []
            });
            setJwt();
        }
    }
    
    //checagem de jwt e carregamento iniciais de itens da loja
    useEffect(() => {
        checkJwt();
        const asyncInsideUseEffect = async()=>{
            const response = fetch(serverUrl+"/itensDaLoja");
            const data = await (await response).json();
            const dataEmbaralhada = data.sort(()=>{ return Math.random() - 0.5 })
            setItensDaLoja(dataEmbaralhada);
        }
        asyncInsideUseEffect();
        // eslint-disable-next-line
    }, []);

    //antes o jwt carregava itens comprados pelo usuário, o que sobrecarregava o tamanho do jwt, agora é feito um fetch direto após verificação jwt
    useEffect(()=>{
        const atualizarComprasDoUser = async ()=>{
            const dataToVerify = {
                userId: usuariosDados._id,
                jwt: jwt
            }
            if((dataToVerify.userId).length > 0 && (dataToVerify.jwt).length>0) {
                const checkJwtAndGetUserHist = await Axios.post(serverUrl+"/alimentarHistorico", {dataToVerify});
                const compradosPeloUser = checkJwtAndGetUserHist.data.status;
                setComprasDoUser(compradosPeloUser);
            }
        }
        atualizarComprasDoUser();
    }, [usuariosDados, jwt])
    
    return (
        <IsLoggedInContext.Provider value={isLoggedIn}>
            <SetIsLoggedInContext.Provider value={setIsLoggedIn}>
                <UsuarioDados.Provider value={usuariosDados}>
                    <SetUsuarioDados.Provider value={setUsuarioDados}>
                        <ItensDaLoja.Provider value={itensDaLoja}>
                            <Favoritos.Provider value={favoritos}>
                                <SetFavoritos.Provider value={setFavoritos}>
                                    <CarrinhoItens.Provider value={carrinhoItens}>
                                        <SetCarrinhoItens.Provider value={setCarrinhoItens}>
                                            <Jwt.Provider value={jwt}>
                                                <SetJwt.Provider value={setJwt}>
                                                    <CheckJwt.Provider value={checkJwt}>
                                                        <UserHistory.Provider value={comprasDoUser}>
                                                            {children}
                                                        </UserHistory.Provider>
                                                    </CheckJwt.Provider>
                                                </SetJwt.Provider>
                                            </Jwt.Provider>
                                        </SetCarrinhoItens.Provider>
                                    </CarrinhoItens.Provider>
                                </SetFavoritos.Provider>
                            </Favoritos.Provider>
                        </ItensDaLoja.Provider>
                    </SetUsuarioDados.Provider>
                </UsuarioDados.Provider>
            </SetIsLoggedInContext.Provider>
        </IsLoggedInContext.Provider>
    )
}