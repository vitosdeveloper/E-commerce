import NavBar from './NavBar.jsx';
import Departamentos from './Departamentos.jsx';
import Catalog from './Catalog.jsx';
import { useState } from 'react';

function MainPage(){
    const [catalogIs, setCatalogIs] = useState('normal');

    return (
        <div>
            <NavBar />
            <Departamentos setCatalog={setCatalogIs} />
            <Catalog catalogIs={catalogIs}/>
        </div>
    )
}
export default MainPage;