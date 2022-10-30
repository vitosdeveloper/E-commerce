import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import MainPage from './components/MainPage.jsx';
import Favoritados from './components/Favoritados.jsx';
import Carrinho from './components/Carrinho.jsx';
import Historico from './components/Historico.jsx';
import Success from './components/Success.jsx';
import EveryItem from './components/EveryItem.jsx';
import NavBar from './components/NavBar.jsx';

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} end />
        <Route path='login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='favoritados' element={<Favoritados />} />
        <Route path='carrinho' element={<Carrinho />} />
        <Route path='meus-pedidos' element={<Historico />} />
        <Route path='success' element={<Success />} />
        <Route path='/:id' element={<EveryItem />} />
      </Routes>
    </div>
  );
}

export default App;
