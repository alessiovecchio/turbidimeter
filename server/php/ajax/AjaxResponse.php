<?php  
	/*
		AjaxResponse is the class that will be sent back to the client at every Ajax request.
		The class is serialize according the Json format through the json_encode function, that 
		serialize ONLY the public property.
		
		It is possibile to serialize also protected and private property but it is out of the course scope.
	*/
	class AjaxResponse{
		public $responseCode; // 0 all ok - 1 some errors - -1 some warning
		public $message;
		public $data;
		
		public function __construct($responseCode = 1, 
								$message = "Somenthing went wrong! Please try later.",
								$data = null){
			$this->responseCode = $responseCode;
			$this->message = $message;
			$this->data = null;
		}
	
	}
	
	class SensorData{
		public $timestamp;
		public $sensor;
		public $infraredOFF;
		public $visibleOFF;
		public $fullSpectrumOFF;
		public $infraredON;
		public $visibleON;
		public $fullSpectrumON;

        public $voltage;
	
		public function __construct($timestamp = null, $sensor = null, $infraredOFF = null, $visibleOFF = null, $fullSpectrumOFF = null, $infraredON = null, $visibleON = null, $fullSpectrumON = null, $voltage = null){
			$this->timestamp = $timestamp;
			$this->sensor = $sensor;
			$this->infraredOFF = $infraredOFF;
			$this->visibleOFF = $visibleOFF;
			$this->fullSpectrumOFF = $fullSpectrumOFF;
			$this->infraredON = $infraredON;
			$this->visibleON = $visibleON;
			$this->fullSpectrumON = $fullSpectrumON;
            $this->voltage = $voltage;
		}
		
	}

?>