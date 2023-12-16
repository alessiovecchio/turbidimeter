<?php
require_once __DIR__ . "/../util/datamanagerDB.php";
session_start();
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    $id = (int)$_POST['turbidimeterID'];
    $status = 0;

    header('Content-Type: application/json; charset=utf-8'); 
    try{
    $done = insertNotification($id,$status); 
    if($done)
    {
        echo json_encode(array("result" => true, "text" => "Registrazione effettuata con successo!"));
        $_SESSION['notifica']=true;
        return;
    } else {
        echo json_encode(array("result" => false, "text" => "Problema con l'inserimento dei dati"));
        return;
    }
    }catch(PDOException $e)
    {
        echo json_encode(array("result" => false, "text" => $e->getMessage()));
    }
}
?>