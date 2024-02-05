

document.addEventListener("DOMContentLoaded", function() {
    let form = document.getElementById('data_form');
    let myChart1;
    let myChart2;
    form.addEventListener('submit', function(event) {

        event.preventDefault();
        let id=document.getElementById('turbi_id').value;
        let data_inizio=document.getElementById('data_inizio').value;
        let data_fine=document.getElementById('data_fine').value;
        
        var checkboxes = form.querySelectorAll('input[type=checkbox]:checked');
        let sensor;
        checkboxes.forEach(function(checkbox) {
                 sensor=checkbox.value;
        });

        //Controllo formato timestamp anno-mese-giorno ore:minuti:secondi
        let regex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;
        if (!regex.test(data_inizio) || !regex.test(data_fine)) {
            document.getElementById('errore_formato').innerHTML = "Formato data non valido";
            return;
        }

        //Controllo data inizio minore data fine
        let data_inizio_timestamp = new Date(data_inizio).getTime();
        let data_fine_timestamp = new Date(data_fine).getTime();
        if (data_inizio_timestamp > data_fine_timestamp) {
            document.getElementById('errore_formato').innerHTML = "Data inizio maggiore data fine";
            return;
        }
        
        //richiesta ajax per ottenere i dati sui sensori
        $.ajax({
            url: "/get_data",
            type: "POST",
            data: {
                turbi_id: id,
                data_inizio: data_inizio,
                data_fine: data_fine
            },
            success: function(data) {
                console.log(data);
                if(data=="Nessun dato presente")
                {
                    document.getElementById('errore_formato').innerHTML = "Non ci sono dati per questo dispositivo nell'intervallo di tempo selezionato";
                    return;
                }
                //Creazione grafico con i dati ottenuti, sulle ascisse il tempo e sulle ordinate i valori
                document.getElementById('errore_formato').innerHTML = "";
                var jsonData = data;


                if (myChart1) {
                    myChart1.destroy();
                    myChart2.destroy();
                }

                //creo 4 array, due per ogni sensore con i timestamp e i valori
                var timestamps1 = [];
                var values1 = [];
                var timestamps2 = [];
                var values2 = [];

                //riempio i 4 array
                for (var i = 0; i < jsonData.length; i++) {
                    if(jsonData[i].sensor=="1")
                    {
                        timestamps1.push(jsonData[i].timestamp);
                        values1.push(jsonData[i].average);
                    }
                    else
                    {
                        timestamps2.push(jsonData[i].timestamp);
                        values2.push(jsonData[i].average);
                    }
                }

                //creo un grafico per ogni sensore, sulle ascisse voglio i timestamp e sulle ordinate i valori
                var ctx = document.getElementById('myChart').getContext('2d');
                myChart1 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: timestamps1,
                        datasets: [{
                            label: 'Sensor 1 - Average',
                            data: values1,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            x: [{
                                type: 'time',
                                time: {
                                    parser: 'YYYY-MM-DD HH:mm:ss',
                                    unit: 'quarterDay',
                                    tooltipFormat: 'll HH:mm:ss'
                                }
                            }],
                            y: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
                var ctx = document.getElementById('myChart2').getContext('2d');
                myChart2 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: timestamps2,
                        datasets: [{
                            label: 'Sensor 3 - Average',
                            data: values2,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            x: [{
                                type: 'time',
                                time: {
                                    parser: 'YYYY-MM-DD HH:mm:ss',
                                    unit: 'quarterDay',
                                    tooltipFormat: 'll HH:mm:ss'
                                }
                            }],
                            y: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
                //riempi le due tabelle con i dati ottenuti
                var table = document.getElementById("table1");
                table.innerHTML = "";
                let sensor1=document.getElementById('sensor1');
                let sensor3=document.getElementById('sensor3');
                sensor1.setAttribute("style", "display: block;");
                sensor3.setAttribute("style", "display: block;");
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);
                cell1.innerHTML = "Timestamp";
                cell2.innerHTML = "VisibleON";
                cell3.innerHTML = "VisibleOFF";
                cell4.innerHTML = "fullSpcetrumON";
                cell5.innerHTML = "fullSpectrumOFF";
                cell6.innerHTML = "InfraredON";
                cell7.innerHTML = "InfraredOFF";
                cell1.style.fontWeight = "bold";
                cell2.style.fontWeight = "bold";
                cell4.style.fontWeight = "bold";
                cell3.style.fontWeight = "bold";
                cell5.style.fontWeight = "bold";
                cell6.style.fontWeight = "bold";
                cell7.style.fontWeight = "bold";
                for (var i = 0; i < jsonData.length; i++) {
                    var row = table.insertRow(i + 1);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    var cell7 = row.insertCell(6);

                    if(jsonData[i].sensor=="1")
                    {
                        cell1.innerHTML = jsonData[i].timestamp;
                        cell2.innerHTML = jsonData[i].visibleON;
                        cell3.innerHTML = jsonData[i].visibleOFF;
                        cell4.innerHTML = jsonData[i].fullSpectrumON;
                        cell5.innerHTML = jsonData[i].fullSpectrumOFF;
                        cell6.innerHTML = jsonData[i].infraredON;
                        cell7.innerHTML = jsonData[i].infraredOFF;
                    }
                }
                var table = document.getElementById("table2");
                table.innerHTML = "";
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);
                cell1.innerHTML = "Timestamp";
                cell2.innerHTML = "VisibleON";
                cell3.innerHTML = "VisibleOFF";
                cell4.innerHTML = "fullSpcetrumON";
                cell5.innerHTML = "fullSpectrumOFF";
                cell6.innerHTML = "InfraredON";
                cell7.innerHTML = "InfraredOFF";
                cell1.style.fontWeight = "bold";
                cell2.style.fontWeight = "bold";
                cell4.style.fontWeight = "bold";
                cell3.style.fontWeight = "bold";
                cell5.style.fontWeight = "bold";
                cell6.style.fontWeight = "bold";
                cell7.style.fontWeight = "bold";
                sensor3.setAttribute("style", "display: block;");
                for (var i = 0; i < jsonData.length; i++) {
                    var row = table.insertRow(i + 1);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    var cell7 = row.insertCell(6);
                    if(jsonData[i].sensor=="3")
                    {
                        cell1.innerHTML = jsonData[i].timestamp;
                        cell2.innerHTML = jsonData[i].visibleON;
                        cell3.innerHTML = jsonData[i].visibleOFF;
                        cell4.innerHTML = jsonData[i].fullSpectrumON;
                        cell5.innerHTML = jsonData[i].fullSpectrumOFF;
                        cell6.innerHTML = jsonData[i].infraredON;
                        cell7.innerHTML = jsonData[i].infraredOFF;
                    }
                }

            },
            error: function(error) {
                console.log("errore nella richiesta per ottenere i dati");
                console.log(error);
            }
        });

    });

});
