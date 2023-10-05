#!/usr/bin/python3

import time
import sys
import os
import serial

from gpiozero import LED
import configparser
#from time import sleep

#importo la libreria?
print(os.path.realpath(__file__))
libdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'lib')
if os.path.exists(libdir):
    sys.path.append(libdir)
print(libdir)

import logging
from waveshare_TSL2591 import TSL2591

def send_command(command):
	rec_buffer = ''
	ser.write((command + "\r\n").encode())
	time.sleep(0.01)

	if ser.inWaiting():
		time.sleep(0.01)
		rec_buffer = ser.read(ser.inWaiting())
	if rec_buffer != '':
		print (rec_buffer.decode())
	return rec_buffer.decode()





logging.basicConfig(level=logging.INFO)

sensor1 = TSL2591.TSL2591(1)
sensor3 = TSL2591.TSL2591(3)
led = LED(25)

config = configparser.ConfigParser()
config.read('config.ini')

turbidimeterID = config['turbidimeter']['turbidimeterID']
dataReadInterval = int(config['turbidimeter']['dataReadInterval']) #intervallo di tempo tra i prelievi, significativo se il numero dei prelievi
#desiderati è superiore a 1
numberOfSampling = int(config['turbidimeter']['numberOfSampling']) #indica il numero di campioni che si desidera prelevare 
mobile = config["turbidimeter"]["mobile"] #indica se il turbidimetro è mobile (true) o fisso (false)
serverIpAddr = config['server']['ipAddr']

sampling = 0
position = " "

while sampling < numberOfSampling:
        
        led.off()
	
        sensor1.Lux
        sensor3.Lux	
        sensor1.TSL2591_SET_LuxInterrupt(50, 200)
        sensor3.TSL2591_SET_LuxInterrupt(50, 200)
		
        infraredOFF1 = sensor1.Read_Infrared
        infraredOFF3 = sensor3.Read_Infrared
        
        visibleOFF1 = sensor1.Read_Visible
        visibleOFF3 = sensor3.Read_Visible
        
        fullSpectrumOFF1 = sensor1.Read_FullSpectrum
        fullSpectrumOFF3 = sensor3.Read_FullSpectrum
		
        led.on()
        time.sleep(5)
	
        sensor1.Lux
        sensor3.Lux	
        sensor1.TSL2591_SET_LuxInterrupt(50, 200)
        sensor3.TSL2591_SET_LuxInterrupt(50, 200)
        
        infraredON1 = sensor1.Read_Infrared
        infraredON3 = sensor3.Read_Infrared
        
        visibleON1 = sensor1.Read_Visible
        visibleON3 = sensor3.Read_Visible
        
        fullSpectrumON1 = sensor1.Read_FullSpectrum
        fullSpectrumON3 = sensor3.Read_FullSpectrum

        if not os.path.exists("values"):
            os.makedirs("values")
        
        if not os.path.exists(os.path.join("values", turbidimeterID)):
            os.makedirs(os.path.join("values", turbidimeterID))

        current_date = time.strftime("%Y-%m-%d")
        if not os.path.exists(os.path.join(os.path.join("values", turbidimeterID), current_date)):
            os.makedirs(os.path.join(os.path.join("values", turbidimeterID), current_date))

        current_time = time.strftime("%H-%M-%S")
        filename = "values/" + turbidimeterID + "/" + current_date + "/" + "val" + current_time + ".txt"
        
        print('%d'%infraredON1)
        print('%d'%infraredON3)
        
        if mobile == "True":
                print("prelevo la posizione del dispositivo")
                if __name__=="__main__":
                
                        ser = serial.Serial("/dev/ttyUSB2", 115200)
                      
                        argument=sys.argv[1]
                

                        try:
                         
                                position = send_command(argument)
                          

                        except:
                                print("Request failed")
                                ser.close()
                                serial.Serial("/dev/ttyUSB2", 115200)
        else :
           print("turbidimetro fisso")
                        
        with open(filename, "w") as file:
            file.write(str(infraredOFF1) + ' ' + str(visibleOFF1) + ' ' + str(fullSpectrumOFF1) + ' ' + str(infraredON1) + ' ' + str(visibleON1) + ' ' + str(fullSpectrumON1) + '\n')
            file.write(str(infraredOFF3) + ' ' + str(visibleOFF3) + ' ' + str(fullSpectrumOFF3) + ' ' + str(infraredON3) + ' ' + str(visibleON3) + ' ' + str(fullSpectrumON3) + '\n')
            if mobile == "True": 
                div = position.split(":")
                if len(div) == 1:
                        print("posizione non prelevata, il gps non riesce a trovare la posizione\n") 
                else:        
                        info = div[1].split(",")
                        latitude = [float(info[0]), info[1]]
                        longitude = [float(info[2]), info[3]]
                        file.write("Posizione del turbidimetro: \n"
                        + "latitude: " + str(latitude[0]) + "," + str(latitude[1]) +  '\n' + 
                        "longitude:" + str(longitude[0]) + "," + str(longitude[1]) + '\n')
	
        sampling += 1	
        if numberOfSampling > 1: 	
                time.sleep(dataReadInterval)
			

sensor1.Disable()
sensor3.Disable()


        
