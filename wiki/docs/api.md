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

2. Request Query
    | Name                   | Description                | Type    |
    |------------------------|----------------------------|---------|
    | tenantName<br>optional | name of the tenant(search) | string  |
    | isDeleted<br>optional  | tenant is deleted          | boolean |
    | page<br>optional       | page number                | number  |


**Output:** Produces `application/json` which contains the array of the following schema
| Name            | Description                        |
|-----------------|------------------------------------|
| id              | id of table row                    |
| tenantName      | name of tenant                     |
| email           | email of tenant                    |
| description     | description of tenant              |
| createdDateTime | time of creation of tenant         |
| isDeleted       | if the tenant is active or deleted |
| count           | total count                        |

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
API Endpoint:  `/api/tenant/{tenantName}`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Path Parameter
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
    | Name             | Description                                             | Type     |
    |------------------|---------------------------------------------------------|----------|
    | userName         | name of the new user                                    | string   |
    | password         | password to be set by user                              | string   |
    | email            | email of the new user                                   | string   |
    | roles            | roles to be assigned to new user                        | string[ ]|

**Output:** Produces `application/json` of the following schema  
| Name       | Description    |
|------------|----------------|
| message    | success        |

---
**14. User List**

Request Method:  `GET`  
API Endpoint:  `/api/user`

> `Note: `Only the admin & tenant admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Query
    | Name                   | Description              | Type   |
    |------------------------|--------------------------|--------|
    | tenantName<br>optional | name of the tenant       | string |
    | userName<br>optional   | name of the user(search) | string |
    | page<br>optional       | page number              | number |

**Output:** Produces `application/json` of the following schema
| Name      | Description                                  |
|-----------|----------------------------------------------|
| data      | array of users                               |
| count     | total number of users of that tenant         |

---
**15. User Info**

Request Method:  `GET`  
API Endpoint:  `/api/user-info`

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Query
    | Name                   | Description         | Type   |
    |------------------------|---------------------|--------|
    | tenantName<br>optional | name of the tenant  | string |
    | userName<br>optional   | name of the user    | string |

**Output:** Produces `application/json` of the following schema
| Name            | Description                                  |
|-----------------|----------------------------------------------|
| id              | id of table row                              |
| createdTimestamp| time of creation of user                     |
| userName        | name of user                                 |
| email           | email of user                                |
| roles           | roles assigned to user                       |
| permission      | permission granted to user                   |
---
**16. Updating a User**

Request Method:  `PATCH`  
API Endpoint: `/api/user`

> `Note: `Only the tenant admin & user can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |

2. Request Body

    | Name                  | Description                                       | Type   |
    |-----------------------|---------------------------------------------------|--------|
    | userName<br>optional  | name of the user                                  | string |
    | action<br>required    | key value pair of the configuration to be updated | string |

**Output:** Produces `application/json` of the following schema  

| Name       | Description  |
|------------|--------------|
| message    | success      |

---

**17. Deleting a User**

Request Method: `DELETE`  
API Endpoint:  `/api/user/{userName}`

> `Note: `Only the tenant admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Path Parameter
    | Name                              | Description                        | Type   |
    |-----------------------------------|------------------------------------|--------|
    | userName<br>required              | name of the user to be deleted     | string |

**Output:** Produces `application/json` of the following schema  

| Name       | Description  |
|------------|--------------|
| message    | success      |


---
## /api/roles

**18. Create New Role**

Request Method:  `POST`  
API Endpoint: `/api/roles`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |

2. Request Body
    | Name             | Description                                             | Type     |
    |------------------|---------------------------------------------------------|----------|
    | tenantName       | name of the tenant                                      | string   |
    | roleDetails      | role details like name, description                     | string   |

**Output:** Produces `application/json` of the following schema  
| Name       | Description    |
|------------|----------------|
| message    | success        |

---
**19. Available Realm Role**

Request Method:  `GET`  
API Endpoint:  `/api/roles`

> `Note: `Only the admin & tenant admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Query
    | Name                   | Description              | Type   |
    |------------------------|--------------------------|--------|
    | tenantName<br>optional | name of the tenant       | string |

**Output:** Produces `application/json` of the following schema
| Name      | Description                                  |
|-----------|----------------------------------------------|
| roles     | array of available roles                     |

---
**20. Role Info**

Request Method:  `GET`  
API Endpoint:  `/api/role-info`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Query
    | Name                   | Description         | Type   |
    |------------------------|---------------------|--------|
    | tenantName<br>required | name of the tenant  | string |
    | roleName<br>required   | name of the role    | string |

**Output:** Produces `application/json` of the following schema
| Name            | Description                                  |
|-----------------|----------------------------------------------|
| id              | role id                                      |
| roleName        | name of role                                 |
| description     | description of role                          |

---
**21. Update Realm Role**

Request Method:  `PATCH`  
API Endpoint: `/api/roles`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |

2. Request Body

    | Name                  | Description                                       | Type   |
    |-----------------------|---------------------------------------------------|--------|
    | tenantName<br>required| name of the tenant                                | string |
    | roleName<br>required  | name of the role                                  | string |
    | action<br>required    | key value pair of the configuration to be updated | string |

**Output:** Produces `application/json` of the following schema  

| Name       | Description  |
|------------|--------------|
| message    | success      |
---
**22. Delete Realm Role**

Request Method: `DELETE`  
API Endpoint:  `/api/roles/{tenantName}/{roleName}`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Path Parameter

    | Name                  | Description                                       | Type   |
    |-----------------------|---------------------------------------------------|--------|
    | tenantName<br>required| name of the tenant                                | string |
    | roleName<br>required  | name of the role to be deleted                    | string |


**Output:** Produces `application/json` of the following schema  

| Name       | Description  |
|------------|--------------|
| message    | success      |

---
## /api/permission

**23. Create New Permission**

Request Method:  `POST`  
API Endpoint: `/api/permission`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |

2. Request Body
    | Name             | Description                                             | Type     |
    |------------------|---------------------------------------------------------|----------|
    | tenantName       | name of the tenant                                      | string   |
    | clientName       | name of the client in keycloak                          | string   |
    | permissionType   | type of permission (resource-based or scope-based)      | string   |
    | permissionDetails| details of permission to be created                     | string   |

**Output:** Produces `application/json` of the following schema  
| Name       | Description    |
|------------|----------------|
| message    | success        |

---
**24. Get Client Permissions**

Request Method:  `GET`  
API Endpoint:  `/api/permission`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Query
    | Name                   | Description              | Type   |
    |------------------------|--------------------------|--------|
    | tenantName<br>optional | name of the tenant       | string |
    | clientName<br>required | name of the client       | string |

**Output:** Produces `application/json` of the following schema
| Name      | Description                                  |
|-----------|----------------------------------------------|
| permission| array of client permission with details      |

---
**25. Update Client Permission**

Request Method:  `PATCH`  
API Endpoint: `/api/permission`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |

2. Request Body

    | Name                       | Description                                       | Type   |
    |----------------------------|---------------------------------------------------|--------|
    | tenantName<br>required     | name of the tenant                                | string |
    | clientName<br>required     | name of the client                                | string |
    | permissionName<br>required | name of the permission                            | string |
    | permissionType<br>required | type of permission (resource-based or scope-based)| string |
    | action<br>required         | key value pair of the configuration to be updated | string |

**Output:** Produces `application/json` of the following schema  

| Name       | Description  |
|------------|--------------|
| message    | success      |
---
**26. Delete Client Permission**

Request Method: `DELETE`  
API Endpoint:  `/api/roles/{tenantName}/{clientName}/{permissionName}-{permissionType}`

> `Note: `Only the admin can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

2. Request Path Parameter

    | Name                       | Description                                       | Type   |
    |--------------------------- |---------------------------------------------------|--------|
    | tenantName<br>required     | name of the tenant                                | string |
    | clientName<br>required     | name of the client                                | string |
    | permissionName<br>required | name of the permission to be deleted              | string |
    | permissionType<br>required | type of permission (resource-based or scope-based)| string |


**Output:** Produces `application/json` of the following schema  

| Name       | Description  |
|------------|--------------|
| message    | success      |

---
## Testing API's

**27. Test Tenant's connectivity with database**

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

**28. Test Creation of Table in Tenant's Database**

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
