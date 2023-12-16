//file che si occupa solo di caricare il database prendendo i dati che vengono scritti nei file

function richiestaInfo() {
    $.ajax({ 
         type: 'POST', 
         url: 'turbidimetersValuesSync.php', 
         datatype: "json", 
         success: function(datainfo) {
         },
         error: function() {
             alert("Impossibile contattare il server di supporto"); 
         }
       });  
   }
   
   $( document ).ready(function() {
       LineChartVoltageHandler.onNewInterval();
       LineChartHandler.onNewInterval();
       richiestaInfo();
       setInterval(richiestaInfo, 60000);

    });