function AjaxManager(){} //File in cui vengono generate le richieste Ajax

AjaxManager.getAjaxObject = 
	function(){
		let xmlHttp = null;
		try { 
			xmlHttp = new XMLHttpRequest(); 
		} catch (e) {
			try { 
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP"); //IE (recent versions)
			} catch (e) {
				try { 
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); //IE (older versions)
				} catch (e) {
					xmlHttp = null; 
				}
			}
		}
		return xmlHttp;
	}

AjaxManager.performAjaxRequest = 
	function(method, url, isAsync, dataToSend, responseFunction){
		let xmlHttp = AjaxManager.getAjaxObject();
		if (xmlHttp === null){
			window.alert("Your browser does not support AJAX!"); // set error function
			return;
		}
	
		xmlHttp.open(method, url, isAsync); 
		xmlHttp.onreadystatechange = function (){
			if (xmlHttp.readyState == XMLHttpRequest.DONE){
				
				let data = JSON.parse(xmlHttp.responseText);
				responseFunction(data);
			}
		}
		xmlHttp.send(dataToSend);
}		