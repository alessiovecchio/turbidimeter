import os
from datetime import datetime
import configparser
import requests
import mysql.connector

db_config = {
    'unix_socket': '/opt/lampp/var/mysql/mysql.sock',
    'user': '', # user of the database
    'password': '', # password of the database
    'database': '', # name of the database
    'auth_plugin': 'caching_sha2_password'
}

#Creo un oggetto di tipo connection, che prende come argomento un dizionario
conn=mysql.connector.connect(**db_config)

#Creo un oggetto di tipo cursor, che mi permette di eseguire le query
cursor=conn.cursor()

# Ottieni la directory corrente dello script
script_dir = os.path.dirname(__file__)

# Percorso della cartella contenente i file (nella stessa directory dello script)
folder_path = os.path.join(script_dir, 'values')

# Variabile per tenere traccia del file più recente tra tutte le directory
latest_file_path = None


#query = "SELECT MAX(timestamp) FROM `data` WHERE turbidimeterID = 1;"
#query = "SELECT MAX(timestamp) FROM `data` WHERE turbidimeterID = %s;",(turbidimeterID)
#cursor.execute(query)
#result = cursor.fetchone()

#latest_modified_time = result[0].strftime("%Y-%m-%d %H:%M:%S")

# Scorrere ricorsivamente tutte le sottocartelle e i file
for root, dirs, files in os.walk(folder_path):
    for file in files:
        # Assicurati che sia un file di testo
        if file.endswith('.txt'):
            file_path = os.path.join(root, file)
            dir_name = os.path.dirname(file_path)
            turbidimeterFolder = os.path.dirname(dir_name)
            parent_dir = os.path.basename(dir_name)
            filename = os.path.basename(file_path)
            filename = filename.replace("-",":")
            timestamp = parent_dir + ' ' + filename[3:-4]
            # Ottieni il tempo di modifica del file
            #modified_time = os.path.getmtime(file_path)
            # Aggiorna il file più recente se necessario
            config = configparser.ConfigParser()
            config.read('config.ini')
            #turbidimeterID = config['turbidimeter']['turbidimeterID']
            turbidimeterID = os.path.basename(turbidimeterFolder)
            query = "SELECT MAX(timestamp) FROM `data` WHERE turbidimeterID = "+ turbidimeterID+";"
            cursor.execute(query)
            result = cursor.fetchone()
            if result[0]:
                latest_modified_time = result[0].strftime("%Y-%m-%d %H:%M:%S")
            else:
                latest_modified_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            if timestamp > latest_modified_time:
                
                # Leggi il file e organizza i dati nel dataset
                
                print("turbi id:",turbidimeterID)
                # Ora leggi il file e organizza i dati nel dataset
                data_set = {}
                with open(latest_file_path, 'r') as file:
                    print(latest_file_path)
                    # Leggi la prima riga
                    lines = file.readlines()
                    # Unisci tutte le righe in un'unica stringa
                    content = ''.join(lines)
                    # Dividi la riga in valori separati da spazio
                    values = content.split()
                    # Assegna i valori ai nomi delle variabili
                    channel0OFF1, channel1OFF1, channel0ON1, channel1ON1, channel0OFF3, channel1OFF3, channel0ON3, channel1ON3 = values[:8]

                # invio del dataset al server
                username = config['server']['username']
                password = config['server']['password']
                #timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                data_set = {
                    "turbidimeterID": turbidimeterID,
                    "timestamp": timestamp,
                    "infraredOFF1": channel0OFF1,
                    "infraredOFF3": channel0OFF3,
                    "visibleOFF1": channel1OFF1,
                    "visibleOFF3": channel1OFF3,
                    "fullSpectrumOFF1": -9999,
                    "fullSpectrumOFF3": -9999,
                    "infraredON1": channel0ON1,
                    "infraredON3": channel0ON3,
                    "visibleON1" : channel1ON1,
                    "visibleON3" : channel1ON3,
                    "fullSpectrumON1": -9999,
                    "fullSpectrumON3": -9999
                }

                URL="https://131.114.23.178:5001"
                url = f'{URL}/raspi_login'
                credentials = {'username': username, 'password': password}
                verify_cert = False  # Tolgo la verifica del certificato, da rimettere in caso di produzione
                
                try:
                    with requests.Session() as s:
                        response = s.post(url, data=credentials, verify=verify_cert)
                        response.raise_for_status()
                    if response.text == "Login effettuato":
                        url = f'{URL}/raspi_data'
                        print("LOGIN EFFETTUATO, invio dati al server")
                        try:
                            dati=data_set
                            response = s.post(url, data=dati, verify=verify_cert)
                            response.raise_for_status()
                            print(response.text)
                            print("Dati inviati al server con successo")  # Non è stata definita la variabile data_set
                        except requests.exceptions.HTTPError as err:
                            print(err)
                    else:
                        print("Errore nel login")
                except requests.exceptions.HTTPError as err:
                    print(err)
