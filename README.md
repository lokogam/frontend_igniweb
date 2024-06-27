
# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

# Enlace al video:
[Video de guía](#)

## Backend

### Requerimientos
- Composer
- Docker

### Configuración del entorno

Antes de instalar las dependencias, duplica el archivo `.env.example` y nómbralo `.env`. Luego, agrega las siguientes variables de entorno en el archivo `.env`:

```env
SANCTUM_STATEFUL_DOMAINS=localhost:8000
SESSION_DOMAIN=localhost
```

### Pasos para la instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/lokogam/backend_igniweb.git
    cd backend_igniweb
    ```

2. Instala las dependencias:

    ```bash
    composer install
    ```

3. Levanta los contenedores Docker:

    ```bash
    ./vendor/bin/sail up -d
    ```

4. Accede al contenedor:

    ```bash
    docker exec -it backend_igniweb sh
    ```

5. Actualiza las dependencias de Composer:

    ```bash
    composer update
    ```

6. Realiza las migraciones y siembra de datos:

    ```bash
    php artisan migrate:fresh --seed
    ```

7. Accede a la aplicación en el navegador en:

    ```arduino
    http://localhost:80
    ```

### Comandos útiles

Crear modelos, controladores, migraciones, etc.:

```bash
php artisan make:model Reservation --all --api --requests --test
php artisan make:model Category -mcr --api
```

Ejecutar pruebas específicas:

```bash
php artisan test --filter '/(ReservationControllerTest::can_get_all_reservations|ReservationControllerTest::can_create_reservation|ReservationControllerTest::can_show_reservation|ReservationControllerTest::can_update_reservation|ReservationControllerTest::can_delete_reservation)/'
php artisan test --filter ReservationControllerTest::can_get_all_reservations
php artisan test --filter ReservationControllerTest::can_create_reservation
php artisan test --filter ReservationControllerTest::can_show_reservation
php artisan test --filter ReservationControllerTest::can_update_reservation
php artisan test --filter ReservationControllerTest::can_delete_reservation
```

## Frontend

### Requerimientos
- Docker

### Pasos para la instalación

1. Clona el repositorio:

    ```bash
    git clone https://github.com/lokogam/frontend_igniweb.git
    cd frontend_igniweb
    ```

2. Levanta los contenedores Docker:

    ```bash
    docker-compose up -d
    ```

3. Accede al contenedor:

    ```bash
    docker exec -it frontend_igniweb sh
    ```

4. Instala las dependencias de npm:

    ```bash
    npm install
    ```

5. Inicia el servidor de desarrollo:

    ```bash
    npm run dev
    ```
