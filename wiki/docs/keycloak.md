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

Also make the following changes in the `.env` file.
```
KEYCLOAK_SERVER=http://keycloak:8080/auth
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=admin
```

Once the installation is complete in order to check whether keycloak is working or not hit the following request in your browser.

> REQUEST URL : http://localhost:8080

Once you hit the above request the following output should be shown:

![Selection_140](https://user-images.githubusercontent.com/87708447/152768300-45fe789c-a559-41ed-80d0-3546ca9f91e9.png)

## Usage
- In order to use the Keycloak functionality we are not using the User Interface.
- We will be using `keycloak-nodejs-admin-client`.
- Firstly we need to install it using the following command

```
$ npm install @keycloak/keycloak-admin-client
```

Whenever a new Tenant is registered at that time a new Realm is created with the help of Keycloak using the following code snippet.
```
await this.appService.createRealm(tenant);
Here `tenant` is the Tenant Details Body.
```
- This can be depicted in the form of following diagram:

![Selection_141](https://user-images.githubusercontent.com/87708447/152771271-b786490e-a247-4d44-96f5-a1f72286ef4b.png)


Once we login to the administrative console of the Keycloak UI we get to see all the Realms that have been created as below.

![Selection_143](https://user-images.githubusercontent.com/87708447/152772046-b20762c4-050c-455d-986b-de020f64d064.png)

- Master Realm is created during the 
- In order to see the contents of each Realm select any one of them and we will have the following output.
- The following screen shall be displayed.

![Selection_144](https://user-images.githubusercontent.com/87708447/152784691-e19a32d9-caf6-471f-b9e4-5f3bff8b30cc.png)
