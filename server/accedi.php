<!DOCTYPE html>
<html lang="it">
<head>
    <title>Accesso Utente</title>
    <link rel="stylesheet" type="text/css" href="./css/login.css">
</head>
<body>
    <?php
    session_start();
    ?>
    <form id="loginForm" class="formL">
        <label class="formlabel" for="name">name</label>
        <input class="forminput" type="text" id="name" name="name" required><br>

        <label class="formlabel" for="password">Password:</label>
        <input class="forminput" type="password" id="password" name="password" required><br>

        <button class="formsubmit" type="button" id="loginBtn">Accedi</button>

        <h3><a href="./start.php">registrati!</a></h3>
    </form>
    <div class="formL" id="errorDiv"></div>
    <script src="./js/login.js"></script>
</body>
</html>
