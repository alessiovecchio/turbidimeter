#!/bin/bash
#script per l'accensione e il collegamento al wifi
sudo nmcli radio wifi on 
 
x=1
while [ $x -le  24 ]
do
  if ping -q -c 1 -W 1 google.com > /dev/null;  
    then 
     break
  fi 
  x=$(( $x + 1 ))
  sleep 5
done

ifconfig
ping 8.8.8.8 -c 2
