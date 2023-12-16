<?php
require_once __DIR__ . "/../util/datamanagerDB.php";

session_start();
if($_SERVER['REQUEST_METHOD']=='POST')
{
    
    $idmd = (int)$_POST['identificatoremd'];
    $latmd = (float)$_POST['latitudinemd'];
    $longmd = (float)$_POST['longitudinemd'];

    header('Content-Type: application/json; charset=utf-8'); 
    //ritorno un array col tipo in caso di errore o meno 

    try{
    $done = modifyTurbidimeter($idmd,$latmd,$longmd,$_SESSION['user']);
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
        echo json_encode(array("result" => false, "text" => "ID del turbidimetro non valido!"));
    }

}
?>