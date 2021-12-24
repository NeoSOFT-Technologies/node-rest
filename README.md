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

Next, install the packages that are required for this project in each of the microservice.

```bash
# Install the required npm modules in root repo
$ npm install
# Install the required npm modules in api-gateway
$ npm install
# Install the required npm modules in tenant-registration
$ npm install
# Install the required npm modules in tenant-master-service
$ npm install
# Install the required npm modules in tenant-provisioning
$ npm install
# Install the required npm modules in tenant-config-service
$ npm install
```
### Running the app

```bash
# docker
$ docker-compose up #--build
```
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

### Microservices
- [Tenant Registration Service](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/microservices/tenant-registration.md)
- Tenant Master Service
- [Tenant Provisioning Service](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/microservices/tenant-provisioning.md)
- Tenant Configuration Service

### Consuming Microservices
- [API Gateway](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/api-gateway.md)
- [Understand Microservices Communication](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/communication.md)
- [Video Demonstration](https://user-images.githubusercontent.com/87794374/147342616-5b38b414-fda5-4c11-8ebc-40ebcb59cc5b.mp4)

## Contributing to this project

Contributions are welcome from anyone and everyone. We encourage you to review the [guiding principles for contributing](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/contribution.md)

* [Bug reports](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/contribution/bug-reports.md)
* [Feature requests](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/contribution/feature-requests.md)
* [Pull requests](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/contribution/pull-requests.md)

### Issues/Discussions

- [Create New Issue](https://github.com/NeoSOFT-Technologies/node-rest/issues/new)
- [Check Existing Issues](https://github.com/NeoSOFT-Technologies/node-rest/issues)
- [Discussions](https://github.com/NeoSOFT-Technologies/node-rest/discussions)

### Miscellaneous

- [Git commits](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/miscellaneous/git-commits.md)
- [Clean Docker Images](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/miscellaneous/clean-docker.md)
- [Installation Pretteri, Husky & Lint](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/docs/miscellaneous/installation-pretteri-husky-lint.md)

## Stay in touch

* Website - [https://www.neosofttech.com/](https://www.neosofttech.com/)
* Twitter - [@neosofttech](https://twitter.com/neosofttech)
* Meetup -  [https://www.meetup.com/neosoft-technologies/](https://www.meetup.com/neosoft-technologies/)
* Medium -  [https://medium.com/@neosofttech-technologies-blog](https://medium.com/@neosofttech-technologies-blog)
* GitHub - [https://github.com/NeoSOFT-Technologies](https://github.com/NeoSOFT-Technologies)
