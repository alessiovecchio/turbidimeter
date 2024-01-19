import schedule
import time
from datetime import datetime
import subprocess

def main_program():
    # Esegui il programma main.py per le misurazioni e l'invio al database
    subprocess.run(["python3", "main.py"])

def schedule_jobs():
    # Pianifica l'esecuzione di schedule.py 8 volte al giorno
    for _ in range(8):
        schedule.every().day.at("00:00").do(main_program)
        schedule.every().day.at("03:00").do(main_program)
        schedule.every().day.at("06:00").do(main_program)
        schedule.every().day.at("09:00").do(main_program)
        schedule.every().day.at("12:00").do(main_program)
        schedule.every().day.at("15:00").do(main_program)
        schedule.every().day.at("18:00").do(main_program)
        schedule.every().day.at("21:00").do(main_program)

        # Pianifica l'esecuzione di main_program ogni 15 minuti nell'ora in cui è stato schedulato schedule.py
        for i in range(4):
            schedule.every().hour.at(f"{i * 15:02}:00").do(main_program)

# Avvia la pianificazione
schedule_jobs()

# Loop per mantenere lo script in esecuzione
while True:
    schedule.run_pending()
    time.sleep(1)