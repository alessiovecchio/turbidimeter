<?php
require_once __DIR__ . "/../util/datamanagerDB.php";

session_start();
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $nome = $_POST["name"];
    $password = $_POST["password"];

    header('Content-Type: application/json; charset=utf-8'); 
    try{
    $done = controlUser($nome,$password);
    }catch(PDOException $e)
    {
        echo json_encode(array("result" => false, "text" => $e.getMessage()));
    }
    
    if($done)
    {
        $_SESSION['notifica']=true;
        $_SESSION['utente_registrato']=true;
        $_SESSION['user']=$nome;
        echo json_encode(array("result" => true, "text" => "Registrazione effettuata con successo!","user" => $name));
    } else {
        echo json_encode(array("result" => false, "text" => "Username o password non validi"));
    }
}
?>
