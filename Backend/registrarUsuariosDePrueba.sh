#si tienen los directorios distintos en opt/lampp/htdocs entonces cambiar esta variable, por ejemplo:
apiEndpoint="http://localhost/NextRig/Backend/api.php/usuario/registro"
#apiEndpoint="http://localhost/Backend/api.php/usuario/registro"


curl -X POST $apiEndpoint -H "Content-Type: application/json" -d '{"ci": "12341234","nombre": "TestUserName","apellido": "TestUserLastname","username": "TestUser","correo": "user@mail.com","password": "1234","fechaNac": "2000-04-26"}'
curl -X POST $apiEndpoint -H "Content-Type: application/json" -d '{"ci": "12121212","nombre": "Elvis","apellido": "Cocho","username": "elvis","correo": "elbizcocho@mail.com","password": "1234","fechaNac": "2000-04-26"}'
curl -X POST $apiEndpoint -H "Content-Type: application/json" -d '{"ci": "99999999","nombre": "John","apellido": "Salchichon","username": "pijagorda","correo": "john@mail.com","password": "1234","fechaNac": "2000-04-26"}'