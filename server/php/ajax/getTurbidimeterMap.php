<?php
/* 
necessario per prendere tutti i turbidimetri da porre su maps
*/
    require_once __DIR__ . "/../util/datamanagerDB.php";

    if($_SERVER['REQUEST_METHOD']=='GET')
    {
        header('Content-Type: application/json; charset=utf-8'); 
        //ritorno un array col tipo in caso di errore o meno 
    
        $data = array();
        $oggetti = array();
        $done = getTodoFromTurbidimeters(); 
        while($row = $done->fetch())
        {
            $oggetti[] = $row;
        } 
        echo json_encode($oggetti);
    }
?>