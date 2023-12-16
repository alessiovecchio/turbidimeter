<?php
	//File che si occupa di gestire le richieste Ajax di LineChartHandler.js
	require_once __DIR__ . "/../config.php";
	require_once DIR_UTIL . "dataManagerDB.php";
	require_once DIR_AJAX_UTIL . "AjaxResponse.php";


	$response = new AjaxResponse();
	
	if (!isset($_GET['turbidimeterId']) || !isset($_GET['beginningDate']) || !isset($_GET['endDate']) || !isset($_GET['oraInizio']) || !isset($_GET['oraFine'])){
		echo $_GET['turbidimeterId'] ." ".$_GET['beginningDate'] ." ".$_GET['endDate'] ." ".$_GET['oraInizio'] ." ". $_GET['oraFine'];
		return;
	}
	
	$turbidimeterId = $_GET['turbidimeterId'];
	$beginningDate = $_GET['beginningDate'];
	$endDate = $_GET['endDate'];
	//aggiungo l'orario indicato (default 0->24)
	$startHour = $_GET['oraInizio'];
	$endHour = $_GET['oraFine'];

	//  echo $startHour . " " . $endHour;

	// Estraggo l'orario in ore e minuti
	list($oreStart, $minutiStart) = explode(':', $startHour);
	list($oreEnd, $minutiEnd) = explode(':', $endHour);

	// Aggiungo l'orario all'oggetto DateTime


	$beginningDateFormatted = new DateTime($beginningDate);

	$beginningDateFormatted->modify("+{$oreStart} hours");
	$beginningDateFormatted->modify("+{$minutiStart} minutes");

	$endDateFormatted = new DateTime($endDate);

	$endDateFormatted->modify("+{$oreEnd} hours");
	$endDateFormatted->modify("+{$minutiEnd} minutes");
	
	if(isIntervalValid($beginningDate, $endDate)){ //Controllo se l'intervallo è valido
		$result = getTurbidimeterData($turbidimeterId, $beginningDateFormatted->format('Y-m-d H:i:s'), $endDateFormatted->format('Y-m-d H:i:s'));
	}else{
		$response = setEmptyResponse();
		echo json_encode($response);
		return;	
	}
	
	if (checkEmptyResult($result)){
		$response = setEmptyResponse();
		echo json_encode($response);
		return;
	}
	
	$message = "OK";	
	$response = setResponse($result, $message);
	echo json_encode($response);
	return;
	
	
	
	function checkEmptyResult($result){
		if ($result === null || !$result)
			return true;
			
		return false;//($result->num_rows <= 0); ???
	}
	
	function setEmptyResponse(){
		$message = "No data to load";
		return new AjaxResponse("-1", $message);
	}
	
	function isIntervalValid($beginningDate, $endDate){
		if(strtotime($beginningDate) > strtotime($endDate))
			return false;
		return true;
	}
	
	function setResponse($result, $message){
		$response = new AjaxResponse("0", $message);
			
		$index = 0;
		while ($row = $result->fetch()){
			
			$sensorData = new SensorData();
			
			$sensorData->timestamp = $row['timestamp'];
			$sensorData->sensor = $row['sensor'];
			$sensorData->infraredOFF = $row['infraredOFF'];
			$sensorData->visibleOFF = $row['visibleOFF'];
			$sensorData->fullSpectrumOFF = $row['fullSpectrumOFF'];
			$sensorData->infraredON = $row['infraredON'];
			$sensorData->visibleON = $row['visibleON'];
			$sensorData->fullSpectrumON = $row['fullSpectrumON'];
		
			$response->data[$index] = $sensorData;
			$index++;
		}
		
		return $response;
	}
?>
