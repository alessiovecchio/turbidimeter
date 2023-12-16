<?php  
	
	require_once __DIR__ . "/../config.php";
    require DIR_UTIL . "dbConfig.php"; 
    $turbidimeterDataDb = new turbidimeterDataDbManager($host,$name,$Username,$Password);

	class turbidimeterDataDbManager {
    private $db;
	private $host;
	private $name;
	private $username;
	private $password;

	public function __construct($host, $dbname, $username, $password)
    {
		//echo $host . $dbname . $username.  $password;
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $this->db = new PDO($dsn, $username, $password, $options);
			$this->host = $host;
			$this->name=$dbname;
			$this->username=$username;
			$this->password=$password;
        } catch (PDOException $e) {
            throw new Exception("Connection failed: " . $e->getMessage());
        }
    }

	function isOpen() {
		try {
			// Ottieni lo stato della connessione usando l'attributo PDO::ATTR_CONNECTION_STATUS
            if($this->db == null)
                return false;
			$status = $this->db->getAttribute(PDO::ATTR_CONNECTION_STATUS);
	
			// Verifica se lo stato indica una connessione attiva
			return (bool) strpos($status, 'Connected') !== false;
		} catch (PDOException $e) {
			// Errore durante il recupero dello stato della connessione (ad esempio, la connessione è caduta)
			return false;
		}
	}
	function openConnection()
    {
        //echo $this->host . $this->name . $this->username.  $this->password;
        $dsn = "mysql:host={$this->host};dbname={$this->name};charset=utf8mb4";

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $this->db = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            throw new Exception("Connection failed: " . $e->getMessage());
        }
    }

	public function isOpened()
    {
        return $this->db != null;
    }

    public function getConnection() {

        if (!$this->isOpened()) {
            $this->openConnection();
        }

        return $this->db;
    }

    public function performQuery($queryText)
    {
        if (!$this->isOpened()) {
            $this->openConnection();
        }

        return $this->db->query($queryText);
    }

	function closeConnection() {
		$this->db = null;
	}

    function prepareToBind($queryText)
    {
        $res = $this->db->prepare($queryText);
        return $res;
    }

    function executeStmt($stmt)
    {
        return $stmt->execute();
    }
}

?>
