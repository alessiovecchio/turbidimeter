<!DOCTYPE html>
<html lang="it">
<head>
    <title>Form di Iscrizione</title>
    <link rel="stylesheet" type="text/css" href="./css/login.css">
</head>
<body>
    <?php
    $_SESSION['utente_registrato']=false;
    ?>
    <form id="registrationForm" class="formL">
        <label class="formlabel" for="name">Nome:</label>
        <input class="forminput" type="text" id="name" name="name" required><br>

        <label class="formlabel" for="password">Password:</label>
        <input class="forminput" type="password" id="password" name="password" required onchange="validatePassword()"><br>

        <button class="formsubmit" type="button" id="submitBtn">Iscriviti</button>
        <h3>gi&agrave; iscritto? <a href="./accedi.php">Accedi!</a></h3>
    </form>
    <script src="./js/registration.js"></script>
    <div class="formL" id="errorDiv"></div>
</body>
</html>
