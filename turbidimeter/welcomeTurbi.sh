#! /bin/bash
user=$(awk -F'=' '/\[general\]/{flag=1; next} /\[.*\]/{flag=0} flag && $1=="user"{print $2}' ./config.ini)


echo "#--------WELCOME TO TURBIDIMETER SYSTEM--------#" 
echo "Necessary library installation and information in progress"

cd /home/$user/Desktop/turbidimeter
sudo apt install sshpass
./makePasswordRsync.sh

cd /home/$user/

echo "Install wittypi library"
 wget https://www.uugear.com/repo/WittyPi4/install.sh
 sudo sh install.sh

echo "Install SIM7600_NDIS library"
 wget https://files.waveshare.com/upload/0/00/SIM7600_NDIS.7z
 sudo apt-get install p7zip-full -y
 7z x SIM7600_NDIS.7z   -r -o./SIM7600_NDIS
 cd SIM7600_NDIS
 sudo make clean
 sudo make

cd /home/$user/

echo "Install sensor library"
 wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.60.tar.gz
 tar zxvf bcm2835-1.60.tar.gz
 cd bcm2835-1.60/
 sudo ./configure
 sudo make
 sudo make check
 sudo make install

 cd /home/$user/
 
 sudo apt-get install udhcpc
 
 sudo apt-get install wiringpi
  #For Raspberry Pi 4B, an upgrade may be required:
  cd /tmp
  wget https://project-downloads.drogon.net/wiringpi-latest.deb
  sudo dpkg -i wiringpi-latest.deb



echo "Copy startup program in the wittypi AfterStartup script"
sudo cp /home/$user/Desktop/turbidimeter/afterStartup.sh /home/$user/wittypi/afterStartup.sh

echo "please, reboot the system"
sleep 5
echo "#--------END--------#"
