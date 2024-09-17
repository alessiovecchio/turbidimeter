#! /bin/bash

mobile=$(awk -F'=' '/\[turbidimeter\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="mobile"{print $2}' ./config.ini)
wait=$(awk -F'=' '/\[turbidimeter\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="wait"{print $2}' ./config.ini)

echo "#------the turbidimeter turns on------#"  
echo "#--------Start of turbidimeter activities-------#"

echo "I take water turbidity measurements"
sudo nmcli radio wifi on
if test $mobile = "True"  
 then
  echo "mobile turdimeter"
  python3 sendATCommands.py at+cgps=1
  sleep $wait
  sudo  python3 main.py at+cgpsinfo
  python3 sendATCommands.py at+cgps=0
  echo "connection to the mobile network...."
  sudo ./connectLTE.sh
 else
  echo "Fixed turbidimeter"
  ./connectWIFI.sh
  sudo python3 main.py 
fi
rm voltage.txt
sleep 10
./sync.sh
echo "#--------End of turbidimeter activities-------#"
echo "#------the turbidimeter will soon shut down------#" 
