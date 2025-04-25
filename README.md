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
