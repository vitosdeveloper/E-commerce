function Departamentos(props) {
    function clickCatalog(z) {
        props.setCatalog(z)
    }
    return (
        <div className="departamentosDiv">
            <ul>
            <li onClick={()=>{clickCatalog('normal')}} className="borderRight">Todos departamentos</li>
            <li onClick={()=>{clickCatalog('promoção')}} className="borderRight">Promoções</li>
            <li onClick={()=>{clickCatalog('mais comprados')}}>Mais comprados</li>
            </ul>
        </div>
    ) 
}
export default Departamentos;