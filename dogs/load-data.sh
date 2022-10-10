for f in *.json
do
  curl -X PUT -H "Content-Type: application/json" -d "@$f" api-rest-service-1:8080/dog
  echo " <- $f"
done
