echo "Please, enter your password for rsync, the password will be shown:"

read -r $password
echo $password | openssl enc -aes-256-cbc -md sha512 -a -pbkdf2 -iter 100000 --salt -pass pass:'secret password rsync' > secret_vault.txt
echo  "Password saved"