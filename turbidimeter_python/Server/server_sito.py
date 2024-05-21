from flask import Flask, render_template, session, request, redirect, url_for,jsonify,send_from_directory
from datetime import datetime 
import mysql.connector
import json
import mysql
import os
import hashlib
#creo un'istanza di Flask
app= Flask(__name__)

#definisco una chiave segreta per la sessione
app.secret_key="root1234"

#Creo un dizionario che contiene i parametri per la connessione al database
db_config = {
    'unix_socket': '/opt/lampp/var/mysql/mysql.sock',
    'user': 'root',
    'password': 'root1234', #password del database
    'database': 'turbidimeterdb',
    'auth_plugin': 'caching_sha2_password'
}

#Creo un oggetto di tipo connection, che prende come argomento un dizionario
conn=mysql.connector.connect(**db_config)

#Creo un oggetto di tipo cursor, che mi permette di eseguire le query
cursor=conn.cursor()

#definisco un decoratore, che prende come argomento una stringa
@app.route("/")
#funzione view che restituisce una stringa, Nome molto importante perchè andrà a definire la rotta
#(URL) del sito
def home():
   if 'username' in session:
        return render_template('home.html', username=session['username'])
   else:
        return render_template('home.html')


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hash_object = hashlib.sha3_256()
        hash_object.update(password.encode('utf-8'))
        hash = hash_object.hexdigest()
        cursor.execute("SELECT name,password FROM users WHERE name = %s AND password = %s", (username, hash))
        account = cursor.fetchone()
        if account:
            session['username'] = account[0]
            return redirect(url_for('index'))
        else:
            return render_template('login.html' ,error='Incorrect username/password')
    else:
        return render_template('login.html')


@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hash_object = hashlib.sha3_256()
        hash_object.update(password.encode('utf-8'))
        hash = hash_object.hexdigest()
        print(hash)
        cursor.execute("insert into users (name,password) values (%s,%s)", (username, hash))
        conn.commit()
        print(f"Utente {username} inserito correttamente")
        session['username'] = username
        return redirect(url_for('index'))
    else:
        return render_template('register.html')


@app.route("/logout")
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))
            

#Rotta per la pagina principale
@app.route("/index") 
def index():
    if 'username' in session:
        os.system('python3 turbi_values_sync.py')
        return render_template('index.html', username=session['username'])
    else:
        return redirect(url_for('home'))

    #Per vedere le modifiche al codice, bisogna riavviare il server. 
    #se voglio evitarlo devo settare la variabile d'ambiente FLASK_ENV=development

#Rotta per la pagina di aggiunta dei turbidimetri
@app.route('/aggiungi_turbi', methods=['POST'])
def aggiungi_turbi():
    if 'username' in session and request.method == 'POST':
        latitudine = float(request.form['Latitudine'])
        longitudine = float(request.form['Longitudine'])
        stima_trasmissione= float(30)
        timestamp = datetime.now()
        status=0
        cursor.execute("insert into turbidimeters (turbidimeterID,latitudine,longitudine,stimaTrasmissione,ultimoDato,status) values (NULL,%s,%s,%s,%s,%s)", (latitudine, longitudine,stima_trasmissione,timestamp,status))
        conn.commit()
        return "Turbidimetro inserito correttamente"

#Rotta per la pagina di rimozione dei turbidimetri
@app.route('/rimuovi_turbi', methods=['POST'])
def rimuovi_turbi():
    if 'username' in session:
        id=request.form['id']
        # Esegui la query per rimuovere il record
        query = "DELETE FROM turbidimeters WHERE turbidimeterID = %s"
        cursor.execute(query, (id,))
        conn.commit()
        return "Turbidimetro rimosso correttamente"


#Rotta per la visualizzazione dei turbidimetri nella mappa
@app.route('/turbidimetri',methods=['GET'])
def turbidimetri():
    if 'username' in session:
        # Esegui la query per ottenere i dati dei turbidimetri
        query = "SELECT turbidimeterID, latitudine, longitudine FROM turbidimeters"
        cursor.execute(query)
        result = cursor.fetchall()
        result=[{'id':id, 'latitudine':float(lat), 'longitudine':float(long)}for id,lat,long in result]
        # Ritorna i dati in formato JSON, se questi sono presenti
        if result:
            return json.dumps(result)
        else:
            return "Nessun dato presente"

#Rotta per la pagina di visualizzazione dei dati
@app.route('/dati')
def dati():
    if 'username' in session:
        return render_template('dati.html', username=session['username'])
    else:
        return redirect(url_for('home'))
        


@app.route('/get_data', methods=['POST'])
def get_data():
    if 'username' in session:
       id=request.form['turbi_id']
       data_inizio=request.form['data_inizio']
       data_fine=request.form['data_fine']
       cursor.execute("SELECT timestamp, sensor, infraredOFF, visibleOFF, fullSpectrumOFF, infraredON, visibleON, fullSpectrumON FROM data WHERE turbidimeterID = %s AND timestamp BETWEEN %s AND %s", (id, data_inizio, data_fine))
       result = cursor.fetchall()
       if result:
            # Calcola la media tra gli attributi di ciascun record
            averaged_result = []
            for record in result:
                timestamp = record[0]  # Assume che il timestamp sia la prima colonna
                sensor = record[1]
                values = record[2:]
                average = sum(values) / (100*len(values))

                # Conversione il timestamp in stringa prima di aggiungerlo all'oggetto JSON
                timestamp_str = timestamp.strftime("%Y-%m-%d %H:%M:%S")

                averaged_result.append({
                    'timestamp': timestamp_str,
                    'sensor': sensor,
                    'average': average,
                    'infraredOFF': values[0],
                    'visibleOFF': values[1],
                    'fullSpectrumOFF': values[2],
                    'infraredON': values[3],
                    'visibleON': values[4],
                    'fullSpectrumON': values[5]
                })

            return jsonify(averaged_result)
       else:
            return "Nessun dato presente"
    else:
        return redirect(url_for('home'))

#Rotte per il dispositivo mobile
@app.route('/values', methods=['GET'])
def values():
    if 'username' in session:
        # Lista per memorizzare tutti i file trovati
        all_files = []

       #mostra le directory presenti nella cartella values, senza costruire tutto il percorso
        for directory in os.listdir('values'):
            all_files.append(directory)
            all_files.sort()
       
        # Passa la lista dei file al template HTML
        return render_template('values.html', files=all_files, username=session['username'])
    else:
        return render_template('home.html')


@app.route('/Server/values/<path:directory_name>', methods=['GET'])
def get_file_or_directory(directory_name):
    if 'username' in session:
        full_path = os.path.join('values', directory_name)
        all_items = []
        
        if os.path.isdir(full_path):
            for item in os.listdir(full_path):
                all_items.append(item)
                all_items.sort()
            return render_template('content_dir.html', items=all_items, username=session['username'], current_path=directory_name)
        else:
            with open(full_path, 'r', encoding='utf-8') as file:
                    file_cont = file.read()
                    return render_template('content_file.html',username=session['username'],file_content=file_cont)    
    else:
        return render_template('home.html')

 

#Rotta per la pagina di modifica dei turbidimetri
@app.route('/modifica_turbi', methods=['POST'])
def modifica_turbi():
    if 'username' in session:
        id=request.form['turbi_id']
        latitudine = float(request.form['Latitudine_M'])
        longitudine = float(request.form['Longitudine_M'])
        stima_trasmissione= float(30)
        timestamp = datetime.now()
        status=0
        cursor.execute("UPDATE turbidimeters SET latitudine = %s, longitudine = %s, stimaTrasmissione = %s, ultimoDato = %s, status = %s WHERE turbidimeterID = %s", (latitudine, longitudine,stima_trasmissione,timestamp,status,id))
        conn.commit()
        return "Turbidimetro modificato correttamente"
    else:
        return redirect(url_for('home'))


#Rotta per la pagina di modifica dei dati
@app.route('/raspi_login', methods=['POST'])
def raspi_login():
    username = request.form['username']
    password = request.form['password']

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hash_object = hashlib.sha3_256()
        hash_object.update(password.encode('utf-8'))
        hash = hash_object.hexdigest()
        cursor.execute("SELECT name,password FROM users WHERE name = %s AND password = %s", (username, hash))
        account = cursor.fetchone()

        if account:
            session['raspi_logged_in'] = True
            print("Session:",session)
            return "Login effettuato"
        else:
            return "Errore nel login"

#rotta per la pagina di inserimento dei dati appena campionati
@app.route('/raspi_data', methods=['POST'])
def raspi_data():
    if 'raspi_logged_in' in session and session['raspi_logged_in']==True:
        # Prendi i dati dal form
        turbidimeterID = request.form['turbidimeterID']
        timestamp = request.form['timestamp']

        infraredOFF1 = request.form['infraredOFF1']
        visibleOFF1 = request.form['visibleOFF1']
        fullSpectrumOFF1 = request.form['fullSpectrumOFF1']
        infraredON1 = request.form['infraredON1']
        visibleON1 = request.form['visibleON1']
        fullSpectrumON1 = request.form['fullSpectrumON1']

        infraredOFF3 = request.form['infraredOFF3']
        visibleOFF3 = request.form['visibleOFF3']
        fullSpectrumOFF3 = request.form['fullSpectrumOFF3']
        infraredON3 = request.form['infraredON3']
        visibleON3 = request.form['visibleON3']
        fullSpectrumON3 = request.form['fullSpectrumON3']

        
        #Inserisci i dati nel database
        cursor.execute("INSERT INTO data (turbidimeterID, timestamp, sensor, infraredOFF, visibleOFF, fullSpectrumOFF, infraredON, visibleON, fullSpectrumON) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (turbidimeterID, timestamp, 1, infraredOFF1, visibleOFF1, fullSpectrumOFF1, infraredON1, visibleON1, fullSpectrumON1))
        conn.commit()
        print("Dati relativi al sensore 1 inseriti correttamente")

        cursor.execute("INSERT INTO data (turbidimeterID, timestamp, sensor, infraredOFF, visibleOFF, fullSpectrumOFF, infraredON, visibleON, fullSpectrumON) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (turbidimeterID, timestamp, 3, infraredOFF3, visibleOFF3, fullSpectrumOFF3, infraredON3, visibleON3, fullSpectrumON3))
        conn.commit()
        print("Dati relativi al sensore 3 inseriti correttamente")
        return "Dati relativi ai sensori inseriti correttamente" 
    else:
        #ritorna status http errore 401
        return "Errore nel login",401

if __name__ == "__main__":
    print("Running as main script.")
    app.run(debug=False, ssl_context=('server.crt', 'server.key'))


    
