<?php
require_once __DIR__ . "/../util/datamanagerDB.php";
session_start();
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    header('Content-Type: application/json; charset=utf-8'); 

    if(isset($_SESSION['notifica'])){
        $_SESSION['notifica']=false;
    echo json_encode("tutto ok");
    }else
    {
        echo json_encode("errore");
    }
}
?>