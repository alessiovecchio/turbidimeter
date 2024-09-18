# Turbidimeter
A low-cost, smart, and multi-configuration turbidimeter.
The turbidimeter is implemented using a raspberry pi zero plus some additional hardware that depends on the specific configuration. 

The mobile version is battery-operated and relies on a Witty Pi to turn on/off the Raspberry board, in order to save energy.
The mobile version can communicate with the Internet 
 - via Wi-Fi
 - using a cellular connection

When connecting via Wi-Fi, the turbidimeter can use an hotspot provided by a common smartphone.
When it is not connected to the Internet, the turbidimeter stores all recorded values on local storage. 
Stored values are transferred onto a remote repository as soon as it gets connected to the Internet.

The wired version of the turbidimeter is powered via PoE and uses the Ethernet connection for communicating with the remote repository. 
Again, values are stored locally and then synchronized with the remote repository. 

The server side allows to configure the turbidimeter in terms of on/off times also provides a simple visualization of stored values. 

## Content Description

The directory turbidimeter contains the code that will be deployed on the Raspberry board.

The directory Server contains the elements required to start the server to collect the data from the different sensors.

## Raspberry installation instructions

These steps should be performed after buying and mounting the Raspberry Pi Zero WH with the Witty Pi 4 L3V7, the photodetectors and the LED emitter. For a schema of the Pins' connection you can refer to the paper "".

* 1 Install the Raspbian OS on the microSD to be deployed on the board.
  - The default user for Raspberry Pi OS is "pi".
* 2 Download the turbidimeter directory on the Desktop of the user pi of the Raspberry device. 
* 3 Launch the welcomeTurbi.sh script to automatically download the required libraries for managing the Witty Pi board, just follow the instructions onto the screen.
  - When prompted, insert the password used to login on the remote server. It will be encrypted and stored on the board.
* 4 Change the config.ini file adding data related to your system:
  - Set the turbidimeter ID, which is a unique integer number that identifies the specific device.
  - Set the ipAddr with the IP address of your server installation.
  - Set userServer with the name of your user on the server; it will be used by turbidimeters to upload results onto the server.
* 5 Set the initial WittyPi schedule, changing the file /home/pi/wittypi/schedule.wpi
  - The syntax of this file is shown in the referenced paper. More details are available on the [manual of wittypi](https://cdn-shop.adafruit.com/product-files/5705/WittyPi4L3V7_UserManual.pdf)  

## Example of config.ini
The following part shows an example of the file config.ini, where the turbidimeter ID is 1, the server IP is 192.168.237.25 and the name of the user on the server is Maurizio. The turbidimeter performs 5 samplings every time the device turns on ( because numberOfSampling = 5), with an interval of 1 second between each sampling (because dataReadUnterval=1). The wait parameter is only significant when mobile is True and represents the time (in seconds) waited to acquire the location. Laboratory tests suggest that roughly 60 seconds are usually required but different locations can require different values.

[general]

user=pi

[turbidimeter]

turbidimeterID=1

dataReadInterval=1

numberOfSampling=5

mobile=False

wait=60

[server]

ipAddr= 192.168.237.25 

userServer= Maurizio

siteName = turbidimeter_python


## Further help
  In case of errors you can write to maurizio.palmieriATunipi.it for help.
