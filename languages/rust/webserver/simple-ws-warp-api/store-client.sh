#!/bin/bash

# CREATE
curl --location --request POST 'localhost:1337/v1/store' \
    --header 'Content-Type: application/json' \
    --header 'Content-Type: text/plain' \
    --data-raw '{
        "name": "key",
        "quantity": 3
    }'; echo

# READ
curl --location --request GET 'localhost:1337/v1/store' \
    --header 'Content-Type: application/json' \
    --header 'Content-Type: text/plain'; echo

# UPDATE
curl --location --request PUT 'localhost:1337/v1/store' \
--header 'Content-Type: application/json' \
--header 'Content-Type: text/plain' \
--data-raw '{
    "name": "key",
    "quantity": 5
}'; echo

# DELETE
curl --location --request DELETE 'localhost:1337/v1/store' \
--header 'Content-Type: application/json' \
--header 'Content-Type: text/plain' \
--data-raw '{
    "name": "key"
}'; echo

