### Installation Of Node-Rest Reposirotry in Virtual Machine

Following are the steps to set-up this repository on Virtual Machine.

- Install Remote Desktop Application (Eg For Linux it is Remmina) in your Machine.
- Launch the remote desktop which will look like this.
![Selection_177](https://user-images.githubusercontent.com/87708447/165104970-55cb2753-a814-42fb-a8ae-d3e59d309d01.png)

- Enter the IP address.
- Once the IP address is verified the following screen will appear.
Image
- Enter the required credentials i.e admin and password, and then the VM is connected.
Image

- Open any browser and then clone the repository of node-rest boilerplate by copy pasting the link `https://github.com/NeoSOFT-Technologies/node-rest`
- Open the Terminal in the `node-rest` directory and then type the following command - `docker-compose up` and the application will start.
- Open the browser and hit the following  URL: `http://localhost:4004/` and the Console UI will be displayed.

Image
---

### List of Services and Ports

| Sr No. | Name of the Services         | Port Number |
|--------|------------------------------|-------------|
| 1.     | Multi-Tenancy-Rest-Service   | 5000        |
| 2.     | Tenant Registeration Service | 8875        |
| 3.     | Tenant Provision Service     | 8878        |
| 4.     | Tenant Master Service        | 8847        |
| 5.     | Tenant Config Service        | 8848        |
| 6.     | MySQL Database               | 3306        |
| 7.     | Keycloak Server              | 8080        |
| 8.     | Demo Mailer Server           | 1025 & 8025 |

---

### URL List

| Sr No. | Component | URL Link                         |
|--------|-----------|----------------------------------|
| 1.     | Swagger   | `http://localhost:5000/api/docs` |
| 2.     | Keycloak  | `http://localhost:8080`          |
| 3.     | Console   | `http://localhost:4004`          |
---

### Steps to create Tenant

Follow the following steps to create the Tenant.
- Hit the Console component URL in the browser which is `http://localhost:4004` and the following screen will appear.
Image
- Enter the Admin credentials i.e Log in the application as an admin and following screen shall appear.
Image
- On the side Menu click on Tenant and in that click on Register Tenant.
- Enter the details of the Tenant that needs to be created.
- Details of Tenant: 

|Sr No.| Tenant Details        | Value                   |
|------|-----------------------|-------------------------|
| 1.   | Name:                 | DemoTenant              |
| 2.   | Email:                | demotenant@gmail.com    |
| 3.   | Password:             | DemoTenant@123          |
| 4.   | Description:          | Demo Description        |
| 5.   | Databasename:         | DemoTenantdb            |
| 6.   | Database Description: | Demo Description        |

- Then the tenant is created successfully.
