#! /bin/bash


# rsync -avz --delete "/home/gabriele/Desktop/progetto" "/media/gabriele/9016-4EF8"
#rsync -avz --delete /home/gabriele/Desktop/progetto gabri@172.28.63.19::backup/
turbidimeterID=$(awk -F'=' '/\[turbidimeter\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="turbidimeterID"{print $2}' ./config.ini)
dataToSendInterval=$(awk -F'=' '/\[server\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="dataSendInterval"{print $2}' ./config.ini)
echo "Id turbidimetro: $turbidimeterID"
echo "Intervallo dormiente: $dataToSendInterval"

while true
do
	#rsync -avz --delete --update --itemize-changes "/home/gabriele/Desktop/progetto" "/media/gabriele/9016-4EF8"
	rsync -avz --delete --update --itemize-changes "/home/gabriele/Desktop/progetto/values/"$turbidimeterID ubuntu@131.114.73.2:/opt/lampp/htdocs/turbidimetroValori/values
	#rsync -avz --delete --update --itemize-changes "/home/gabriele/Desktop/progetto" "/media/gabriele/9016-4EF8"
	sleep $dataToSendInterval
done	

