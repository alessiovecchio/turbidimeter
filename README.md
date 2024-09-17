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

## Content Description

The directory turbidimeter contains the code that will be deployed on the Raspberry board.

The directory Server contains the elements required to start the server to collect the data from the different sensors.

## Raspberry installation instruction

These steps should be performed after buying and mounting the Raspberry Pi Zero WH with the Witty Pi board, the photodetectors and the LED emitter. For a schema of the Pin connection you can refer to the paper "".

* 1 Install the Raspbian OS on the micro Sim deployed on the board.
  - The default user for the Raspberry Pi is "pi".
* 2 Download the turbidimeter folder on the Desktop of the user. 
* 3 Launch the welcomeTurbi.sh script to automatically download the required libraries for managing the Witty Pi board, following the instructions provided on screen.
* 4 Change the config.ini file adding data related to your system:
  - Set the turbidimeterID with a number that identifies your turbidimeter.
  - Set the ipAddr with the Ip of your server.
  - Set userServer with the name of your user on the server.
