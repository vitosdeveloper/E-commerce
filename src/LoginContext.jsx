import React, { useContext, useState, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';

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


export function IsLoggedInProvider({ children }){

    const [isLoggedIn, setIsLoggedIn] = useLocalStorage('islogged', false)
    //usuario, ja ja vai buscar da DB
    const [usuariosDados, setUsuarioDados] = useLocalStorage('usuario', 
        {
            nome: 'Leozinho felipe kei parklez loucura haru te amo',
            endereco: 'Rua perigosa no rio de janeiro 103',
            sexo: 'Prefiro não informar',
            itensComprados: []
        }
    );

    //itens da loja
    //o set só vai ser usado depois que tiver a plataforma de admin de adicionar itens na DB, obviamente.
    const [itensDaLoja, setItensDaLoja] = useState([]);
    useEffect(() => {
        fetch("https://ecommercefakedb.herokuapp.com/itensDaLoja").then(
            response => response.json()
          ).then(
            data => {
                setItensDaLoja(data)
            }
          )
    }, []);

    //context para segurar favoritados no localStorage
    const [favoritos, setFavoritos] = useLocalStorage('fav', []);

    //context pra segurar itens do carrinho
    const [carrinhoItens, setCarrinhoItens] = useLocalStorage('carrinho', []);


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
                                            {children}
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