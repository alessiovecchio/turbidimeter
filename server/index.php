<?php
	require_once __DIR__ . "/php/config.php";
	require_once DIR_UTIL . "dataManagerDB.php";	
	require DIR_UTIL . "dbConfig.php";

	session_start();
if (!(isset($_SESSION['utente_registrato']) && $_SESSION['utente_registrato'] === true)) {
    // L'utente non è registrato,devo reindirizzarlo alla pagina di registrazione
    header("Location: start.php");
}

?>
	
<!DOCTYPE html>
<html lang="it">
	<head>
        <!-- <meta charset="utf-8"> -->
		<meta name="author" content="Lorenzo Menchini">
		<meta name="keywords" content="turbidimeter">
		<link rel="stylesheet" type="text/css" href="./css/style.css" media="screen">
		<script src="https://d3js.org/d3.v4.min.js"></script>
        <script src="./js/jquery-3.7.1.min.js"></script>
		<script src="./js/turbidityLineChart.js"></script>
        <script src="./js/turbidityVoltageChart.js"></script>
		<script src="./js/ajax/ajaxManager.js"></script>
		<script src="./js/ajax/LineChartHandler.js"></script>
        <script src="./js/ajax/LineChartVoltageHandler.js"></script>
		<script src="./js/ajax/lineChartDataDashboard.js"></script>
        <script src="./js/ajax/lineChartVoltageDashboard.js"></script>
		<script src="./js/maps.js"></script>
        <script  src="js/onLoad.js"></script>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
		<title>Turbidimetri</title>
	</head>
	<body>
			<a href="start.php" class="logout">logout<a href="doc.html" class="logout">documentazione,</a></a>
		<label for="turbidimetriMap" id="labmap">Turbidimetro:</label> <br>
			<select id="turbidimetriMap" name="turbidimetriMap">
				<?php
				global $turbidimeterDataDb;
				if($turbidimeterDataDb->isOpen())
				{
					try
					{
						$res = getTurbidimeters();
						while ($row = $res->fetch()) {
							echo'<option value=' .$row['turbidimeterID'] . '>' .$row['turbidimeterID'] . '</option>';
						}
						
					}catch (PDOException $e) {
						
						echo "Errore: " . $e->getMessage();
					} // poi da rimuovere
				}else
				{
					$turbidimeterDataDb->openConnection();
					try
					{
					$result = getTurbidimeters(); 
					if ($result->rowCount() > 0) {
						while ($row = $result->fetch()) {
							echo'<option value=' .$row['turbidimeterID'] . '>' .$row['turbidimeterID'] . '</option>';
						}
					}
				}catch (PDOException $e) {	
					echo "<option>Errore: " . $e->getMessage() . "</option>";
				}
			}
			?>
			</select>
		<!-- </div> -->
		<div id="turbidityLineChartDiv">
		<div id="notificheDiv">
		<?php
		if(isset($_SESSION['notifica']))
		{
			if($_SESSION['notifica']==true){
				echo "<img src=\"./img/notifAlert.png\" alt=\"ci sono notifiche\" id=\"notifImg\">";
				$_SESSION['notififa']=false;
			}else{
				echo "<img src=\"./img/notification.png\" alt=\"area notifiche\" id=\"notifImg\">";
				$_SESSION['notifica']=false;
			}
		}else
		{
			echo "<img src=\"./img/notification.png\" alt=\"area notifiche\" id=\"notifImg\">";
				$_SESSION['notifica']=false;
		}
		?>
				</div>
			<div id="allNotifiche">
				<div id="exitAll"><img src="./img/remove.png" alt="esci"></div>
				<?php
				global $turbidimeterDataDb;
				if($turbidimeterDataDb->isOpen())
				{
					try
					{
						$res = getNotifications();
						while ($row = $res->fetch()) {
							if($row['Tipo']=='ins')
							{
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . "è stato inserito correttamente" . '</h3>';
								echo '<hr>';
							} else if($row['Tipo']=='del')
							{
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . "è stato rimosso correttamente" . '</h3>';
								echo '<hr>';
							}else if($row['Tipo']=='mod')
							{
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . "è stato modificato con successo," 
								."<b>nuove coordinate</b>: latitudine: ". $row['latitudine'] . " longitudine: ".$row['longitudine'] . '</h3>';
								echo '<hr>';

							}else if($row['Tipo']=='newdata')
							{
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . "ha correttamente inviato nuovi dati" . '</h3>';
								echo '<hr>';

							}else if($row['Tipo']=='status')
							{
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . "non ha inviato nuovi dati" . '</h3>';
								echo '<hr>';

							}else if($row['Tipo']=='set')
							{
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . "invierà dati ogni " . $row['latitudine'] . '</h3>';
								echo '<hr>';

							}else if($row['Tipo']=='status')
							{
								echo "<h2 class=\"warning\">".$row['Timestamp']."</h2>";
								echo '<h3 class=\'warning\' > il turbidimetro '.$row['IdTurbidimetro'] . ' non ha invato dati </h3>';
								echo '<hr>';
							}else
							{
								echo '<h3> l\'utente '.$row['tipo'] . "si è autenticato correttamente " . '</h3>';
								echo '<hr>';
							}
						}
						
					}catch (PDOException $e) {
						
						echo "Errore: " . $e->getMessage();
					} // poi da rimuovere
				}else{
					$turbidimeterDataDb->openConnection();
					try
					{
						$res = getNotifications();
						while ($row = $res->fetch()) {
							if($row['Tipo']=='ins')
							{
								echo "<h2>".$row['Timestamp']."</h2>";
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . " è stato inserito correttamente da " .$row['User'] . '</h3>';
								echo '<hr>';
							} else if($row['Tipo']=='del')
							{
								echo "<h2>".$row['Timestamp']."</h2>";
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . " è stato rimosso correttamente da " .$row['User'] . '</h3>';
								echo '<hr>';
							}else if($row['Tipo']=='mod')
							{
								echo "<h2>".$row['Timestamp']."</h2>";
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . " è stato modificato con successo da ".$row['User']."," 
								."<b>nuove coordinate</b>: latitudine: ". $row['latitudine'] . " longitudine: ".$row['longitudine'] . '</h3>';
								echo '<hr>';

							}else if($row['Tipo']=='newdata')
							{
								echo "<h2>".$row['Timestamp']."</h2>";
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . "ha correttamente inviato nuovi dati" . '</h3>';
								echo '<hr>';
							}else if($row['Tipo']=='login')
							{
								echo "<h2>".$row['Timestamp']."</h2>";
								echo '<h3> l\'utente '.$row['User'] . " si è autenticato correttamente " . '</h3>';
								echo '<hr>';
							}else if($row['Tipo']=='status')
							{
								if(intval($row['latitudine'])==0)
								{
									echo "<h2>".$row['Timestamp']."</h2>";
									echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . "  NON ha inviato nuovi dati!" . '</h3>';
									echo '<hr>';
								}else
								{
									echo "<h2>".$row['Timestamp']."</h2>";
									echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . "  ha inviato nuovi dati" . '</h3>';
									echo '<hr>';
								}
							}else if($row['Tipo']=='set')
							{
								echo "<h2>".$row['Timestamp']."</h2>";
								echo '<h3> il turbidimetro '.$row['IdTurbidimetro'] . " invierà dati ogni " . (int)$row['intervallo'] . '  minuti </h3>';
								echo '<hr>';
							}
					}
				}catch (PDOException $e) {	
					echo "<option>Errore: " . $e->getMessage() . "</option>";
				} // poi da rimuovere
			}
				?>
			</div>
			<div id="allSettings">
				<div id="lateralAdd" class="lateral">Aggiungi Turbidimetro<img src="./img/add.png" alt="aggiungi turbidimetro"></div>
				<div id="lateralRm" class="lateral"> Rimuovi Turbidimetro<img src="./img/remove.png" alt="rimuovi turbidimetro"></div>
				<div id="lateralMd" class="lateral"> Modifica Turbidimetro<img src="./img/modify.png" alt="modifica turbidimetro"></div>
				<div id="lateralSe" class="lateral"> Settings<img src="./img/settings.png" alt="modifica turbidimetro"></div>
			</div>
			<div id="map"></div>
    <script
      src="Inserire chiave google API maps per visualizzare la mappa"
      defer
    ></script>
		</div>
		<div id="dataSubmissionDiv">
			<div id="firstSub">
			<label for="inizioIntervallo">Data di Inizio:</label> <br>
			<input type="date" id="inizioIntervallo" name="inizioIntervallo" value="<?php echo date('Y-m-d', strtotime('-1 week')); ?>"> <br>
			<label for="fineIntervallo">Data di Fine :</label> <br>
			<input type="date" id="fineIntervallo" name="fineIntervallo" value="<?php echo date('Y-m-d'); ?>"> <br>
			<label for="oraInizio">Ora di Inizio:</label> <br>
			<input type="time" id="oraInizio" name="oraInizio" value="00:00"> <br>
			<label for="oraFine">Ora di Fine :</label>  <br>
			<input type="time" id="oraFine" name="oraFine" value="23:59"> 	 <br>
		</div>
			<div id="thirdSub">
			<label for="turbidimetri" id="labt">Turbidimetro:</label> <br>
			<select id="turbidimetri" name="turbidimetri">
				<?php
				global $turbidimeterDataDb;
				if($turbidimeterDataDb->isOpen())
				{
					try
					{
						$res = getTurbidimeters();
						while ($row = $res->fetch()) {
							echo'<option value=' .$row['turbidimeterID'] . '>' .$row['turbidimeterID'] . '</option>';
						}
						
					}catch (PDOException $e) {
						
						echo "Errore: " . $e->getMessage();
					} // poi da rimuovere
				}else
				{
					$turbidimeterDataDb->openConnection();
					try
					{
					$result = getTurbidimeters(); 
					if ($result->rowCount() > 0) {
						while ($row = $result->fetch()) {
							echo'<option value=' .$row['turbidimeterID'] . '>' .$row['turbidimeterID'] . '</option>';
						}
					}
				}catch (PDOException $e) {	
					echo "<option>Errore: " . $e->getMessage() . "</option>";
				} // poi da rimuovere
			}
			?>
			</select>
			<button id="visualizzaDati">Visualizza</button>
			<button id="esportaCSV">Esporta CSV</button>
		<svg id="turbidityLineChartSvg" width="1300" height="900"></svg>
		<svg id="turbidityVoltageLineChartSvg" width="1300" height="900"></svg>
		</div>

		
		<div id="addDiv" class="formT">
		<div id="exitAdd" class="exit"><img src="./img/return.png" alt="esci"></div>
			<form id="turbidimeterForm">
				<h2>Aggiungi un Nuovo turbidimetro</h2>
				<label for="identificatore">id</label><br>
				<input type="text" id="identificatore" name="identificatore" ><br>
				<label for="latitudine">Latitudine:</label> <br>
    			<input type="text" id="latitudine" name="latitudine"><br>
    			<label for="longitudine">Longitudine:</label><br>
    			<input type="text" id="longitudine" name="longitudine" >
				<button type="submit" id="addbtn">Invia</button>
			</form>
			<div id="errorDiv1" class="error"></div>
		</div>
		<div id="rmDiv" class="formT">
		<div id="exitrm" class="exit"><img src="./img/return.png" alt="esci"></div>
			<form id="removeForm">
				<h2>Rimuovi un turbidimetro</h2>
				<label for="identificatorerm">id</label><br>
				<input type="text" id="identificatorerm" name="identificatorerm" ><br>
				<button id="remove">Rimuovi</button> <br>
				<div id="textrm">
				<div id="textrmin"></div>
				</div>
			</form>
			<div id="errorDiv2" class="error"></div>
		</div>
		<div id="mdDiv" class="formT">
		<div id="exitmd" class="exit"><img src="./img/return.png" alt="esci"></div>
			<form id="modifyForm" >
				<h2>modifica la posizione di un turbidimetro</h2>
				<label for="identificatoremd">id</label><br>
				<input type="text" id="identificatoremd" name="identificatoremd"><br>
				<label for="latitudine">Nuova latitudine:</label> <br>
    			<input type="text" id="latitudinemd" name="latitudinemd"><br>
    			<label for="longitudine">Nuova longitudine:</label><br>
    			<input type="text" id="longitudinemd" name="longitudinemd" >
				<button id="modify">Modifica</button> <br>
			</form>
			<div id="errorDiv3" class="error"></div>
		</div>
		<div id="seDiv" class="formT">
		<div id="exitse" class="exit"><img src="./img/return.png" alt="esci"></div>
			<form id="settingsForm">
				<h2>indica Id turbidimetro e periodo di attesa dati personalizzato</h2>
				<label for="identificatorese">id</label><br>
				<input type="text" id="identificatorese" name="identificatorese" ><br>
				<label for="setTime">tempo atteso per ricezione dati (in minuti)</label><br>
				<input type="text" id="setTime" name="setTime" ><br>
				<button id="set" type="submit">Imposta</button> <br>
			</form>
			<div id="errorDiv4" class="error"></div>
		</div>
		</div>
		<script src="./js/index.js"></script>
	</body>
	</html>
	
