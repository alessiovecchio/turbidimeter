function LineChartVoltageHandler(){}

LineChartVoltageHandler.DEFAUL_METHOD = "GET";
LineChartVoltageHandler.URL_REQUEST = "./php/ajax/lineChartVoltageInteraction.php";
// file php che gestisce le richieste Ajax di questo file .js
LineChartVoltageHandler.ASYNC_TYPE = true;

LineChartVoltageHandler.SUCCESS_RESPONSE = "0";
LineChartVoltageHandler.NO_DATA = "-1";

LineChartVoltageHandler.onNewInterval =
	function() {
		let queryString = "?turbidimeterId=" + document.getElementById("turbidimetri").value + "&beginningDate=" + document.getElementById("inizioIntervallo").value + "&endDate=" + document.getElementById("fineIntervallo").value + "&oraInizio=" + document.getElementById("oraInizio").value + "&oraFine="+ document.getElementById("oraFine").value;
		let url = LineChartVoltageHandler.URL_REQUEST + queryString;
		let responseFunction = LineChartVoltageHandler.onAjaxResponse;
		AjaxManager.performAjaxRequest(LineChartVoltageHandler.DEFAUL_METHOD,
										url, LineChartVoltageHandler.ASYNC_TYPE,
										null, responseFunction)
	}

LineChartVoltageHandler.onAjaxResponse =
	function(response){ //valore data parsato dalla onreadystatechange
		if (response.responseCode === LineChartVoltageHandler.NO_DATA){
			lineChartVoltageDashboard.showNoData();
			return;
		}
		
		if (response.responseCode === LineChartVoltageHandler.SUCCESS_RESPONSE){
			lineChartVoltageDashboard.showIntervalData(response.data);
		}
	}
