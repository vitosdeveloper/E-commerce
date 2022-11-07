import { Route, Routes } from 'react-router-dom';
import Logar from './Logar.js';
import Escolha from './Escolha.js';
import Registrar from './Registrar.js';
import Registrou from './Registrou.js';
import Logou from './Logou.js';
import Footer from '../Footer.jsx';
import ProtectRouteLogged from '../Helper/ProtectRouteLogged.js';

function Login() {
  return (
    <>
      <ProtectRouteLogged>
        <Routes>
          <Route path='/' element={<Escolha />} />
          <Route path='logar' element={<Logar />} />
          <Route path='registrar' element={<Registrar />} />
          <Route path='registrou' element={<Registrou />} />
          <Route path='logou' element={<Logou />} />
        </Routes>
      </ProtectRouteLogged>
      <Footer />
    </>
  );
}
export default Login;
