import { useState } from 'react'
import './App.css'

function App() {
  const [actual, setActual] = useState('USD'); //Moneda de origen
  const [equivalente, setEquivalente] = useState('EUR'); //Moneda destino
  const [cantidad, setCantidad] = useState(1); //Guarda el monto que se quiere convertir
  const [resultado, setResultado] = useState(null); //Guarda el resultado final convertido

  const convertir = async () => {
    try{ 
      console.log(actual)
      const res = await fetch(`https://open.er-api.com/v6/latest/${actual}`)
      const data = await res.json();
      console.log(data);
      const rate = data.rates[equivalente];
      setResultado((cantidad * rate).toFixed(2))
    }
    catch(error){
      console.log("Error en la conversión");
    }
  }

  return (
    <>
      <section className='Main'>
        <div className='ContenedorTitulo'>
          <h1 className='Titulo'>Conversor de divisas</h1>
        </div>

        <div className='ContenedorBoxes'>
          <div className='BoxIzq'>
            <div className='ContenedorTipo'>
              <div className='ContenedorActual'>
                <select className='SelectTipo' value={actual} onChange={e => setActual(e.target.value)}>
                  <option value='USD'>USD</option>
                  <option value='EUR'>EUR</option>
                  <option value='ARS'>ARS</option>
                </select>
                <input className='InputMonto' type='number' value={cantidad} onChange={e => setCantidad(e.target.value)}></input>
              </div>

              <select className='SelectEquivalente' value={equivalente} onChange={e => setEquivalente(e.target.value)}>
                  <option value='USD'>USD</option>
                  <option value='EUR'>EUR</option>
                  <option value='ARS'>ARS</option>
              </select>
            </div>
            <button className='BtnConvertir' onClick={convertir}>Convertir<img src='src/assets/Flecha.png' className='IconoFlecha'></img></button>
          </div>


          <div className='BoxDer'>
              <span className='TituloResultado'>Resultado</span>
              <span className='SpanResultado'>{resultado}</span>
          </div>    
        </div>
      </section>
    </>
  )
}

export default App
