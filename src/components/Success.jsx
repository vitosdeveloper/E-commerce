
export default function Success(){

    setTimeout(()=>{
        window.location.replace("/")
    }, 2000)

    return (
        <div>
            <div className="favoritados">
                <h1 className="success">Compra efetuada com sucesso! (っ＾▿＾)💨</h1>
                <h4 className="success">Redirecionando...</h4>
            </div>
        </div>
    )
}