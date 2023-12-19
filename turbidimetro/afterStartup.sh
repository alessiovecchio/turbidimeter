[ -z $BASH ] && { exec bash "$0" "$@" || exit; }
#user=$(awk -F'=' '/\[general\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="user"{print $2}' ./Desktop/progetto/config.ini)
user=$(awk -F'=' '/\[general\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="user"{print $2}' config.ini)
#!/bin/bash

synchronize_with_network_time()
{
  if $(has_internet) ; then
    log '  Internet detected, apply network time to system and Witty Pi...'
    net_to_system
    system_to_rtc
  else
    log '  Internet not accessible, skip time synchronization.'
  fi
}


# include utilities scripts in same directory
dir=/home/$user/wittypi
. $dir/utilities.sh
. $dir/gpio-util.sh
echo $(get_input_voltage) > /home/$user/Desktop/progetto/voltage.txt
cd /home/$user/Desktop/progetto/
./startTurbi.sh 
echo $(synchronize_with_network_time)
sudo shutdown -h now
