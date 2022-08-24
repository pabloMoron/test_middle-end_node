# Acerca de mi 
[Perfil](https://github.com/pabloMoron/profile)

# Ejercicio práctico en Node + Express
Una API REST que busca y consulta descripción de artículos desde la API de MercadoLibre o devuelve datos mockeados según el token incluído en las requests.

Se utiliza un esquema de seguridad tipo API KEY con un header X-Auth-Token.

Sólo hay dos (2) tokens válidos que sirven para identificar el origen de los datos.

La documentación de las API también puede ser consultada desde la aplicación una vez levantado el proceso servidor. [Swagger](http://localhost:9000/api/swagger)

# Dependencias
El proyecto se ejecuta bajo el SO Windows 10

Node v14.18

Se puede instalar desde el sitio oficial de [node](https://nodejs.org/)

v14.18

# Ejecución
Abrir una terminal de comandos en el directorio del proyecto y ejecutar los siguientes comandos:

<pre>
npm install
npm start
</pre>

# Tests

Para ejecutar los test ejecutar el seguiente comando
<pre>
npm test
</pre>

El comando creará el directorio 'coverage' el informe de la cobertura de los tests