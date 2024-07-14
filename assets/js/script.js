const apiURL = "https://mindicador.cl/api/";
let myChart;

// 1. CALCULO PARA LA CONVERSIÓN

async function getMonedas() {
    // Obtener datos de la API
    const res = await fetch(apiURL);
    const monedas = await res.json();
    return monedas;
}

// LLAMADA DESDE BTN BUSCAR
async function renderMonedas() {
  try {
    const pesos = document.getElementById("pesos").value; // Pesos CL a convertir
    const tipomoneda = document.getElementById("tipoMoneda").value; // Dolar, euro o UF
    const resultado = document.getElementById("resultado"); // Resultado del total convertido
    const regex = /^[0-9]*$/; // valores para validar solo sean numeros
    const onlyNumbers = regex.test(pesos); // busca que solo sean números
    const errorSpan = document.getElementById("error");
    //errorSpan.innerHTML = '';
    console.log(tipomoneda);
    console.log(typeof(tipomoneda));
    if ((onlyNumbers && pesos>0) && (tipomoneda !== '0'))  {
      const monedas = await getMonedas();
      valoraConvertir = monedas[tipomoneda].valor;
      resultadoFinal = pesos / valoraConvertir;
      resultado.innerHTML = `<p>Total: ${resultadoFinal.toFixed(2)}</p>`;
      renderGrafica(tipomoneda); // LLAMADA A GRAFICAR
    } else {
      alert(`Ingrese números > 0 en "Pesos Chilenos (CLP)" y Moneda`);
      return;
    }
  } catch (error) {
    console.log(`${error.message}`);
    errorSpan.innerHTML = `<p><strong>*** Error en los datos para conversión: ${error.message} ***</strong></p>`;
  }
}

// 2. GRÁFICO - CANVAS
async function getTipoMonedas(tipomoneda) {
  const apiURL2 = apiURL + tipomoneda;
  const res = await fetch(apiURL2);
  const monedas = await res.json();
  const monedas10 = (monedas.serie.slice(0, 10)).reverse();
  return monedas10;
}

function prepararConfiguracionParaLaGrafica(monedas10, tipomoneda) {
  // Variables necesarias para el objeto de configuración
  const tipoDeGrafica = "line";
  const titulo = "Últimos 10 días";
  const colorDeLinea = "blue";
  const nombresDeLasMonedas = monedas10.map((moneda) => moneda.fecha.substring(0, 10)); // Datos en Eje X
  const valores = monedas10.map((moneda) => moneda.valor); // Datos en Eje Y
  // Crear objeto de configuración usando variables anteriores
  const config = {
    type: tipoDeGrafica,
    data: {
      labels: nombresDeLasMonedas, // Eje X
      datasets: [
        {
          label: `${tipomoneda.toUpperCase()} - ${titulo}`,
          backgroundColor: colorDeLinea, // color gráfico
          data: valores, // Eje Y
        },
      ],
    },
  };
  return config;
}

// 2.1 Obtiene datos iniciales
async function renderGrafica(tipomoneda) {
    try {
        const monedas = await getTipoMonedas(tipomoneda);
        const config = prepararConfiguracionParaLaGrafica(monedas, tipomoneda);
        let chartDOM = document.getElementById("myChart");
        if (myChart) { // valida si la gráfica fue generada
            myChart.destroy();
            myChart = new Chart(chartDOM, config);
        }else {
            myChart = new Chart(chartDOM, config);
        }        
    } catch (error) {
        const errorSpan = document.getElementById("errorGraf");
        errorSpan.innerHTML = `<p><strong>*** Error al generar gráfico: ${error.message} ***</strong></p>`;
    }
}

