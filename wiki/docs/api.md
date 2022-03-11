## Information regarding API's

- API is the acronym for **Application Programming Interface**, which is a software intermediary that allows two applications to talk to each other. 
- A document or standard that describes how to build or use such a connection or interface is called an API specification.
- In the following document we will be writing the information about the various API endpoints that will be using to support our Multi-tenant Architecture.

---

**1. Tenant Login**

Request Method:  `POST`  
API Endpoint:  `/api/login`

**Input:**  
1. Headers
    | Key          | Value            |
    |--------------|------------------|
    | Content-Type | application/json |

2. Request Body

    | Name                     | Description             | Type   |
    |--------------------------|-------------------------|--------|
    | tenantName<br>required   | Username of the tenant  | string |
    | password<br>required     | Password of that tenant | string |


**Output:**  Returns an access token
| Name        | Description  |
|-------------|--------------|
| access_token| access token |

---

**2. User Login**

Request Method:  `POST`  
API Endpoint:  `/api/login`

**Input:**  
1. Headers
    | Key          | Value            |
    |--------------|------------------|
    | Content-Type | application/json |

2. Request Body

    | Name                   | Description             | Type   |
    |------------------------|-------------------------|--------|
    | tenantName<br>required | Password of that tenant | string |
    | username<br>required   | Username of the tenant  | string |
    | password<br>required   | Password of that tenant | string |


**Output:**  Returns an access token
| Name        | Description  |
|-------------|--------------|
| access_token| access token |

---

**3. Admin Login**

Request Method:  `POST`  
API Endpoint:  `/api/login`

**Input:**  
1. Headers
    | Key          | Value            |
    |--------------|------------------|
    | Content-Type | application/json |
2. Request Body

    | Name                 | Description             | Type   |
    |----------------------|-------------------------|--------|
    | username<br>required | Username of the master  | string |
    | password<br>required | Password of that master | string |


**Output:**  Returns an access token
| Name        | Description  |
|-------------|--------------|
| access_token| access token |

---

**4. Logout**

Request Method:  `POST`  
API Endpoint:  `/api/logout`

**Input:**  
1. Headers
    | Key          | Value            |
    |--------------|------------------|
    | Content-Type | application/json |
2. Request Body

    | Name                     | Description             | Type   |
    |--------------------------|-------------------------|--------|
    | refreshToken<br>required | Refresh Token           | string |


**Output:**  The user is logged out & No content is returned with status code `204`

---

**5. Refresh Access Token**

Request Method:  `POST`  
API Endpoint:  `/api/refresh-access-token`

**Input:**  
1. Headers
    | Key          | Value            |
    |--------------|------------------|
    | Content-Type | application/json |
2. Request Body

    | Name                     | Description             | Type   |
    |--------------------------|-------------------------|--------|
    | refreshToken<br>required | Refresh Token           | string |


**Output:**  Returns an access token
| Name        | Description  |
|-------------|--------------|
| access_token| access token |

---

**6. API for Forgot Password**

Request Method: `GET` 

API Endpoint:  `/api/forgot-password`

**Input:**  
1. Headers
    | Key          | Value            |
    |--------------|------------------|
    | Content-Type | application/json |
2. Request Query
    | Name       | Type    |
    |------------|---------|
    | tenantName | string  |


**Output:** After hitting this API , the user will be redirected to keycloak UI.

---
## /api/tenant

**7. Tenant List**

Request Method:  `GET`  
API Endpoint:  `/api/tenant`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

**Output:** Produces `application/json` which contains the array of the following schema
| Name            | Description                        |
|-----------------|------------------------------------|
| id              | id of table row                    |
| tenantName      | name of tenant                     |
| email           | email of tenant                    |
| description     | description of tenant              |
| createdDateTime | time of creation of tenant         |
| isDeleted       | if the tenant is active or deleted |

**`Note`:** The output is paginated and is to be handled accordingly on the client side

---

**8. Tenant Details**

Request Method:  `GET`  
API Endpoint:  `/api/tenant/:id`

> `Note: `Only the admin can use this API

**Input:** 
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Path Parameters
    | Name           | Description            | Type   |
    |----------------|------------------------|--------|
    | id<br>required | id of the the tenant   | string |

**Output:** Produces `application/json` of the following schema
| Name            | Description                   |
|-----------------|-------------------------------|
| id              | id of table row               |
| tenantId        | unique tenant id              |
| tenantName      | name of tenant                |
| description     | description of tenant         |
| createdDateTime | time of creation of tenant    |
| tenantDbName    | db name provisioned to tenant |
| host            | host of db server             |
| port            | port of db server             |
| policy          | policies of tenant            |

---
**9. Create new Tenant**

Request Method:  `POST`  
API Endpoint:  `/api/tenant`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |


2. Request Body
    | Name                      | Description                                 | Type   |
    |---------------------------|---------------------------------------------|--------|
    | tenantName<br>required    | name of the new tenant                      | string |
    | email<br>required         | email of the tenant                         | string |
    | password<br>required      | password of the tenant                      | string |
    | description<br>required   | description of the tenant                   | string |
    | clientDetails<br>required | client details representing resource server | string |

**Output:** Produces `application/json` of the following schema
| Name     | Description                 |
|----------|-----------------------------|
| message  | success                     |
---
**10. Updating a Tenant**

Request Method:  `PATCH`  
API Endpoint: `/api/tenant`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |
2. Request Body
    | Name                              | Description                                       | Type   |
    |-----------------------------------|---------------------------------------------------|--------|
    | fields(to be updated)<br>required | key value pair of the configuration to be updated | string |

**Output:** Produces `application/json` of the following schema  

| Name        | Type   |
|-------------|--------|
| affected    | number |

The `affected` key value 1 means the updation is successfull otherwise it is 0  

---
**11. Deleting a Tenant**

Request Method: `DELETE`  
API Endpoint:  `/api/tenant`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |

2. Request Body
    | Name                              | Description                        | Type   |
    |-----------------------------------|------------------------------------|--------|
    | tenantName<br>required            | name of the tenant to be deleted   | string |

**Output:** Produces `application/json` of the following schema  

| Name        | Type   |
|-------------|--------|
| affected    | number |

The `affected` key value 1 means the updation is successfull otherwise it is 0  

---
## /api/tenant/config

**12. Tenant Configurations**

Request Method:  `GET`  
API Endpoint: `/api/tenant/config/:id`

**Input:** 
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Path Parameters
    | Name           | Description            | Type   |
    |----------------|------------------------|--------|
    | id<br>required | id of the the tenant   | string |

**Output:** Produces `application/json` of the following schema

| Name             | Description                   |
|------------------|-------------------------------|
| tenantId         | id of the tenant              |
| tenantName       | name of the tenant            |
| description      | description of tenant         |
| createdDatetime  | date and time of creation     |
| tenantDbName     | db name provisioned to tenant |
| host             | host of db server             |
| port             | port of database server       |
---
## /api/user

**13. Create New User**

Request Method:  `POST`  
API Endpoint: `/api/user`

> `Note: `Only the tenant admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |

2. Request Body
    | Name             | Description                                             | Type    |
    |------------------|---------------------------------------------------------|---------|
    | userName         | name of the new user                                    | string  |
    | password         | password to be set by user                              | string  |
    | email            | email of the new user                                   | string  |

**Output:** Produces `application/json` of the following schema  
| Name       | Description                 |
|------------|-----------------------------|
| message    | success                     |

---
**14. User List**

Request Method:  `GET`  
API Endpoint:  `/api/user`

> `Note: `Only the tenant admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

**Output:** Produces `application/json` which contains the array of the following schema
| Name            | Description                                  |
|-----------------|----------------------------------------------|
| id              | id of table row                              |
| createdDateTime | time of creation of user                     |
| userName        | name of user                                 |
| email           | email of user                                |
| access          | the resources which the user has access of   |
---

**15. User Configuration**

Request Method:  `GET`  
API Endpoint: `/api/user/:id`

**Input**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Path Parameters
    | Name                  | Description                        | Type   |
    |-----------------------|------------------------------------|--------|
    | id<br>required        | id of the the user                 | string |
    | tenantName<br>required| name of the tenant of the user     | string |

**Output:** Produces `application/json` of the following schema

| Name             | Description                                             | Type   |
|------------------|---------------------------------------------------------|--------| 
| userId           | id of new user                                          | string |  
| username         | username created by user                                | string |
| tenantName       | name of tenant under<br>which the user is to be created | string |
| createdDateTime  | date and time when the user is created                  | string |

---
**16. Updating a User**

Request Method:  `PATCH`  
API Endpoint: `/api/user`

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |

2. Request Body

    | Name                              | Description                                       | Type   |
    |-----------------------------------|---------------------------------------------------|--------|
    | fields(to be updated)<br>required | key value pair of the configuration to be updated | string |

**Output:** Produces `application/json` of the following schema  

| Name       | Description  |
|------------|--------------|
| message    | success      |


---

**17. Deleting a User**

Request Method: `DELETE`  
API Endpoint:  `/api/user`

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |

2. Request Body
    | Name                              | Description                        | Type   |
    |-----------------------------------|------------------------------------|--------|
    | userName<br>required              | name of the user to be deleted     | string |

**Output:** Produces `application/json` of the following schema  

| Name       | Description  |
|------------|--------------|
| message    | success      |


---
## Testing API's

**18. Test Tenant's connectivity with database**

Request Method: `GET`  
API Endpoint:  `/api/connect-database`

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
2. Request Query
    | Name                   | Description                                 | Type   |
    |------------------------|---------------------------------------------|--------|
    | host<br>required       | host of db server                           | string |
    | port<br>required       | port of db server                           | number |
    | tenantName<br>required | name of the tenant                          | string |
    | dbName<br>required     | name of the tenant's db                     | string |
    | password<br>required   | password of user with CRUD permission on db | string |

**Output:** Produces `application/json` of the following schema  

| Name        | Description    |
|-------------|----------------|
| message     | success        |

---

**19. Test Creation of Table in Tenant's Database**

Request Method: `POST`  
API Endpoint:  `/api/create-table`

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Body
    | Name                   | Description                        | Type      |
    |------------------------|------------------------------------|-----------|
    | dbName                 | Database Name                      | string    |
    | tableName              | Name of the table to be created    | string    |
    | columns                | Column names of table              | ColumnDto |
    
    Schema for Column DTO is as follows
     
    | Name                   | Description                        | Type      |
    |------------------------|------------------------------------|-----------|
    | columnName             | Name of the column                 | string    |
    | columnType             | Column Datatype                    | any       |

**Output:** Produces `application/json` of the following schema  

| Name        | Description    |
|-------------|----------------|
| message     | success        |

---
