# Chastilock Backend

This is a GraphQL API for the Chastilock App. This will be used for the App at first but will become publicly usuable, so locks can be updated by authorised bots etc 😃

## Running it in development environment (using Docker)
The easiest way to run it in a development environment is using docker compose. You will need to have Docker and Docker compose installed on your system. That way
you don't have to manually install a database (MySQL / MariaDB).

Before running it in docker for the first time, you will need to create the Chasilock network within docker by executing:
```bash
docker network create chastilock-network
```

To run it inside docker compose, simply execute (will run in background):
```bash
docker-compose up -d
```

To stop it, run the following command:
```bash
docker-compose down
```

### Running migrations (using Docker)
You will not be able to do anything if you run it the first time, because the database is not created. For that you need to run the migrations.
You can simply run them inside Docker using the following command (after you ran the `docker-compose up -d` command above):

```bash
docker exec chastilock-backend npx sequelize-cli db:migrate
```

You can read more about what migration commands and options are available here: https://sequelize.org/master/manual/migrations.html

### Connecting to the database (using Docker)
If you want to connect to the database directly, for example to modify it manually, connect using the following settings:
- Host: 127.0.0.1 (localhost)
- Port: 13306 (is configured in docker-compose.yml)
- User: root
- Password: mysql_root_password (is configured in docker-compose.yml)
