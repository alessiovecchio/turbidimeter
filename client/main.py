import time
import sys
import os
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

logging.basicConfig(level=logging.INFO)

sensor1 = TSL2591.TSL2591(1)
sensor3 = TSL2591.TSL2591(3)
led = LED(25)

config = configparser.ConfigParser()
config.read('config.ini')

turbidimeterID = config['turbidimeter']['turbidimeterID']
dataReadInterval = config['turbidimeter']['dataReadInterval']
serverIpAddr = config['server']['ipAddr']


try:
    while True:
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
        time.sleep(2)
	
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
		
        with open(filename, "w") as file:
            file.write(str(infraredOFF1) + ' ' + str(visibleOFF1) + ' ' + str(fullSpectrumOFF1) + ' ' + str(infraredON1) + ' ' + str(visibleON1) + ' ' + str(fullSpectrumON1) + '\n')
            file.write(str(infraredOFF3) + ' ' + str(visibleOFF3) + ' ' + str(fullSpectrumOFF3) + ' ' + str(infraredON3) + ' ' + str(visibleON3) + ' ' + str(fullSpectrumON3) + '\n')
            #file.write('LED 1: OFF=%d'%infraredOFF1 + ' ON=%d'%infraredON1 + '\n')
            #file.write('LED 3: OFF=' + str(infraredOFF3) + ' ON=' + str(infraredON3))
			
        time.sleep(int(dataReadInterval))
			
        
except KeyboardInterrupt:    
    logging.info("ctrl + c:")
    sensor1.Disable()
    sensor3.Disable()
    exit()
        
