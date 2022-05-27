# Multitenant Solution(IAM) [![CI](https://github.com/NeoSOFT-Technologies/node-rest/actions/workflows/ci.yml/badge.svg)](https://github.com/NeoSOFT-Technologies/node-rest/actions/workflows/ci.yml)
## Description

- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

- Nest provides a level of abstraction above these common Node.js frameworks (Express/Fastify) but also exposes their APIs directly to the developer. This allows developers the freedom to use the myriad of third-party modules which are available for the underlying platform.

- There are superb libraries, helpers, and tools that exist for Node (and server-side JavaScript), none of them effectively solve the main problem of — Architecture.

- ### Features of NestJS
    - Extensible Approach
    - Easy to use, learn and master
    - Command Line Interface(CLI)
    - Versatile
    - Progressive
    - Implemented Based on SOLID Principles
    - Lazy and Dynamic Modules
    - API Versioning
    - Documentation
    - Open Source
    - Large & Active Community
## Common Features

- Quick start
- Integrated ESLint, Prettier and Husky
- Common Error Handler
- Simple and Standard scaffolding
- Production-Ready Skeleton
- Followed SOLID Principles
### Prerequisites

- Node <https://nodejs.org/en/> *use the LTS version*
- NPM
- Docker <https://www.docker.com/>
    - Install Docker Desktop for MAC: [https://docs.docker.com/docker-for-mac/install/](https://docs.docker.com/docker-for-mac/install/)
    - Install Docker Desktop for Windows: [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- NestJS CLI <https://nestjs.com/>

#### Clone The Application

```bash
// clone the application
$ git clone https://github.com/NeoSOFT-Technologies/node-rest.git
```
#### Quick Installation

Next, install the packages that are required for this project.
```bash
# Install the required npm modules in root repo
$ npm install
```
### Running the app

```bash
# docker
$ docker-compose up #--build
```
> The output of the above command should be shown as below.

![Docker-compose-up](https://user-images.githubusercontent.com/87708447/152335672-04d94fe3-3f9f-49e5-902e-538b2fbf30ce.png)




## Project Structure

In a TypeScript project, it's best to have separate _source_  and _distributable_ files.
TypeScript (`.ts`) files live in your `src` folder and after compilation are output as JavaScript (`.js`) in the `dist` folder.
The `test` and `views` folders remain top level as expected.

Please find below a detailed description of the app's folder structures:


> **Note!** Make sure you have already built the app using  `npm run build`

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **.github**              | Contains GitHub settings and configurations, including the GitHub Actions workflows           |
| **.husky**               | Contains and manages git hooks            |
| **node_modules**         | Contains all your npm dependencies                                                            |
| **${service-name}/node_modules**   | Contains all your npm dependencies of microservices                                 |
| **${service-name}/dist** | Contains the distributable (or output) from your TypeScript build. This is the code you ship  |
| **${service-name}/src**  | Contains your source code that will be compiled to the dist dir                               |
| **${service-name}/src/config**| Here you will find all the environment configuration necessary to access the application |
| **${service-name}/src/${module_name}/** | Microservice defined group of files/source                                     |
| **${service-name}/src/transport** | Information about Microservice communication layer                                   |
| **${service-name}/src/${module_name}/dto/**      |  DTO (Data Transfer Object) Schema, Validation                        |
| **${service-name}/src/${module_name}/entities/**      | Entities belongs to that Microservice                            |
| **${service-name}/src/${module_name}/db/**      |  Database module for Typeorm                                           |
| **${service-name}/src/${module_name}/module_name.controllers.ts**      |  Controller belongs to that Microservice        |
| **${service-name}/src/${module_name}/module_name.module.ts**      |   Module belongs to that Microservice                |
| **${service-name}/src**/main.ts      | Entry point to your backend app                                                   |          
| **${service-name}/test**  | Contains your tests. Separate from source because there is a different build process.        |
| config/.env              | API keys, tokens, passwords, database URI. Clone this, but don't check it in to public repos. |
| package.json             | File that contains npm dependencies                                                           |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                               |
| tsconfig.build.json      | Config settings for compiling tests written in TypeScript                                     |
| .eslintrc                | Config settings for ESLint code style checking                                                |
| .eslintignore            | Config settings for paths to exclude from linting                                             |

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

### Setting up project on VM
Following are the steps to set-up this repository on Virtual Machine.

- Install Remote Desktop Application (Eg For Linux it is Remmina) in your Machine.
- Launch the remote desktop which will look like this.
- 
![Selection_177](https://user-images.githubusercontent.com/87708447/165104970-55cb2753-a814-42fb-a8ae-d3e59d309d01.png)

- Enter the IP address.
- Once the IP address is verified the following screen will appear.
- Enter the required credentials i.e admin and password, and then the VM is connected.
- Open any browser and then clone the repository of node-rest boilerplate by copy pasting the link `https://github.com/NeoSOFT-Technologies/node-rest`
- Open the Terminal in the `node-rest` directory and then type the following command - `docker-compose up` and the application will start.
- Open the browser and hit the following  URL: `http://localhost:5000/api/docs` and the Swagger UI will be displayed.
---
### Microservices
- [Tenant Registration Service](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/microservices/tenant-registration.md)
- [Tenant Master Service](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/microservices/tenant-master-service.md)
- [Tenant Provisioning Service](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/microservices/tenant-provisioning.md)
- [Tenant Configuration Service](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/microservices/tenant-config-service.md)

### Consuming Microservices
- [Multitenancy Rest Service](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/multitenancy-rest-service.md)
- [Authentication](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/auth.md)
- [Understand Microservices Communication](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/communication.md)
- [Video Demonstration](https://user-images.githubusercontent.com/87794374/147342616-5b38b414-fda5-4c11-8ebc-40ebcb59cc5b.mp4)

### Demo
  - [Clone & Installation Setup](https://drive.google.com/file/d/11K3T7drZqAjxYfY314A0CZHIfYALzvRc/view?usp=sharing)
  - [Start the application with Docker Containers](https://drive.google.com/file/d/1Vbz-87oQ0gPCwVDA2QfhkaydtfY0mXpY/view?usp=sharing)
- [All micro services Introduction ](https://drive.google.com/file/d/1sH4DHSYfDeID7CWM0nFySLh_DaVjucWQ/view?usp=sharing)
- [Swagger Demo - 1](https://drive.google.com/file/d/1esIzfkhCAotBgJGIvObmfffQGpuLkJZp/view?usp=sharing)<br>[Swagger Demo - 2](https://drive.google.com/file/d/1MTDhkpDl1-3RQ_hjKW76eHRckSpS8FYI/view?usp=sharing)<br>[Swagger Demo - 3](https://drive.google.com/file/d/1MtvYYvJMMU5nfaS5whCv2i5YkMfdYlut/view?usp=sharing)
- [Postman Demo](https://drive.google.com/file/d/1BV2-z36Wj86RovwIIak8_ASmvafLbK97/view?usp=sharing)
  #### Features
  - [Login](https://drive.google.com/file/d/1DrB08F7NgPda0o2dFGeJWJIxIum_F7Om/view?usp=sharing)
  - [Authorization - 1](https://drive.google.com/file/d/1zkz8oIh1lZcgWw7YH98_cLzxNiGAj1FN/view?usp=sharing)<br>[Authorization - 2](https://drive.google.com/file/d/1kQcg-DGVkvr0r6hmqjLdqqBByKqohgC6/view?usp=sharing)
  - [Clean Code Architecture](https://drive.google.com/file/d/1op3532wpcvNRbPPMqpej6btblkQ_lCJO/view?usp=sharing)
  - [Microservices Communication](https://drive.google.com/file/d/1PkH-vg5cw-KN-9f15BsEfjmtI3SX6aEY/view?usp=sharing)
  - [Error Handling](https://drive.google.com/file/d/1n3k-xFpDsD_NLPVJavTOMhnxTcZyS_PC/view?usp=sharing)
  - [Database Handling & Type ORM](https://drive.google.com/file/d/14aoWPXrlMLMSOza2c89if_4kXvvIPC-F/view?usp=sharing)
  - [Unit Test Cases](https://drive.google.com/file/d/1XzTMIIgauLS9ezX4NqlY_bL8fj7wUJsy/view?usp=sharing)



## Contributing to this project

Contributions are welcome from anyone and everyone. We encourage you to review the [guiding principles for contributing](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/contribution.md)

* [Bug reports](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/contribution/bug-reports.md)
* [Feature requests](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/contribution/feature-requests.md)
* [Pull requests](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/contribution/pull-requests.md)

### Issues/Discussions

- [Create New Issue](https://github.com/NeoSOFT-Technologies/node-rest/issues/new)
- [Check Existing Issues](https://github.com/NeoSOFT-Technologies/node-rest/issues)
- [Discussions](https://github.com/NeoSOFT-Technologies/node-rest/discussions)

### Miscellaneous

- [Git commits](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/miscellaneous/git-commits.md)
- [Clean Docker Images](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/miscellaneous/clean-docker.md)
- [Installation Prettier, Husky & Lint](https://github.com/NeoSOFT-Technologies/node-rest/blob/main/wiki/docs/miscellaneous/installation-pretteri-husky-lint.md)

## Stay in touch

* Website - [https://www.neosofttech.com/](https://www.neosofttech.com/)
* Twitter - [@neosofttech](https://twitter.com/neosofttech)
* Meetup -  [https://www.meetup.com/neosoft-technologies/](https://www.meetup.com/neosoft-technologies/)
* Medium -  [https://medium.com/@neosofttech-technologies-blog](https://medium.com/@neosofttech-technologies-blog)
* GitHub - [https://github.com/NeoSOFT-Technologies](https://github.com/NeoSOFT-Technologies)
