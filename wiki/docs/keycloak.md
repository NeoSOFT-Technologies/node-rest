## Keycloak

Keycloak is an open source software product to allow single sign-on with Identity and Access Management aimed at modern applications and services.

## Installation
For installation we will be using docker so we need to pull the docker image. This is done using the docker-compose.yml file.
```
  keycloak:
    image: quay.io/keycloak/keycloak:16.1.0
    container_name: 'node_rest_keycloak'
    networks:
      - internal
    ports:
        - '8080:8080'
    environment:
        KEYCLOAK_USER: admin
        KEYCLOAK_PASSWORD: admin
```

**Parameters Explanation**
1. `image`: Keycloak image name.
2. `KEYCLOAK_USER`: Default username.
3. `KEYCLOAK_PASSWORD`: Default password.

Once the installation is complete in order to check whether keycloak is working or not hit the following request in your browser.

> REQUEST: http://localhost:8080

Once you hit the above request the following output should be shown: