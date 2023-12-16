<?php
/* 
necessario per prendere tutti i turbidimetri per i controlli
sulla modifica e rimozione dei turbidimetri
per l'inserimento scatta l'eccezione in caso di errore poiche si duplica
sulla chiave primaria
*/
    require_once __DIR__ . "/../util/datamanagerDB.php";

    if($_SERVER['REQUEST_METHOD']=='POST')
    {
        header('Content-Type: application/json; charset=utf-8'); 
        //ritorno un array col tipo in caso di errore o meno 
    
        $data = array();
        $oggetti = array();
        $done = getTurbidimeters(); 
        while($row = $done->fetch())
        {
            $oggetti[] = $row;
        } 
        echo json_encode($oggetti);
    }
?>