<?php
require_once __DIR__ . "/../util/datamanagerDB.php";
session_start();
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    $name = $_POST["name"];
    $password = $_POST["password"];

    header('Content-Type: application/json; charset=utf-8'); 

    try{
        $done = addUser($name,$password);
    }catch(PDOException $e)
    {
        echo json_encode(array("result" => false, "text" => $e->getMessage()));
        return;
    }
    if($done)
    {
        $_SESSION['notifica']=true;
        $_SESSION['utente_registrato']=true;
        $_SESSION['user']=$name;
        echo json_encode(array("result" => true, "text" => "Registrazione effettuata con successo!","user" => $name));
        return;
    } else {
        echo json_encode(array("result" => false, "text" => "problema con la registrazione! " + $e->getMessage()));
        return;
    }
}
?>
