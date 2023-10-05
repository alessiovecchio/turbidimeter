#! /bin/bash

turbidimeterID=$(awk -F'=' '/\[turbidimeter\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="turbidimeterID"{print $2}' ./config.ini)
dataToSendInterval=$(awk -F'=' '/\[server\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="dataSendInterval"{print $2}' ./config.ini)
password=$(cat secret_vault.txt | openssl enc -aes-256-cbc -md sha512 -a -d -pbkdf2 -iter 100000 -salt -pass pass:'secret password rsync')

echo "Id turbidimetro: $turbidimeterID"

sshpass -p  $password rsync -avz --delete --update --itemize-changes "/home/pi/Desktop/progetto/values/"$turbidimeterID ubuntu@131.114.73.2:/opt/lampp/htdocs/turbidimetroValori/values
	
	
