#!/bin/bash
# description: Script PHP di avvio

case $1 in
  start)
    echo "Avvio dello script PHP"
    /opt/lampp/bin/php /opt/lampp/htdocs/turbidimetro/turbidimetersValuesSync.php
    ;;
  stop)
    echo "Arresto dello script PHP"
    # Comandi per arrestare lo script, se necessario
    ;;
  *)
    echo "Utilizzo: $0 {start|stop}"
    exit 1
    ;;
esac

exit 0
