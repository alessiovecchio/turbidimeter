# turbidimeter
A low-cost, smart, and multi-configuration turbidimeter.
The turbidimeter is implemented using a raspberry pi zero plus some additional hardware that depends on the specific configuration. 

The mobile version is battery-operated and relies on a Witty Pi to turn on/off the Raspberry board, in order to save energy.
The mobile version can communicate with the Internet 
 - via wi-fi
 - using a cellular connection
When connecting via wi-fi, the turbidimeter can use an hotspot provided by a common smartphone.
When it is not connected to the Internet, the turbidimeter stores all recorded values on local storage. Stored values are transferred onto a remote repository as soon as it gets connected to the Internet.

The wired version of the turbidimeter is powered via PoE and uses the Ethernet connection for communicating with the remote repository. Again, values are stored locally and then synchronized with the remote repository. 

The server side allows to configure the turbidimeter in terms of on/off times also provides a simple visualization of stored values. 
