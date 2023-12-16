/**
       * @license
       * Copyright 2019 Google LLC. All Rights Reserved.
       * SPDX-License-Identifier: Apache-2.0
       */
/* CONTIENE TUTTE LE FUNZIONI MAPS e varie*/
let sem = true;
let turbidimetri;

function getTimestamp()
{

  e.preventDefault(); // Evita il comportamento predefinito dell'invio del form

  fetch("php/ajax/getTurbidimeterMap.php", {
    method: 'GET',
    body: null
  })
.then(response => response.json()) /*setto nel php la variabile $_SESSION['notifica']=true; */
.then(data => {
    if(!data['result']){
      window.alert("errore lettura timestamp");
    }
    else{
      turbidimetri = JSON.parse(xhr.responseText);
    }

});
}

function confrontaTimestamp()
{
  const now = new Date();

for (let i = 0; i < turbidimetri.length; i++) {
  let lastTime = turbidimetri[i].ultimoDato;
  let interval = turbidimetri[i].stimaTrasmissione;

  let data = new Date(lastTime);
  data.setMinutes(data.getMinutes() + interval); //aggiungo i minuti stimati all'ultima ricezione
  
  let newData = new Date(data);  
  //se il timestamp corrente è superiore a quello in cui dovevano arrivare dati
  //richiesta ajax per notifica di turbidimetro non funzionante
  // automaticamente aggiorno la tabella notifiche e quella dei turbidimetri
  if( newData < now)
  {
    //se il suo valore era gia a inattivo allora non si mandano ulteriori notifiche
    if(turbidimetri[i].status==0)
      continue;

    const formData = new FormData();
    formData.append('turbidimeterID', turbidimetri[i].turbidimeterID);

    fetch("php/ajax/setNotifica.php", {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
    if(!data['result']){
      window.alert("errore calcolo timestamp");
    }
    else{
    window.location.replace("index.php");
    let r = document.getElementById("notifImg");
    r.setAttribute("src","./img/notifAlert.png");
    }
    });
  }
  
}

}

setInterval(function()
{
  getTimestamp();
},1000000); //ogni 1000 secondi riprendo i dati timestamp dal db

setInterval(function()
{
  // creo una funzione che ciclicamente confronta il timestamp attuale con
  //quello di "scadenza della ricezione dati dei turbidimetri, se uno di questi sfora,
  //mando una notifica nella sezione notifiche CON INSERT IN DB"
  confrontaTimestamp();
},30000); //ogni 30 secondi confronto il timestamp, in caso inserisco la notifica


      function initMap() {
        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 10,
          center: { lat: 43.724591, lng: 10.382981 },
        });
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            turbidimetri = JSON.parse(xhr.responseText);
            setMarkers(map,turbidimetri);
          }
          }
        };
        xhr.open('GET', './php/ajax/getTurbidimeterMap.php', true);
        xhr.send();
        }
//funzione auto creata da google con cui si inseriscono i markers lungo la mappa
      function setMarkers(map,data) {
        // Adds markers to the map.
        // Marker sizes are expressed as a Size of X,Y where the origin of the image
        // (0,0) is located in the top left of the image.
        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        const image = {
          url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(500,500),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32),
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        const shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: "poly",
        };

        for (let i = 0; i < data.length; i++) {
          const turbidimetro = data[i];
          
          let stato = "attivo";
          if(!turbidimetro.status)
            stato = "inattivo";

            new google.maps.Marker({
            position: { lat: Number(turbidimetro.latitudine), lng: Number(turbidimetro.longitudine) },
            map,
            icon: image,
            shape: shape,
            title: "turbidimetro N." + String(turbidimetro.turbidimeterID) + "\nStato: " + stato + "\nCoordinate: " +  Number(turbidimetro.latitudine) + "," +  Number(turbidimetro.longitudine) +"\nUltimi dati ricevuti il: "+ turbidimetro.ultimoDato + "\nintervallo tra i dati: " +turbidimetro.stimaTrasmissione + " minuti",
            zIndex:1
          });
        }
      }

window.initMap = initMap;
function retLat()
{
  sem = true;
  let el = document.getElementById("addDiv");
  el.style.left="150%";
  el.style.transitionDuration="300ms";

  let el1 = document.getElementById("rmDiv");
  el1.style.left="150%";
  el1.style.transitionDuration="300ms";

  let el2 = document.getElementById("mdDiv");
  el2.style.left="150%";
  el2.style.transitionDuration="300ms";

  let el3 = document.getElementById("seDiv");
  el3.style.left="150%";
  el3.style.transitionDuration="300ms";
}

function moveLateral(n) //funzione che dato un intero fa comparire la relativa form
{
  if(!sem)
    return;
  document.getElementById("map").style.display="none";
  if(n==1)
  {
    sem = false;
    let el = document.getElementById("addDiv");
    el.style.left="33%";
    el.style.transitionDuration="300ms";
  }  
  else if(n==2)
  {
    sem = false;
    let el = document.getElementById("rmDiv");
    el.style.left="33%";
    el.style.transitionDuration="300ms";
  }else if(n==3)
  {
    sem = false;
    let el = document.getElementById("mdDiv");
    el.style.left="33%";
    el.style.transitionDuration="300ms";
  }else if(n==4)
  {
    sem = false;
    let el = document.getElementById("seDiv");
    el.style.left="33%";
    el.style.transitionDuration="300ms";
  }
  document.getElementById("map").style.display="block";

}

let on = true; 
function showNotifiche()
{
  let el = document.getElementById("allNotifiche");
  if(on)
  {
    el.style.transitionDuration="300ms";
    el.style.transitionTimingFunction="ease-out";
    el.style.opacity="1";
    on = false;
  }else
  {
    el.style.opacity="0";
    on = true;
  }

  let r = document.getElementById("exitAll");
  r.style.opacity="1";
  r.style.top="120px";
  r.style.transitionDuration="700ms";
  r.style.transitionTimingFunction="ease-out";

  document.getElementById("notifImg").setAttribute("src","./img/notification.png");

let xhr = new XMLHttpRequest();
let url = './php/ajax/aggiornaNotifica.php';
xhr.open('POST', url, true);

// Imposta l'intestazione per l'invio dei dati come application/x-www-form-urlencoded
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let response = JSON.parse(xhr.responseText);
        if(response=="errore")
        {
          document.getElementById("allNotifiche").textContent="errore";
        }
    }
};

xhr.send();
}

//creo il bottone per la reale creazione della ajax request.
let confermato=false;
function conferma()
{
  if(confermato)
    return;
  confermato=true;
  if(!document.getElementById("identificatorerm").value)
    {
      document.getElementById("rmDiv").style.backgroundColor="lightcoral";
      document.getElementById("errorDiv2").textContent="Errore! non è presente nessun turbidimetro con l'id specificato";
      return;
    }else
    {
      document.getElementById("rmDiv").style.backgroundColor="lightgreen";
      document.getElementById("errorDiv2").textContent=" ";
    }
  
    let b = document.createElement("button");
  document.getElementById("textrmin").textContent="rimuovendo il turbidimetro verranno rimossi"+
  " anche tutti i dati a lui annessi";

  b.textContent="conferma";
  b.setAttribute("type","button");
  b.addEventListener("click",function()
  {  
    let xhr = new XMLHttpRequest();
    let url = './php/ajax/controlTurbidimeter.php';
    xhr.open('POST', url, true);
    
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if(response=="errore")
            {
              document.getElementById("allNotifiche").textContent="errore";
              return;
            }
            let controlT = response;
            let ok = false;
            for(i=0;i<controlT.length;i++)
            {
              if(controlT[i].turbidimeterID==parseInt(document.getElementById("identificatorerm").value))
              {
                const formData = new FormData();
                //ho dovuto costruire manualmente la form per la conversione ad intero di id
                formData.append('identificatorerm', parseInt(document.getElementById("identificatorerm").value));
                fetch("php/ajax/remTurbidimeter.php", {
                  method: 'POST',
                  body: formData
                })
              .then(response => response.json())
              .then(data => {
                  if(!data['result']){
                    document.getElementById("errorDiv2").textContent= data['text'];
                    document.getElementById("rmDiv").style.backgroundColor="lightcoral";
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
              document.getElementById("rmDiv").style.backgroundColor="lightcoral";
              document.getElementById("errorDiv2").textContent="Errore! non è presente nessun turbidimetro con l'id specificato";
              return;
            }
        }
    };
    
    xhr.send();
  });
  document.getElementById("textrm").appendChild(b);

}