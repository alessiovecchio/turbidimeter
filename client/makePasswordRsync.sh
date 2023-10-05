#! /bin/bash
echo "please, enter your password for rsync, the password will not be shown:"

read -s password
echo $password | openssl enc -aes-256-cbc -md sha512 -a -pbkdf2 -iter 100000 -salt -pass pass:'secret password rsync' > secret_vault.txt
echo  "password saved"
