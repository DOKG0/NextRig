# NextRig

## Instalacion de Node/npm - configuracion primer proyecto - comandos.

1 - instalar node y npm

	1.1 - sudo apt install nodejs npm

	1.2 - nodejs -v npm -v

2 - instalar Angular CLI globalmente para crear y gestionar proyectos desde la consola

	2.1 - sudo npm install -g @angular/cli

3 - Crear un proyecto con angular (creamos una carpeta donde va a estar nuestro proyeco) y luego dentro..

	3.1 - ng new frontend --skip-install
	3.2 - Would you like to enable autocompletion? (y/N): y
	3.3 - What stylesheet format would you like to use?: CSS o SCSS
	3.4 - Server-Side Rendering (SSR) y Static Site Generation (SSG)/Prerendering - NO
	3.5 - 

4 - arrancar el servidor de desarrollo

	4.1 - cd frontend
	4.2 - npm install	#instala las dependencias necesarias
	4.3 - ng serve		#inicia el servidor de angular

5 - El proyecto debería estar funcionando en http://localhost:4200

***

## Comandos Angular

### Crear proyecto y correrlo

- ng new nombreProyecto --skip-install -> Genera un nuevo proyecto
- ng serve -> corre la aplicación / ng serve -o -> corre la aplicación y abre el navegador

### Crear componentes

- ng generate component nombre / ng g c nombre -> crea un nuevo componente
- ng generate service nombre / ng s c nombre -> crea un nuevo servicio

- ng g c nombre --skip-test -> crea un componente sin el archivo ".spec.ts"
- ng g c nombre --inline-style -> crea un componente sin el archivo ".css"
- ng g c nombre --inline-template -> crea un componente sin el archivo ".html"

***

## Como hacer andar el proyecto?

1 - Descargar e instalar Xampp & configurar proyecto

	1.1 - dar permisos a la carpeta htdocs para evitar problemas 
	
**Comando:**
sudo chmod -R 775 /opt/lampp/htdocs
	
	1.2 - mover la carpeta backend a la carpeta htdocs

	1.3 - iniciar xampp

2 - Probar backend con postman

	Antes de probar el backend con postman se deberia registrar un usuario desde la pagina ya que esta hashea la contraseña y la guarda en la base de datos, por lo cual si se crea el usuario directo desde la BD no funcionara.

	Para probar funciones de admin, crear el usuario como esta mencionado anteriormente y el añadir el usuario que va a ser administrador a la tabla Administrador 

**comando:** INSERT INTO Administrador (ci) VALUES ('12345678');

	Rutas

	Login: http://localhost/Backend/api.php/usuario/login  POST
	Registro: http://localhost/Backend/api.php/usuario/registro POST
	AddP: http://localhost/Backend/api.php/admin/addProducto POST
	GetP: http://localhost/Backend/api.php/productos GET
	GetP x categoria: http://localhost/Backend/api.php/productos/cpu GET
	
***


### Documentacion de proyecto

Plataforma e-commerce enfocado en la venta de componentes de PC.

#### Tecnologias utilizadas

FrontEnd
* Angular
* Typscript
* CSS3
* HTML5
* Bootrap
* SweetAlert2
* AnimateCSS
* Boxicons

Backend
* PHP
* MYSQL
* PHPMailer
* Composer
* DomPDF
* RESTful API

#### Caracteristicas destacadas

Autenticacion y autorizacion
* Sistema de sesiones PHP con cookies seguras
* Autenticacion basada en roles (Usuario/Administrador)

Seguridad
* Contraseñas hasheadas
* Sanitizacion de datos

Funcionalidad del Sistema
* Crud Completo de productos para administradores
* Sistema de categorias dinamico (CPU, GPU, Motherboards, etc)
* Carrito de compras persistente por usuario
* Sistema de reseñas y calificaciones
* Historial de compras detallado
* Contacto por email con PHPMailer
* Impresion de PDF y envio luego de finalizar la compra con los detalles.
* Gestion de productos por Administrador

Arquitectura
* Separacion entre frontend y backend
* Servicios modulares en Angular
* API RESTful con manejo de errores
* Patron MVC en el backend PHP
* Componentes reutilizables en Angular

---

### Algunas imagenes del proyecto

#### Home
![home](https://github.com/user-attachments/assets/c1f799b0-1a87-4466-9490-4b3c648a7848)

#### Login
![login-page](https://github.com/user-attachments/assets/b7ec6196-11aa-4a0b-a513-f8560e684eb0)

#### Detalles de producto
![product-details-top](https://github.com/user-attachments/assets/eb98c139-ec89-4ff0-91cd-65e1b3bb2094)

#### Alta de producto
![form-alta-producto-filled-sin-marca](https://github.com/user-attachments/assets/c2afd879-b2f6-4ed4-a8ca-b78ef0036e48)

#### Reseñas
![reviews-de-usuario](https://github.com/user-attachments/assets/e46274e0-3bf2-4741-ab0b-042cceddec95)

---

## GITHUB


 ### Commits

* feat: Agregar nueva funcionalidad
* fix: Solucionar error o bug
* Delete: Eliminacion de archivo/codigo innecesario
* style: cambios de estilo

### Flujo de trabajo

1 - Clonar repositorio

	1.1 - Crear nueva rama desde main:
**comandos:** git checkout main<br>
**comandos:** git pull origin main // Trae los cambios mas recientes de main a tu repo local<br>
**comandos:** git checkout -b feature/nombre-tarea //Creas una rama para trabajar sobre ella y que no afecte a main

	1.2 - Push a la rama creada

**comando:** git push -u origin feature/nombre-tarea

---




