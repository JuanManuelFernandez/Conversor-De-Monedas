import { useState, useEffect } from 'react'
import Select from 'react-select'
import './App.css'

const opcionesMoneda = [
  {value: 'USD', label: 'USD', bandera: '/src/assets/banderas/EEUU.png'},
  {value: 'EUR', label: 'EUR', bandera: '/src/assets/banderas/Esp.png' },
  {value: 'ARS', label: 'ARS', bandera: '/src/assets/banderas/Arg.png' },
]

function App() {
  const [actual, setActual] = useState(opcionesMoneda[0]); //Moneda de origen
  const [equivalente, setEquivalente] = useState(opcionesMoneda[2]); //Moneda destino
  const [cantidad, setCantidad] = useState(1); //Guarda el monto que se quiere convertir
  const [resultado, setResultado] = useState(null); //Guarda el resultado final convertido

  const [historial, setHistorial] = useState([]);
  
  useEffect(() => {
    const guardado = localStorage.getItem('historialConversion')
    if(guardado){
      setHistorial(JSON.parse(guardado));
    }
  }, [])
  
  const formatoOpcion = (opcion) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
      <img src={opcion.bandera} alt={opcion.value} style={{ width: '20px'}} />
      <span style={{color: '#fff'}}>{opcion.label}</span>
    </div>
  )

  const estilosSelect = {
    control: (estiloBase) => ({
      ...estiloBase, 
      backgroundColor: '#150b25', 
      border: 'none'
    }),
    option: (estiloBase) => ({
      ...estiloBase, 
      backgroundColor: '#150b25',
    })
  }

  const convertir = async () => {
    try{ 
      console.log(actual)
      const res = await fetch(`https://open.er-api.com/v6/latest/${actual.value}`)
      const data = await res.json();
      console.log(data);
      const rate = data.rates[equivalente.value];
      const nuevoResultado = ((cantidad * rate).toFixed(2))
      setResultado(nuevoResultado)
      console.log(resultado)

      const nuevaConversion = {
        id: Date.now(),
        montoOriginal: cantidad,
        monedaOrigen: actual.value,
        montoConvertido: nuevoResultado,
        monedaDestino: equivalente.value,
      };

      const historialActualizado = [nuevaConversion, ...historial].slice(0, 3);
      setHistorial(historialActualizado);
      localStorage.setItem('historialConversion', JSON.stringify(historialActualizado));

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
          <p className='Texto'>Convierte Pesos, Dolares y Euros</p>
        </div>

        <div className='ContenedorBoxes'>
          <div className='BoxIzq'>
            <div className='ContenedorTipo'>
              <div className='ContenedorActual'>
                <Select
                  options={opcionesMoneda}
                  value={actual}
                  onChange={(opcionSeleccionada) => setActual(opcionSeleccionada)}
                  formatOptionLabel={formatoOpcion}
                  className='SelectTipo'
                  styles={estilosSelect}
                />
                <input className='InputMonto' type='number' value={cantidad} onChange={e => setCantidad(e.target.value)}></input>
              </div>

              <img src='src/assets/conversion.png' className='ImgConversion'></img>

              <Select
                options={opcionesMoneda}
                value={equivalente}
                onChange={(opcionEquivalente) => setEquivalente(opcionEquivalente)}
                formatOptionLabel={formatoOpcion}
                className='SelectEquivalente'
                styles={estilosSelect}
              />
            </div>

            <div className='ContenedorBtnsRapidos'>
              <span className='SpanMontos'>Montos rapidos</span>
              <div className='BtnsRapidos'>
                <button onClick={() => setCantidad(100)}>100</button>
                <button onClick={() => setCantidad(500)}>500</button>
                <button onClick={() => setCantidad(1000)}>1000</button>
              </div>
            </div>
            <button className='BtnConvertir' onClick={convertir}>Convertir<img src='src/assets/Flecha.png' className='IconoFlecha'></img></button>
          </div>


          <div className='BoxDer'>
              <span className='TituloResultado'>Resultado</span>
              <span className='SpanResultado'>{resultado}</span>
              {resultado && <span className='TipoMoneda'>{equivalente.value}</span>}

              <div className='Historial'>
                <span className='TituloHistorial'>Conversiones recientes</span>
                {historial.map((item) => (
                  <div key={item.id} className='ItemHistorial'>
                    <span>{item.montoOriginal} {item.monedaOrigen}</span>
                    <span>{item.montoConvertido} {item.monedaDestino}</span>
                  </div>
                ))}
              </div>
          </div>    
        </div>
      </section>
    </>
  )
}

export default App
