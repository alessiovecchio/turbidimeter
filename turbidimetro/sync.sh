#! /bin/bash

turbidimeterID=$(awk -F'=' '/\[turbidimeter\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="turbidimeterID"{print $2}' ./config.ini)
password=$(cat secret_vault.txt | openssl enc -aes-256-cbc -md sha512 -a -d -pbkdf2 -iter 100000 -salt -pass pass:'secret password rsync')
user=$(awk -F'=' '/\[general\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="user"{print $2}' config.ini)
userServer=$(awk -F'=' '/\[server\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="userServer"{print $2}' config.ini)
ipAddr=$(awk -F'=' '/\[server\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="ipAddr"{print $2}' config.ini)
siteName=$(awk -F'=' '/\[server\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="siteName"{print $2}' config.ini)

echo "Id turbidimetro: $turbidimeterID"

sudo cp /home/$user/.ssh/known_hosts /root/.ssh
LC_ALL=C sshpass -p  $password rsync -avz  --delete --update --itemize-changes "/home/"$user"/Desktop/progetto/values/"$turbidimeterID  $userServer"@"$ipAddr":/opt/lampp/htdocs/"$siteName"/values/"
#LC_ALL=C -p  $password rsync -avz --delete --update --itemize-changes "/home/pi/Desktop/progetto/values/1"  "alessio@131.114.23.178:/opt/lampp/htdocs/turbidimeter/values/"
#LC_ALL=C rsync -avz --delete --update --itemize-changes --no-t "/home/pi/Desktop/progetto/values/1"  "alessio@131.114.23.178:/opt/lampp/htdocs/turbidimeter/values/"

	
	
