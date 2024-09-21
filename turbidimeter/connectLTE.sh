#!/bin/bash

qmi_loaded=$(lsmod | grep "qmi_wwan" | grep "cdc_wdm" | wc -l)
simcom_loaded=$(lsmod |grep "simcom_wwan" | wc -l)

if [ ${qmi_loaded} -eq 1 ];then
	echo "rmmod qmi_wwan"
	rmmod qmi_wwan
fi
if [ ${simcom_loaded} -eq 0 ];then
	echo "installing simcom driver"
	insmod /home/pi/SIM7600_NDIS/simcom_wwan.ko
fi

ifconfig eth0 down
ifconfig wlan0 down
ifconfig wwan0 up

addr=$(ifconfig wwan0 | grep "inet 10." | wc -l)
if [ ${addr} -eq 0 ]; then
	echo "connecting..."
	python3 sendATCommands.py AT\$QCRMCALL=1,1

	udhcpc -i wwan0
	sleep 2
fi
ifconfig
ping 8.8.8.8 -c 2
