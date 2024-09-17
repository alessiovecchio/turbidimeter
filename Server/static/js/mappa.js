var map;
var markers = []; // Array per tenere traccia dei marker aggiunti
document.addEventListener('DOMContentLoaded', function () {
    map = L.map('mappa').setView([43.7228, 10.4015], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: '© Mapbox',
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoiY2FiYnkwMCIsImEiOiJjbHF6YndiMGowMnJjMmtwMDdocDNkYmtiIn0.400sZfaG8ObXz9c0tNFtiQ'
    }).addTo(map);

    var customIcon = L.icon({
        iconUrl: '/static/icone/flag.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
    
    render_turbidimeter(customIcon);
    
    document.getElementById('markerForm').addEventListener('submit', function (event) {
        event.preventDefault();

        var latitudine = parseFloat(document.getElementById('Latitudine').value);
        var longitudine = parseFloat(document.getElementById('Longitudine').value);

        if (!isNaN(latitudine) && !isNaN(longitudine)) {
            add_turbidimeter();
            var marker = L.marker([latitudine, longitudine], { icon: customIcon }).addTo(map);
            marker.bindPopup("<b>Nuovo Marker</b><br>Latitudine: " + latitudine + "<br>Longitudine: " + longitudine).openPopup();
            markers.push(marker); // Aggiungi il marker all'array
        } else {
            alert("Inserisci coordinate valide.");
        }
    });

    document.getElementById('modifica_turbi').addEventListener('submit', function (event) {
        event.preventDefault();
        var id = parseInt(document.getElementById('turbi_id').value);
        var latitudine = parseFloat(document.getElementById('Latitudine_M').value);
        var longitudine = parseFloat(document.getElementById('Longitudine_M').value);

        if (!isNaN(latitudine) && !isNaN(longitudine)) {
            $.ajax({
                url: "/modifica_turbi",
                type: "POST",
                data: {
                    turbi_id: id,
                    Latitudine_M: latitudine,
                    Longitudine_M: longitudine
                },
                success: function(data) {
                    console.log(data);
                    //Forza il ricaricamento della pagina
                    location.reload();
                },
                error: function(error) {
                    console.log("errore richiesta per la modifica del turbidimetro");
                    console.log(error);
                }
            });
        } 
        else {
            document.getElementById('errore_modifica').innerHTML = "Dati non validi";
        }
    });
});

function render_turbidimeter(customIcon)
{
    //mostra sulla mappa i turbidimetri già presenti nel database
    $.ajax({
        url: "/turbidimetri",
        type: "GET",
        success: function(data) {
            data = JSON.parse(data);
            for (var i = 0; i < data.length; i++) {
                var marker = L.marker([data[i].latitudine, data[i].longitudine], { icon: customIcon, id:data[i].id }).addTo(map);
                marker.bindPopup("<b>Turbi "+ data[i].id +"</b><br>Latitudine: " + data[i].latitudine + "<br>Longitudine: " + data[i].longitudine + "<br><button onclick=\"remove_turbidimeter("+data[i].id+")\" >Delete</button>").openPopup();

                markers.push(marker); // Aggiungi il marker all'array
            }
            var table = document.getElementById("table");
            //crea la tabella con i dati dei turbidimetri
            if (table) {
                // Aggiungi l'intestazione
                var header = table.createTHead();
                var headerRow = header.insertRow(0);
                var headerCell1 = headerRow.insertCell(0);
                var headerCell2 = headerRow.insertCell(1);
                var headerCell3 = headerRow.insertCell(2);
                headerCell1.innerHTML = "<b>TURBI ID</b>";
                headerCell2.innerHTML = "<b>LATITUDINE</b>";
                headerCell3.innerHTML = "<b>LONGITUDINE</b>";
            
                // Aggiungi le righe dei dati
                for (var i = 0; i < data.length; i++) {
                    var row = table.insertRow();
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
            
                    // Aggiorna per utilizzare data.id
                    cell1.innerHTML = data[i].id;
                    cell2.innerHTML = data[i].latitudine;
                    cell3.innerHTML = data[i].longitudine;
                }
            }
        },
        error: function(error) {
            console.log("errore nella richiesta ajax sul reder_turbidimeter");
            console.log(error);
        }
    });
}


function add_turbidimeter()
{
    var lat=document.getElementById('Latitudine').value;
    var long=document.getElementById('Longitudine').value;
    $.ajax({
        url: "/aggiungi_turbi",
        type: "POST",
        data: {
            Latitudine: lat,
            Longitudine: long
        },
        success: function(data) {
            console.log(data);
            //Forza il ricaricamento della pagina
            location.reload();
        },
        error: function(error) {
            console.log("errore nella richiesta ajax");
            console.log(error);
        }
    });
}

function remove_turbidimeter(id)
{
    $.ajax({
        url: "/rimuovi_turbi",
        type: "POST",
        data: {
            id: id
        },
        success: function(data) {
            console.log(data);
            //find marker and remove it
            for (var i = 0; i < markers.length; i++) {
                var marker = markers[i];
                if(marker.options.id==id)
                {
                    map.removeLayer(marker);
                    markers.splice(i, 1); // Rimuovi il marker dall'array
                    break; // Esci dal ciclo una volta trovato il marker
                }   
            }
            //Forza il ricaricamento della pagina
            location.reload();
        },
        error: function(error) {
            console.log("errore nella richiesta ajax");
            console.log(error);
        }
    });
}
//funzione per visualizzare in una tabella i turbidimetri presenti nel database
