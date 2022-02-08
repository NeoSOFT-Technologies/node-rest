## Information regarding API's
---
**1. Logging in as tenant**

API Endpoint:  `GET` `/api/tenant-login/`

**Input:** The input for logging in a tenant is 
| Name                 | Description                  | Type   |
|----------------------|------------------------------|--------|
| username<br>required | Admin username of the tenant | string |
| password<br>required | Password of that Tenant      | string |

**Output:** After login page is redirected to `/tenant-dashboard` where the Dashboard is rendered

---
**2. Master Details**

API Endpoint:  `GET` `/api/master-login/`

**Input:** The input for getting master details is 
| Name                      | Description              | Type   |
|---------------------------|--------------------------|--------|
| adminName<br>required     | name of the master admin | string |
| adminPassword<br>required | admin password           | string |

**Output:** After login page is redirected to `/master-dashboard` where the master Dashboard is rendered

---
**3. Tenant List**

API Endpoint:  `GET` `/api/get-tenants/`
> `Note: `Only the admin of the tenants i.e. master admin can use this API

**Input:** No input is required

**Output:** Produces `application/json` which contains the array of the following schema
| Name            | Description                        |
|-----------------|------------------------------------|
| id              | id of table row                    |
| tenantName      | name of tenant                     |
| email           | email of tenant                    |
| password        | password of tenant                 |
| description     | description of tenant              |
| createdDateTime | time of creation of tenant         |
| isDelete        | if the delete is active or deleted |
---
**4. Tenant Details**

API Endpoint:  `GET` `/api/get-tenant-details/`

**Input:** The input for getting tenant details is 
| Name                   | Description            | Type   |
|------------------------|------------------------|--------|
| tenantName<br>required | name of the the tenant | string |

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
**5. Create new Tenant**

API Endpoint:  `GET` `/api/register-tenant/`

**Input:** The input for register a new tenant is 
| Name                    | Description               | Type   |
|-------------------------|---------------------------|--------|
| tenantName<br>required  | name of the new tenant    | string |
| email<br>required       | email of the tenant       | string |
| password<br>required    | password of the tenant    | string |
| description<br>required | description of the tenant | string |

**Output:** Produces `application/json` of the following schema
| Name            | Description  |
|-----------------|--------------|
| message         | success      |
---

**6. Tenant Configurations**

API Endpoint: `GET` `/api/get-tenant-details-by-tenantName/`

**Input:** The input for retrieving configuration of specific Tenant is given below

| Name                    | Description               | Type   |
|-------------------------|---------------------------|--------|
| tenantName<br>required  | name of the new tenant    | string |

**Output:** Produces `application/json` of the following schema and having the following configuration.

| Name             | Description               | Type    |
|------------------|---------------------------|---------|
| tenantName       | name of the tenant        | string  |
| tenantId         | id of the tenant          | string  |
| port             | port of database server   | number  |
| createdDatetime  | date and time of creation | string  |
| email            | emailll of tenant         | string  |
| description      | description of tenant     | string  |
| host             | host of db server         | string  |
---

**7. Create New User**
API Endpoint: `POST` `/api/create-new-user/`

**Input:** The input for creating a new user is in the form of `application/json`

| Name             | Description                                             | Type    |
|------------------|---------------------------------------------------------|---------|
| userName         | name of the new user                                    | string  |
| password         | password to be set by user                              | string  |
| email            | email of the new user                                   | string  |
| tenantName       | name of tenant under<br>which the user is to be created | string  |

**Output:** The output i.e the response of this above request is in the form of `JSON`

| Name       | Type   |
|------------|--------|
| message    | string |
---
**8. Updating the Tenant's Configuration**
API Endpoint: `PATCH` `/api/tenants`

**Input:** The input for editing a tenant's configuratiom is in the form of `application/json` which is nested json. The key is `action` with the value which is a json of the schema

| Name                              | Description                                       | Type   |
|-----------------------------------|---------------------------------------------------|--------|
| tenantName<br>required            | name of the tenant                                | string |
| config(to be updated)<br>required | key value pair of the configuration to be updated | string |

**Output:** The output i.e the response of this above request is in the form of `JSON`

| Name        | Type   |
|-------------|--------|
| affected    | number |

The `affected` key value 1 means the updation is successfull otherwise it is 0  

---
**8. Updating the Tenant's Configuration**
API Endpoint: `PATCH` `/api/tenants`

**Input:** The input for editing a tenant's configuratiom is in the form of `application/json` which is nested json. The key is `action` with the value which is a json of the schema

| Name                              | Description                                       | Type   |
|-----------------------------------|---------------------------------------------------|--------|
| tenantName<br>required            | name of the tenant                                | string |
| config(to be updated)<br>required | name of the configuration to be updated           | string |

**Output:** The output i.e the response of this above request is in the form of `application/json` which contains a key

| Name        | Type   |
|-------------|--------|
| affected    | number |

The `affected` key value 1 means the updation is successfull otherwise it is 0  

---
**9. Deleting a Tenant**
API Endpoint: `DELETE` `/api/tenants`

**Input:** The input for this request is in the `JSON` format and `tenantName` is required.

| Name                              | Description                                       | Type   |
|-----------------------------------|---------------------------------------------------|--------|
| tenantName<br>required            | name of the tenant to be deleted                              | string |

**Output:** The output i.e the response of this above request is in the form of `application/json` which contains a key

| Name        | Type   |
|-------------|--------|
| affected    | number |

The `affected` key value 1 means the updation is successfull otherwise it is 0  

---
**10. Test Tenant's connectivity with database**
API Endpoint: `GET` `/api/connect-database`

**Input:** The input for this endpoint is in the form of `request query` which is of the following format.

| Name                   | Description                                 | Type   |
|------------------------|---------------------------------------------|--------|
| host<br>required       | host of db server                           | string |
| port<br>required       | port of db server                           | number |
| tenantName<br>required | name of the tenant                          | string |
| dbName<br>required     | name of the tenant's db                     | string |
| password<br>required   | password of user with CRUD permission on db | string |

**Output:** The output when the credentials are verified is in the `JSON` format.

| Name        | Type    |
|-------------|---------|
| message     | success |

---