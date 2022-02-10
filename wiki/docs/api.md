## Information regarding API's

- API is the acronym for ***Application Programming Interface**, which is a software intermediary that allows two applications to talk to each other. 
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

    | Name                 | Description             | Type   |
    |----------------------|-------------------------|--------|
    | username<br>required | Username of the tenant  | string |
    | password<br>required | Password of that tenant | string |

3. Request Query
    | Name   | Description                                          | Type    |
    |--------|------------------------------------------------------|---------|
    | master | If request is for master login<br>false in this case | boolean |

**Output:**  Returns an access token
| Name        | Description  |
|-------------|--------------|
| access_token| access token |

---

**2. Master Login**

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

3. Request Query
    | Name   | Description                                          | Type    |
    |--------|------------------------------------------------------|---------|
    | master | If request is for master login<br>true in this case  | boolean |

**Output:**  Returns an access token
| Name        | Description  |
|-------------|--------------|
| access_token| access token |

---

**3. API for Forgot Password**

Request Method: `POST` 

API Endpoint:  `/api/forgot-password`

**Input:**  
1. Headers
    | Key          | Value            |
    |--------------|------------------|
    | Content-Type | application/json |
2. Request Body
    | Name        | Description      | Type     |
    |-------------|------------------|----------|
    | email       | registered email |  string  |


**Output:** The output of the following request will be in the form of message which is gonna tell us whether the password has been successfully updated or not.

| Name            | Description                       |
|-----------------|-----------------------------------|
| success message | Password Updated Successfully     |
| failure message | Password Not Updated Successfully |

---
## /api/tenant

**4. Tenant List**

Request Method:  `GET`  
API Endpoint:  `/api/tenant`
> `Note: `Only the admin of the tenants i.e. master admin can use this API

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
---

**5. Tenant Details**

Request Method:  `GET`  
API Endpoint:  `/api/tenant/:id`

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
**6. Create new Tenant**

Request Method:  `POST`  
API Endpoint:  `/api/tenant`

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |


2. Request Body
    | Name                    | Description               | Type   |
    |-------------------------|---------------------------|--------|
    | tenantName<br>required  | name of the new tenant    | string |
    | email<br>required       | email of the tenant       | string |
    | password<br>required    | password of the tenant    | string |
    | description<br>required | description of the tenant | string |

**Output:** Produces `application/json` of the following schema
| Name     | Description                 |
|----------|-----------------------------|
| message  | success                     |
| id       | registered tenant unique id |
---
**7. Updating a Tenant**

Request Method:  `PATCH`  
API Endpoint: `/api/tenant/:id`

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |
2. Request Path Parameters
    | Name           | Description            | Type   |
    |----------------|------------------------|--------|
    | id<br>required | id of the the tenant   | string |
3. Request Body
    | Name                              | Description                                       | Type   |
    |-----------------------------------|---------------------------------------------------|--------|
    | fields(to be updated)<br>required | key value pair of the configuration to be updated | string |

**Output:** Produces `application/json` of the following schema  

| Name        | Type   |
|-------------|--------|
| affected    | number |

The `affected` key value 1 means the updation is successfull otherwise it is 0  

---
**8. Deleting a Tenant**

Request Method: `DELETE`  
API Endpoint:  `/api/tenant`

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

**9. Tenant Configurations**

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

**10. Create New User**

Request Method:  `POST`  
API Endpoint: `/api/user`

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
    | tenantName       | name of tenant under<br>which the user is to be created | string  |

**Output:** Produces `application/json` of the following schema  
| Name       | Description                 |
|------------|-----------------------------|
| message    | success                     |
| id         | registered tenant unique id |

---
**11. User List**

Request Method:  `GET`  
API Endpoint:  `/api/user`

> `Note: `Only the admin of the user i.e. tenant under which the users are created can use this API

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |

**Output:** Produces `application/json` which contains the array of the following schema
| Name            | Description                        |
|-----------------|------------------------------------|
| id              | id of table row                    |
| userName        | name of user                       |
| email           | email of user                      |
| tenantName      | tenatName of the user              |
| createdDateTime | time of creation of user           |
| isDeleted       | if the user is active or deleted   |
---

**12. User Configuration**

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
**13. Updating a User**

Request Method:  `PATCH`  
API Endpoint: `/api/user/:id`

**Input:**
1. Headers
    | Key           | Value                 |
    |---------------|-----------------------|
    | Authorization | Bearer [ACCESS_TOKEN] |
    | Content-Type  | application/json      |

2. Request Path Parameters
    | Name                    | Description            | Type   |
    |-------------------------|------------------------|--------|
    | id<br>required          | id of the the user     | string |
    | tenantName<br>required  | tenantName of the user | string |

3. Request Body

    | Name                              | Description                                       | Type   |
    |-----------------------------------|---------------------------------------------------|--------|
    | fields(to be updated)<br>required | key value pair of the configuration to be updated | string |

**Output:** Produces `application/json` of the following schema  

| Name        | Type   |
|-------------|--------|
| affected    | number |

The `affected` key value 1 means the updation is successfull otherwise it is 0

---

**14. Deleting a User**

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
    | tenantName<br>required            | name of the tenant of the user     | string |

**Output:** Produces `application/json` of the following schema  

| Name        | Type   |
|-------------|--------|
| affected    | number |

The `affected` key value 1 means the updation is successfull otherwise it is 0

---
## Miscellaneous

**15. Test Tenant's connectivity with database**

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

**16. Test Creation of Table in Tenant's Database**

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
