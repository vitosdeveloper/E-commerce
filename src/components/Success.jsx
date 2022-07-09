import { Navigate } from 'react-router-dom';
import { useState } from 'react';

export default function Success(){

    const [redirect, setRedirect] = useState(false)
    setTimeout(()=>{
        setRedirect(<Navigate to="/" />)
    }, 2000)

    return (
        <div>
            {redirect}
            <div className="favoritados">
                <h1 className="success">Compra efetuada com sucesso! (っ＾▿＾)💨</h1>
                <h4 className="success">Redirecionando...</h4>
            </div>
            
        </div>
    )
}