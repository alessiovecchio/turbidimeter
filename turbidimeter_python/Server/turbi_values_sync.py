import os
from datetime import datetime
import configparser
import requests

# Ottieni la directory corrente dello script
script_dir = os.path.dirname(__file__)

# Percorso della cartella contenente i file (nella stessa directory dello script)
folder_path = os.path.join(script_dir, 'values')

# Variabile per tenere traccia del file più recente tra tutte le directory
latest_file_path = None
latest_modified_time = 0

# Scorrere ricorsivamente tutte le sottocartelle e i file
for root, dirs, files in os.walk(folder_path):
    for file in files:
        # Assicurati che sia un file di testo
        if file.endswith('.txt'):
            file_path = os.path.join(root, file)
            # Ottieni il tempo di modifica del file
            modified_time = os.path.getmtime(file_path)
            # Aggiorna il file più recente se necessario
            if modified_time > latest_modified_time:
                latest_file_path = file_path
                latest_modified_time = modified_time

# Se è stato trovato un file, procedi con l'elaborazione
if latest_file_path:
    # Leggi il file e organizza i dati nel dataset
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    config = configparser.ConfigParser()
    config.read('config.ini')
    turbidimeterID = config['turbidimeter']['turbidimeterID']
    print("turbidimeterID: ", turbidimeterID)

    # Ora leggi il file e organizza i dati nel dataset
    with open(latest_file_path, 'r') as file:
        # Leggi la prima riga
        lines = file.readlines()
        # Unisci tutte le righe in un'unica stringa
        content = ''.join(lines)
        # Dividi la riga in valori separati da spazio
        values = content.split()
        # Assegna i valori ai nomi delle variabili
        infraredOFF1, visibleOFF1, fullSpectrumOFF1, infraredON1, visibleON1, fullSpectrumON1, infraredOFF3, visibleOFF3, fullSpectrumOFF3, infraredON3, visibleON3, fullSpectrumON3 = values[:12]

    # Costruisci il dataset
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

    # Ora puoi inviare il dataset al server
    username = config['server']['username']
    password = config['server']['password']
    timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    

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
                response = s.post(url, data=data_set, verify=verify_cert)
                response.raise_for_status()
                print(response.text)
                print("Dati inviati al server con successo")  # Non è stata definita la variabile data_set
            except requests.exceptions.HTTPError as err:
                print(err)
        else:
            print("Errore nel login")
    except requests.exceptions.HTTPError as err:
        print(err)
