import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import MainPage from './components/MainPage.jsx';
import { IsLoggedInProvider } from './LoginContext.jsx';
import Favoritados from './components/Favoritados.jsx';
import Carrinho from './components/Carrinho.jsx';

function App() {
  
  return (
    <IsLoggedInProvider>
      <div>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            <Route path="favoritados" element={<Favoritados />} />
            <Route path="carrinho" element={<Carrinho />} />
        </Routes>
      </div>
    </IsLoggedInProvider>
  );
}

export default App;