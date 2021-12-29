#!/bin/sh

nx serve api &
PID=$!

while ! curl http://localhost:3333/api-json -o /dev/null -w '%{http_code}\n' -s; 
do 
echo waiting...;
sleep 1; 
done


yarn openapi-generator-cli generate  \
  -i http://localhost:3333/api-json \
  --generator-name typescript-axios \
  -o libs/data/src/lib/todo-data \
  --additional-properties=useSingleRequestParameter=true

kill $PID