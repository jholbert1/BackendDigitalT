# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick --api-only
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

## Instalacion
Copiar el contenido del archivo .env.example y crear uno nuevo .env

agregar las variables de entorno necesarias.

Para el envio de correo se utilizo el servicio de gmail smtp se puede configurar las variable en el .env

URL_FRONT_APP => variable que se utiliza para la redireccion del correo para confirmar cuenta

ENCRYPT_KEY => variable que se utiliza para encriptar

Se utilizo Postgres como BD
