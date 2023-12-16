<?php
	require_once __DIR__ . "/../config.php";
    require_once DIR_UTIL . "turbidimeterDataDbManager.php"; //includes Database Class

	function getTurbidimeters() { //Ci fornisce i turbidimetri da inserire nel campo select
	    global $turbidimeterDataDb;
		$queryText = 'SELECT turbidimeterID ' 
		               . 'FROM turbidimeters ';
		$result = $turbidimeterDataDb->performQuery($queryText);
		$turbidimeterDataDb->closeConnection();
		return $result;
	}

	function getTodoFromTurbidimeters()
	{
		global $turbidimeterDataDb;
		$queryText = 'SELECT * ' 
		               . 'FROM turbidimeters ';
		$result = $turbidimeterDataDb->performQuery($queryText);
		$turbidimeterDataDb->closeConnection();
		return $result;
	}
	
	function getTurbidimeterData($turbidimeterId, $beginningDate, $endDate){
		global $turbidimeterDataDb;
		$queryText = 'SELECT timestamp, sensor, infraredOFF, visibleOFF, fullSpectrumOFF, infraredON, visibleON, fullSpectrumON ' 
		               . 'FROM data '
					   .'WHERE turbidimeterID=' . $turbidimeterId . ' AND timestamp>=\'' . $beginningDate . '\' AND timestamp<=\'' . $endDate . '\'';
		//controllare come controllare date antecedenti/post in mySQL
		$result = $turbidimeterDataDb->performQuery($queryText);
		$turbidimeterDataDb->closeConnection();
		return $result;
	}

function getVoltageData($turbidimeterId, $beginningDate, $endDate){
    global $turbidimeterDataDb;
    $mysql = $turbidimeterDataDb->getConnection();
    $stmt = $mysql->prepare("SELECT voltage, timestamp FROM voltage
        WHERE turbidimeterID= ?  AND timestamp>= ? AND timestamp<= ?");
    //controllare come controllare date antecedenti/post in mySQL


    $stmt->bindParam( 1,$turbidimeterId, PDO::PARAM_INT);
    $stmt->bindParam(2,$beginningDate, PDO::PARAM_STR);
    $stmt->bindParam(3,$endDate, PDO::PARAM_STR);
    $stmt->execute();
    return $stmt;
}

	function storeTurbidimeter($turbidimeterId,$latitudine,$longitudine,$user)
	{
		$try = (int)$turbidimeterId;
		global $turbidimeterDataDb;
		$queryText = "INSERT INTO Turbidimeters values"
			. "(:turbidimeterID,:latitudine,:longitudine,30,CURRENT_TIMESTAMP(),1)";
		$res = $turbidimeterDataDb->prepareToBind($queryText);

		$res->bindParam(":turbidimeterID",$try);
		$res->bindParam(":latitudine",$latitudine);
		$res->bindParam(":longitudine",$longitudine);

		/*necessario per area notifica */
		$queryNoti =  "INSERT INTO Notifiche values"
		. "(:User,:Tipo,".$latitudine.",".$longitudine.",".$try.",CURRENT_TIMESTAMP(),NULL);";
		$resN = $turbidimeterDataDb->prepareToBind($queryNoti);

		$stat = "ins";
		$resN->bindParam(":Tipo",$stat);
		$resN->bindParam(":User",$user);


		$turbidimeterDataDb->executeStmt($resN);
		$turbidimeterDataDb->closeConnection();

		return  $turbidimeterDataDb->executeStmt($res);
	}

	function removeTurbidimeter($turbidimeterId,$user)
	{
		$try = (int)$turbidimeterId;
		global $turbidimeterDataDb;
		$queryText = "DELETE FROM Turbidimeters WHERE turbidimeterID = ". $try;
		$res = $turbidimeterDataDb->prepareToBind($queryText);

		
		$queryNoti =  "INSERT INTO Notifiche values"
		. "(:User,:Tipo,NULL,NULL,".$try.",CURRENT_TIMESTAMP(),NULL);";
		$resN = $turbidimeterDataDb->prepareToBind($queryNoti);

		$stat = "del";
		$resN->bindParam(":Tipo",$stat);
		$resN->bindParam(":User",$user);

		$turbidimeterDataDb->executeStmt($resN);

		$querydata =  "DELETE FROM data WHERE turbidimeterID = ". $try;
		$resN = $turbidimeterDataDb->prepareToBind($querydata);

		$turbidimeterDataDb->executeStmt($resN);

		$turbidimeterDataDb->closeConnection();

		return  $turbidimeterDataDb->executeStmt($res);
	}

	function modifyTurbidimeter($turbidimeterId,$latitudine,$longitudine,$user)
	{
		$try = (int)$turbidimeterId;
		$loclatitudine = (float)$latitudine;
		$loclongitudine = (float)$longitudine;

		global $turbidimeterDataDb;
		$queryText = "UPDATE Turbidimeters SET latitudine= ".$loclatitudine.", longitudine= ".$loclongitudine."  WHERE turbidimeterID =" . $try;
		$res = $turbidimeterDataDb->prepareToBind($queryText);

		/*necessario per area notifica */
		$queryNoti =  "INSERT INTO Notifiche values"
		. "(:User,:Tipo,".$loclatitudine.",".$loclongitudine.",".$try.",CURRENT_TIMESTAMP(),NULL);";
		$resN = $turbidimeterDataDb->prepareToBind($queryNoti);

		$stat = 'mod';
		$resN->bindParam(":Tipo",$stat);
		$resN->bindParam(":User",$user);

		//$resN->bindParam(":latitudine",$latitudine);
		//$resN->bindParam(":longitudine",$longitudine);

		$turbidimeterDataDb->executeStmt($resN);


		$turbidimeterDataDb->closeConnection();

		return  $turbidimeterDataDb->executeStmt($res);
	}

	function getNotifications()
	{
		global $turbidimeterDataDb;

		$queryText = "SELECT * FROM Notifiche ORDER BY Timestamp DESC";
		$result = $turbidimeterDataDb->performQuery($queryText);
		
		$turbidimeterDataDb->closeConnection();
		return $result;
	}

	function addUser($name,$pass)
	{

		global $turbidimeterDataDb;
		$queryText = "INSERT INTO users values"
			. "(:name,:pass);";
		$res = $turbidimeterDataDb->prepareToBind($queryText);

		$hashedPassword = password_hash($pass, PASSWORD_DEFAULT);
		$res->bindParam(":name",$name);
		$res->bindParam(":pass",$hashedPassword);

		/*necessario per area notifica */
		$queryNoti =  "INSERT INTO Notifiche values"
		. "(:User,:Tipo,"."null".","."null".","."null".",CURRENT_TIMESTAMP(),NULL)";
		$resN = $turbidimeterDataDb->prepareToBind($queryNoti);

		$stat = "login";
		$resN->bindParam(":Tipo",$stat);
		$resN->bindParam(":User",$name);

		$turbidimeterDataDb->executeStmt($resN);
		$turbidimeterDataDb->closeConnection();

		return  $turbidimeterDataDb->executeStmt($res);
	}

	function controlUser($nome,$password)
	{
		global $turbidimeterDataDb;
		// Verifica l'accesso
		$queryText = "SELECT * FROM users WHERE name = '$nome'";
		$result = $turbidimeterDataDb->performQuery($queryText);

			while($row = $result->fetch()){
			if (password_verify($password, $row["password"])) {
						/*necessario per area notifica */
				$queryNoti =  "INSERT INTO Notifiche values"
				. "(:User,:Tipo,"."null".","."null".","."null".",CURRENT_TIMESTAMP(),NULL)";
				$resN = $turbidimeterDataDb->prepareToBind($queryNoti);

				$stat = "login";
				$resN->bindParam(":Tipo",$stat);
				$resN->bindParam(":User",$nome);

				$turbidimeterDataDb->executeStmt($resN);
				$turbidimeterDataDb->closeConnection();
				return true;
			} else {
				return false;
			}
		}
	}

	function setTurbidimeter($turbidimeterId,$setTime,$user)
	{
		$try = (int)$turbidimeterId;
		global $turbidimeterDataDb;

		$queryText = "UPDATE Turbidimeters SET stimaTrasmissione = :time  WHERE turbidimeterID = ". $try;
		$resS = $turbidimeterDataDb->prepareToBind($queryText);

		$resS->bindParam(":time",$setTime);
		
		$queryNoti =  "INSERT INTO Notifiche values"
		. "(:User,:Tipo,NULL,NULL,".$try.",CURRENT_TIMESTAMP(),:time);";
		$resN = $turbidimeterDataDb->prepareToBind($queryNoti);

		$stat = "set";
		$resN->bindParam(":Tipo",$stat);
		$resN->bindParam(":User",$user);
		$resN->bindParam(":time",$setTime);

		$turbidimeterDataDb->executeStmt($resN);

		$turbidimeterDataDb->closeConnection();

		return  $turbidimeterDataDb->executeStmt($resS);
	}

	function getTimestampTurbidimeter()
	{
		global $turbidimeterDataDb;

		$queryText = "SELECT stimaTrasmissione, ultimoDato, from Turbidimeters";
		$resS = $turbidimeterDataDb->prepareToBind($queryText);

		return  $turbidimeterDataDb->executeStmt($resS);
	}
	
	function insertNotification($id,$status)
	{
		global $turbidimeterDataDb;

		$queryNoti =  "INSERT INTO Notifiche values"
		. "(NULL,:Tipo,:stato,NULL,".$id.",CURRENT_TIMESTAMP(),NULL);";
		$resN = $turbidimeterDataDb->prepareToBind($queryNoti);

		$stat = "status";
		$resN->bindParam(":Tipo",$stat);
		$resN->bindParam(":stato",$status);

		//una volta fatta la notifica riporto lo stato inattivo
		//sulla tabella turbidimetri

		$queryText = "UPDATE Turbidimeters SET status = :status  WHERE turbidimeterID = ". $id;
		$resS = $turbidimeterDataDb->prepareToBind($queryText);

		$resS->bindParam(":status",$status);
		$turbidimeterDataDb->executeStmt($resS);

		return $turbidimeterDataDb->executeStmt($resN);
	}
?>