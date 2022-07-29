import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import MainPage from './components/MainPage.jsx';
import { useItensDaLoja } from './LoginContext.jsx';
import Favoritados from './components/Favoritados.jsx';
import Carrinho from './components/Carrinho.jsx';
import Historico from './components/Historico.jsx';
import Success from './components/Success.jsx';
import EveryItem from './components/EveryItem.jsx';

function App() {
  
  const itensDaLojaTeste = useItensDaLoja();

  return (
      <div>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="favoritados" element={<Favoritados />} />
            <Route path="carrinho" element={<Carrinho />} />
            <Route path="meus-pedidos" element={<Historico />} />
            <Route path="success" element={<Success />} />
            {   
              itensDaLojaTeste.map((item, index)=>{
                return <Route key={index} path={item._id} element={<EveryItem item={item} />} />
              })
            }
        </Routes>
      </div>
    
  );
}

export default App;