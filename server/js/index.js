// CONTIENE TUTTE LE PROMESSE AJAX 

function validateCoordinates(x) {
  //valido le coordinate immesse in decimale. essendo lo stesso regexp per latitudine e longitune uso una sola variabile
  let latitudineInput;
  if(x=="add"){
  latitudineInput = document.getElementById('latitudine');
  longitudineInput = document.getElementById('longitudine');
  }else if(x=="mod")
  {
  latitudineInput = document.getElementById('latitudinemd');
  longitudineInput = document.getElementById('longitudinemd');
  }
  const latitudineValue = latitudineInput.value.trim(); //rimuovo gli spazi all'inizio e alla fine
  //const longitudineValue = longitudineInput.value.trim(); //uguale

  const latitudinePattern = /-?\d+\.\d+/g;///^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
  //const longitudinePattern = /-?\d+\.\d+/g;///^[-+]?((1[0-7]\d|0?\d{1,2})(\.\d+)?|180(\.0+)?)$/;

  if (!latitudinePattern.test(latitudineValue)) {
      if(x=='add')
      {
        document.getElementById("errorDiv1").textContent='Attenzione! Inserisci latitudine e longitudine nel formato decimale (es. 40.7128 o -37.8136)';
      }
      else if(x=='mod')
      {
        document.getElementById("errorDiv3").textContent='Attenzione! Inserisci latitudine e longitudine nel formato decimale (es. 40.7128 o -37.8136)';
      }
      latitudineInput.focus(); //attira l'attenzione verso l'input errato
      return false;
  }

  return true;
}


const addT = document.getElementById("turbidimeterForm");
// const remT = document.getElementById("removeForm");
const modT = document.getElementById("modifyForm");
const setT = document.getElementById("settingsForm");

//AGGIUNTA TURBIDIMETRI
/* 
L'aggiunta, cosi come le altre promesse, costruisce in autonomia il formData
perché è stato necessario convertire a mano i valori da stringhe a interi
in modo da far funzionare correttamente le query di inserimento.
*/
addT.addEventListener("submit",(e)=>
{
  e.preventDefault(); // Evita il comportamento predefinito dell'invio del form

  if(!validateCoordinates("add"))
    return;

  const formData = new FormData();
  //ho dovuto costruire manualmente la form per la conversione ad intero di id
  formData.append('identificatore', parseInt(document.getElementById("identificatore").value));
  formData.append('latitudine', document.getElementById("latitudine").value);
  formData.append('longitudine', document.getElementById("longitudine").value); 

  fetch("php/ajax/newTurbidimeter.php", {
    method: 'POST',
    body: formData
  })
.then(response => response.json()) /*setto nel php la variabile $_SESSION['notifica']=true; */
.then(data => {
    if(!data['result']){
      document.getElementById("errorDiv1").textContent= data['text'];
      document.getElementById("addDiv").style.backgroundColor="lightcoral";
    }
    else{
      window.location.replace("index.php");
      let r = document.getElementById("notifImg");
      r.setAttribute("src","./img/notifAlert.png");
    }
});
});
/* 
  occorre fare lo stesso procedimento della rimozione:
    verificare che l'id del turbidimetro che vogliamo modificare effettivamente esista
    in caso contrario mostrare un errore e annullare l'operazione.
    (il controllo sulle coordinate si occupa degli altri due campi della form)
*/
modT.addEventListener("submit",(e)=>
{
  e.preventDefault();

  if(!validateCoordinates("mod"))
  return;

  let xhr = new XMLHttpRequest();
  let url = './php/ajax/controlTurbidimeter.php';
  xhr.open('POST', url, true);
  
  // Imposta l'intestazione per l'invio dei dati come application/x-www-form-urlencoded
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  let ok = false;
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText);
          if(response=="errore")
          {
            document.getElementById("allNotifiche").textContent="errore";
            return;
          }
          let controlT = response;
          for(i=0;i<controlT.length;i++)
            {
              if(controlT[i].turbidimeterID==parseInt(document.getElementById("identificatoremd").value))
              {
                if(!validateCoordinates("mod"))
                  return;

            const formData = new FormData();
            //ho dovuto costruire manualmente la form per la conversione ad intero di id
            formData.append('identificatoremd', parseInt(document.getElementById("identificatoremd").value));
            formData.append('latitudinemd', document.getElementById("latitudinemd").value);
            formData.append('longitudinemd', document.getElementById("longitudinemd").value); 
  
  
            fetch("php/ajax/modTurbidimeter.php", {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => {
              if(!data['result']){
                document.getElementById("errorDiv3").textContent= data['text'];
                document.getElementById("mdDiv").style.backgroundColor="lightcoral";
              }
              else{
              window.location.replace("index.php");
              let r = document.getElementById("notifImg");
              r.setAttribute("src","./img/notifAlert.png");
              }
            });
            return;
            }
          }
          if(!ok)
          {
            document.getElementById("mdDiv").style.backgroundColor="lightcoral";
            document.getElementById("errorDiv3").textContent="Errore! non è presente nessun turbidimetro con l'id specificato";
            return;
          }
      }
  };
  
  xhr.send();
});

window.arrTurb;
function moveToCoordinates() {
  let xhr = new XMLHttpRequest(); //richiedo tutti i turbidimetri con le loro posizioni
        xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            window.arrTurb = JSON.parse(xhr.responseText);

            /*una volta trovati cerco quello che corrisponde a quello selezionato */
            let t = document.getElementById("turbidimetriMap").value;
            i=0
            for(;i<window.arrTurb.length;i++)
            {
              if(window.arrTurb[i].turbidimeterID==t)
                break;
            }
            /*utilizzo le sue coordinate per visualizzarlo nella mappa */
            let newCoordinates = new google.maps.LatLng(window.arrTurb[i].latitudine,window.arrTurb[i].longitudine); // Nuove coordinate (San Francisco)
            map = new google.maps.Map(document.getElementById("map"), {
              zoom: 15,
              center: { lat: 43.724591, lng: 10.382981 },
            });
            map.panTo(newCoordinates);
            setMarkers(map,window.arrTurb);
            // LineChartHandler.onNewInterval()

          } else {
              window.alert('errore con le coordinate del turbidimetro selezionato');
            }
          }
        };
        xhr.open('GET', './php/ajax/getTurbidimeterMap.php', true);
        xhr.send();
}

/* SETTAGGIO SETTINGS STATUS TURBIDIMETRO*/

setT.addEventListener("submit",(e)=>
{
  if(document.getElementById("setTime").value == null)
    document.getElementById("errorDiv4").textContent="inserisci i minuti di di intervallo stimati tra una ricezione e la successiva";

  e.preventDefault(); 

  let xhr = new XMLHttpRequest();
  let url = './php/ajax/controlTurbidimeter.php';
  xhr.open('POST', url, true);
  
  // Imposta l'intestazione per l'invio dei dati come application/x-www-form-urlencoded
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText);
          if(response=="errore")
          {
            document.getElementById("errorDiv4").textContent= data['text'];
            document.getElementById("seDiv").style.backgroundColor="lightcoral";
            return;
          }
          let controlT = response;
          let ok = false;
          for(i=0;i<controlT.length;i++)
          {
            if(controlT[i].turbidimeterID==parseInt(document.getElementById("identificatorese").value))
            {
              const formData = new FormData();
              //ho dovuto costruire manualmente la form per la conversione ad intero di id
              formData.append('identificatorese', parseInt(document.getElementById("identificatorese").value));
              formData.append('setTime', parseInt(document.getElementById("setTime").value));
            
              fetch("php/ajax/setTurbidimeter.php", {
                method: 'POST',
                body: formData
              })
            .then(response => response.json())
            .then(data => {
                if(!data['result']){
                  document.getElementById("errorDiv4").textContent= data['text'];
                  document.getElementById("seDiv").style.backgroundColor="lightcoral";
            
                }
                else{
                  window.location.replace("index.php");
                  let r = document.getElementById("notifImg");
                  r.setAttribute("src","./img/notifAlert.png");
                }
            });
            return;
            }else
            {
              document.getElementById("errorDiv4").textContent="errore! id del turbidimetro non valido!";
              document.getElementById("seDiv").style.backgroundColor="lightcoral";
            }
          }
          if(!ok)
          {
            document.getElementById("rmDiv").style.backgroundColor="lightcoral";
            document.getElementById("errorDiv2").textContent="Errore! non è presente nessun turbidimetro con l'id specificato";
            return;
          }
      }
  };
  
  xhr.send();
});


//funzioni inline

document.getElementById("exitAdd").addEventListener("click", retLat);
document.getElementById("exitmd").addEventListener("click", retLat);
document.getElementById("exitrm").addEventListener("click", retLat);
document.getElementById("exitse").addEventListener("click", retLat);


document.getElementById("lateralSe").addEventListener("click",function()
{
  moveLateral(4);
})

document.getElementById("lateralMd").addEventListener("click",function()
{
  moveLateral(3);
})

document.getElementById("lateralRm").addEventListener("click",function()
{
  moveLateral(2);
})

document.getElementById("lateralAdd").addEventListener("click",function()
{
  moveLateral(1);
})

document.getElementById("exitAll").addEventListener("click",showNotifiche);
document.getElementById("notificheDiv").addEventListener("click",showNotifiche);
document.getElementById("remove").addEventListener("click",function(e)
{
  e.preventDefault();
  conferma();
});

document.getElementById("turbidimetriMap").addEventListener("change",moveToCoordinates);
document.getElementById("visualizzaDati").addEventListener("click", LineChartVoltageHandler.onNewInterval);
document.getElementById("visualizzaDati").addEventListener("click", LineChartHandler.onNewInterval);
document.getElementById("esportaCSV").addEventListener("click", lineChartDataDashboard.exportCSVData);
document.getElementById("esportaCSV").addEventListener("click", lineChartVoltageDashboard.exportCSVData);
document.getElementById("turbidimetri").addEventListener("change", LineChartHandler.onNewInterval);
document.getElementById("turbidimetri").addEventListener("change", LineChartVoltageHandler.onNewInterval);


const allNotifiche = document.getElementById('allNotifiche');
// const toggleButton = document.getElementById('notificheDiv');

// toggleButton.addEventListener('click', () => {
//   allNotifiche.classList.toggle('opened');
// });
