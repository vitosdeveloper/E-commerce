import { useGlobalContext } from '../../GlobalContext';
import { Navigate } from 'react-router-dom';

const ProtectRouteLogged = ({ children }) => {
  const { isLoggedIn } = useGlobalContext();

  return !isLoggedIn ? children : <Navigate to='/' />;
};

export default ProtectRouteLogged;
