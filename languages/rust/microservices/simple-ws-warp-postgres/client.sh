#!/bin/bash

# Test health endpoint.
curl http://localhost:8000/health

# Test CREATE ToDo
curl -X POST 'http://localhost:8000/todo/' -H 'Content-Type: application/json' -d '{"name": "Done Todo"}'
# {"id":2,"name":"Done Todo","checked":false}

# Test LIST TODO
curl -X GET 'http://localhost:8000/todo/' -H 'Content-Type: application/json'
# [{"id":1,"name":"Done Todo","checked":false}]

# Test GET TODO
curl -X GET 'http://localhost:8000/todo/1' -H 'Content-Type: application/json'
# [{"id":1,"name":"Done Todo","checked":false}]

# Test UPDATE ToDo
curl -X PUT 'http://localhost:8000/todo/1' -H 'Content-Type: application/json' -d '{"name": "Done Todo", "checked": true}'
# {"id":2,"name":"Done Todo","checked":true}

# Test DELETE ToDo
curl -v -X DELETE 'http://localhost:8000/todo/2' -H 'Content-Type: application/json'
# HTTP/1.1 200 OK

# Test SEARCH ToDo
curl -X GET 'http://localhost:8000/todo/?search=Done%20Todo' -H 'Content-Type: application/json'
[{"id":2,"name":"Done Todo","checked":true}]


# Bad Requests ----------------------------------------------------------------

# Test CREATE BadRequest
curl -v -X POST 'http://localhost:8000/todo/' -H 'Content-Type: application/json' -d '{"wrong": "Some Todo"}'
# HTTP/1.1 400 Bad Request
# {"message":"Invalid Body"}

# Test UPDATE BadRequest
curl -X PUT 'http://localhost:8000/todo/2000' -H 'Content-Type: application/json' -d '{"name": "Done Todo", "checked": true}'
# {"message":"Could not Execute request"}

