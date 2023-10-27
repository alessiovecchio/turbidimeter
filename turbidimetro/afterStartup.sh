[ -z $BASH ] && { exec bash "$0" "$@" || exit; }
user=$(awk -F'=' '/\[general\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="user"{print $2}' ./Desktop/progetto/config.ini)
#user=$(awk -F'=' '/\[general\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="user"{print $2}' config.ini)
#!/bin/bash

# include utilities scripts in same directory
dir=/home/$user/wittypi
. $dir/utilities.sh
. $dir/gpio-util.sh
echo $(get_output_voltage) > /home/$user/Desktop/progetto/voltage.txt
cd /home/$user/Desktop/progetto/
sudo ./startTurbi.sh 
