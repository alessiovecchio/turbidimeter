<?php

require_once __DIR__ . "/php/config.php";
require_once DIR_UTIL . "dataManagerDB.php";

 $string = "4343.274634";
 $id = 1; 
 global $turbidimeterDataDb; 
 $mysql = $turbidimeterDataDb->getConnection(); 
 $stmt = $mysql->prepare("UPDATE `turbidimeterdb`.`turbidimeters`" .
 "SET ultimoDato = ?  WHERE turbidimeterID = ?;");
$timestamp = '2023-10-12 15:30:30'; 
$stmt->bindParam(1, $timestamp, PDO::PARAM_STR);
$stmt->bindParam(2, $id, PDO::PARAM_INT);
$stmt->execute();
$stmt->closeCursor();
$turbidimeterDataDb->closeConnection(); 


?>