## Information regarding API's
---
**1. Logging in as tenant**

API Endpoint:  `GET` `/api/tenant-login/`

**Input:** The input for logging in a tenant is 
| Name                 | Description                  | Schema |
|----------------------|------------------------------|--------|
| username<br>required | Admin username of the tenant | string |
| password<br>required | Password of that Tenant      | string |

**Output:** After login page is redirected to `/tenant-dashboard` where the Dashboard is rendered

---
**2. Master Details**

API Endpoint:  `GET` `/api/master-login/`

**Input:** The input for getting master details is 
| Name                      | Description              | schema |
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
| Name                   | Description            | Schema |
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
| Name                    | Description               | schema |
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
