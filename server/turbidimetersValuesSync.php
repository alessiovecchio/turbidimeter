<?php
	require_once __DIR__ . "/php/config.php";
	require_once DIR_UTIL . "dataManagerDB.php";
    
	$turbidimetersTimestamp = array(); //Variabile in cui memorizzo il turbidimetersTimestamp[$turbidimeterIDfolder] dell'ultimo valore ricevuto tramite rsync e inserito nel DB
	//Mi faccio un array di timestamp per scrivere l'ultimo valore che inserisco nel DB per tale turbidimetro e poi vado ad aggiornare da lì in poi

	// Ciclo infinito

		// Controllo il contenuto della cartella
		$turbidimeterIDfolders = scandir("./values");
		foreach($turbidimeterIDfolders as $turbidimeterIDfolder){
			if ($turbidimeterIDfolder == '.' || $turbidimeterIDfolder == '..' || $turbidimeterIDfolder[0] == '.') 
				continue;
			
			if(!array_key_exists($turbidimeterIDfolder, $turbidimetersTimestamp))
				$turbidimetersTimestamp[$turbidimeterIDfolder] = null;
			
			$dayFolders = scandir("./values/" . $turbidimeterIDfolder);



			// Esamino ogni file nella cartella
			foreach ($dayFolders as $dayFolder) {
				// Ignoro le cartelle e i file nascosti
				if ($dayFolder == '.' || $dayFolder == '..' || $dayFolder[0] == '.') {
					continue;
				}
			

				$filesFolders = scandir("./values/" . $turbidimeterIDfolder. "/" . $dayFolder);

				$folderDate = new DateTime($dayFolder);


				
				foreach ($filesFolders as $filesFolder) {
					if ($filesFolder == '.' || $filesFolder == '..' || $filesFolder[0] == '.') {
						continue;
					}

					$index = 0;
					while($index < strlen($filesFolder) && $filesFolder[$index] != ".")
						$index++;
				
					$dateTimestamp = DateTime::createFromFormat('Y-m-d H-i-s', $dayFolder . " " . substr($filesFolder, 3, $index-3));
					//echo"Timestamp ultimo file caricato: " . $turbidimetersTimestamp[$turbidimeterIDfolder]->format('Y-m-d H-i-s') . " Timestamp file: " . $dateTimestamp->format('Y-m-d H-i-s') . "\n";
					global $turbidimeterDataDb;
					$queryText = 'SELECT latitudine, longitudine,ultimoDato FROM turbidimeters WHERE turbidimeterID = '. $turbidimeterIDfolder;
					$result = $turbidimeterDataDb->performQuery($queryText);

					$row = $result->fetch(PDO::FETCH_ASSOC);
					$latN = $row["latitudine"];
					$lonN = $row["longitudine"];
					$ultimoDatoInserito = $row["ultimoDato"];
					$timestampUltimoDato = strtotime($ultimoDatoInserito);

					$dateTimestampFile = strtotime($dateTimestamp->format('Y-m-d H:i:s'));

					//controllo di aggiugere solo gli ultimi dati inviati dal turbidimetro
					if($timestampUltimoDato >= $dateTimestampFile)
						continue;
					else
						echo "ho inserito " . $dayFolder. ' ' . $dateTimestamp->format('Y-m-d H:i:s');

					echo file_get_contents("./values/" . $turbidimeterIDfolder . "/" . $dayFolder . "/" . $filesFolder) . "\n";
			
					$readValues = array();
				
					$file = fopen("./values/" . $turbidimeterIDfolder . "/" . $dayFolder . "/" . $filesFolder, "r");

					if ($file) {
						while (($line = fgets($file)) !== false) {
							$words = explode(' ', $line);
			
							foreach ($words as $word) {
							array_push($readValues, $word);
							}
						}
		
						fclose($file);
					}
			

				$queryText = 'INSERT INTO data(turbidimeterID, timestamp, sensor, infraredOFF, visibleOFF, fullSpectrumOFF, infraredON, visibleON, fullSpectrumON) '
								.'VALUES(\'' . $turbidimeterIDfolder . '\', \'' . $dateTimestamp->format('Y-m-d H:i:s') . '\', \'' . 1 . '\', \'' . intval($readValues[0]) . '\', \'' . intval($readValues[1]) . '\', \'' . intval($readValues[2]) . '\', \'' . intval($readValues[3]) . '\', \'' . intval($readValues[4]) . '\', \'' . intval($readValues[5]) . '\')';
				$result = $turbidimeterDataDb->performQuery($queryText);
				$queryText = 'INSERT INTO data(turbidimeterID, timestamp, sensor, infraredOFF, visibleOFF, fullSpectrumOFF, infraredON, visibleON, fullSpectrumON) '
						   .'VALUES(\'' . $turbidimeterIDfolder . '\', \'' . $dateTimestamp->format('Y-m-d H:i:s') . '\', \'' . 3 . '\', \'' . intval($readValues[6]) . '\', \'' . intval($readValues[7]) . '\', \'' . intval($readValues[8]) . '\', \'' . intval($readValues[9]) . '\', \'' . intval($readValues[10]) . '\', \'' . intval($readValues[11]) . '\')';
				$result = $turbidimeterDataDb->performQuery($queryText);
				//controllo se la tensione è presente nel file, in caso affermativo lo aggiungo alla tabella
				 if(isset($readValues[12])) {
					$voltage = floatval($readValues[12]);
					$queryText = 'INSERT INTO voltage(turbidimeterID, voltage, timestamp) '
						. 'VALUES(\'' . $turbidimeterIDfolder . '\', \'' . $voltage . '\', \'' . $dateTimestamp->format('Y-m-d H:i:s') . '\')';
					$result = $turbidimeterDataDb->performQuery($queryText);
				   }

					$mysql = $turbidimeterDataDb->getConnection();
					if (isset($readValues[13]) && isset($readValues[14])) {

						$stmt = $mysql->prepare("UPDATE `turbidimeterdb`.`turbidimeters`" .
							"SET latitudine = ?, longitudine = ?, ultimoDato = ?  WHERE turbidimeterID = ?;");
						$stringlat = substr($readValues[13], 0, 2) . "." . substr($readValues[13], 2, 2) .
							substr($readValues[13], 5, 4);
						$lat = floatval($stringlat);
						$latN = $lat;
						$stmt->bindParam(1, $lat, PDO::PARAM_INT);
						$stringlon = substr($readValues[14], 0, 2) .".". substr($readValues[14], 2, 2) .
							substr($readValues[14], 5, 4);
						$lon = floatval($stringlon);
						$lonN = $lon;
						$stmt->bindParam(2, $lon, PDO::PARAM_INT);
						$timestamp = $dateTimestamp->format('Y-m-d H:i:s');
						$stmt->bindParam(3, $timestamp, PDO::PARAM_STR);
						$stmt->bindParam(4, $turbidimeterIDfolder, PDO::PARAM_INT);
						$stmt->execute();
						$stmt->closeCursor();
					} else {
						$stmt = $mysql->prepare("UPDATE `turbidimeterdb`.`turbidimeters`" .
							"SET ultimoDato = ?  WHERE turbidimeterID = ?;");
						$timestamp = $dateTimestamp->format('Y-m-d H:i:s');
						$stmt->bindParam(1, $timestamp, PDO::PARAM_STR);
						$stmt->bindParam(2, $turbidimeterIDfolder, PDO::PARAM_INT);
						$stmt->execute();
						$stmt->closeCursor();
					}
                    //aggiungo un record nella tabella notifica affinche venga segnalato che sono entrati nuovi dati
					$queryText = 'INSERT INTO notifiche(User,Tipo, latitudine,longitudine, IdTurbidimetro, Timestamp, intervallo) '
						.'VALUES(\'' . $_SESSION['user']. '\', \'' .'ins'. '\', \''. $latN. '\', \''. $lonN. '\', \''. $turbidimeterIDfolder. '\', \''. $dateTimestamp->format('Y-m-d H:i:s') . '\', \'' . 30 .  '\')';
				$turbidimeterDataDb->closeConnection(); 

				}
		
			}
		}


?>	
