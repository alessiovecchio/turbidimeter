from gpiozero import LED
import requests
import time
from datetime import datetime
import json
import os
from flask import session
from requests.exceptions import RequestException
from waveshare_TSL2591 import TSL2591


URL="https://131.114.23.178:5001"

# Leggi la configurazione da config.json
with open('conf.json', 'r') as config_file:
    config = json.load(config_file)

# Estrai le informazioni dalla configurazione
turbidimeter_config = config['Turbidimeter']
server_config = config['Server']

turbidimeterID = turbidimeter_config['turbidimeterID']
dataReadInterval = int(turbidimeter_config['dataReadInterval'])
numberOfSampling = int(turbidimeter_config['numberOfSampling'])
mobile = turbidimeter_config['mobile']
serverIpAddr = server_config['ipAddr']
password = server_config['passwordServer']
username = server_config['username']

# Inizializza i sensori e il LED
sensor1 = TSL2591.TSL2591(0)
sensor3 = TSL2591.TSL2591(3)
led = LED(25)

#inizio dei campionamenti
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

timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")

data_set = {
        "turbidimeterID": turbidimeterID,
        "timestamp": timestamp,
        "infraredOFF1": infraredOFF1,
        "infraredOFF3": infraredOFF3,
        "visibleOFF1": visibleOFF1,
        "visibleOFF3": visibleOFF3,
        "fullSpectrumOFF1": fullSpectrumOFF1,
        "fullSpectrumOFF3": fullSpectrumOFF3,
        "infraredON1": infraredON1,
        "infraredON3": infraredON3,
        "visibleON1" : visibleON1,
        "visibleON3" : visibleON3,
        "fullSpectrumON1": fullSpectrumON1,
        "fullSpectrumON3": fullSpectrumON3
     }

if mobile==False:
     
    #url = https://127.0.0.1:5000/raspi_login uso https in produzione

    url = f'{URL}/raspi_login'
    credenziali = {'username': username, 'password': password}
    #tolgo la verifica del certificato, da rimettere in caso di produzione
    verify_cert=False
    try:
        with requests.Session() as s:
            response = s.post(url, data=credenziali,verify=verify_cert) #,verify=verify_cert 
            response.raise_for_status()
            if response.text == "Login effettuato":

                #url = https://127.0.0.1:5000/raspi_data uso https in produzione

                url =  f'{URL}/raspi_data'
                print("LOGIN EFFETTUATO, invio dati al server")
                #tolgo la verifica del certificato, da rimettere in caso di produzione
                #verify_cert=False
                try:
                    response = s.post(url, data=data_set,verify=verify_cert)#,verify=verify_cert 
                    response.raise_for_status()
                    print(response.text)
                except requests.exceptions.HTTPError as err:
                    print(err)
            else:
                print("Errore nel login ")
    except requests.exceptions.HTTPError as err:
        print(err)    
else:
    print("Mobile")    
