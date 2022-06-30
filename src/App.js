import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import MainPage from './components/MainPage.jsx';
import { IsLoggedInProvider } from './LoginContext';

function App() {
  
  return (
    <IsLoggedInProvider>
      <div>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </IsLoggedInProvider>
  );
}

export default App;