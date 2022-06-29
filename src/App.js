import { useState } from 'react';
import NavBar from './components/NavBar.jsx';
import Departamentos from './components/Departamentos.jsx';
import Catalog from './components/Catalog.jsx';
function App() {
  const [isLoggedIn] = useState(false);
  const [catalogIs, setCatalogIs] = useState('normal');
  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn}/>
      <Departamentos setCatalog={setCatalogIs} />
      <Catalog catalogIs={catalogIs}/>
    </div>
  );
}

export default App;