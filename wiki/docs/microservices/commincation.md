# Multi-Tenancy

## Introduction

A multi tenancy is a software architecture that implies centralized administration. It means that a single instance of an application serves many customers (called also tenants) and each one has his access to shared resources (Code, storage and networking).
A good example would be Github where each user or organization has a separate work area. This concept is used while developing software that runs for different organizations. Gmail, Google Drive, Yahoo, and many others are perfect examples of multi-tenant applications, these all serve different content based on the user who logged in.

![Single vs Multi Tenant](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/images/single-vs-multi-tenant.png?raw=true)

### The major advantages of multi tenant architecture are

1) **Faster maintenance**:
Since the multi tenant application uses a single instance of an application, therefore a centralized, making a change or fixing a bug will be available instantly to all users. This will reduce the maintenace and bug correction time and increase the availability if the application.
2) **Scalability**
Using shared resources will make the entry cost very low and the scalability easier and faster to apply.

Although we can create a monolithic application, it is not usually a good idea for mulit-tenancy applications, since they can be quite big, the better approach is to use microservices.

We designed our multitenancy architecture using 4 microservices:

1) **Tenant Registration Service**
This service registers a tenant using tenant's details. These details are stored in the tenant config table before being sent to the Tenant master service for separate database provision fr the tenant
2) **Tenant Master Service**
This service manages all the tenants i.e. this service links Tenant Provisioning and Tenant Config service with the Tenant Registration service
3) **Tenant Provisioning Service**
This service provisions a separeate database to the tenant which the tenant has access to through the email and password provided during registration
4) **Tenant Configuration Service**
This service stores the tenant details and configurations and renders it via api provided.

These services are exposed through api's in **api-gateway**

## Microservices Communication

Nest supports several built-in transport layer implementations, called transporters, which are responsible for transmitting messages between different microservice instances. Most transporters natively support both request-response(`@MessagePattern()`) and event-based(`@EventPattern()`) message styles. Nest abstracts the implementation details of each transporter behind a canonical interface for both request-response and event-based messaging. This makes it easy to switch from one transport layer to another. For example to leverage the specific reliability or performance features of a particular transport layer -- without impacting your application code. 
The communication between the services can be understood by th following image

### Message Pattern

The message style is useful when you need to exchange messages between various services.To enable the request-response message type, Nest creates two logical channels - one is responsible for transferring the data while the other waits for incoming responses. To create a message handler based on the request-response paradigm use the `@MessagePattern()` decorator, which is imported from the `@nestjs/microservices` package. This decorator should be used only within the controller classes since they are the entry points for your application. Using them inside providers won't have any effect as they are simply ignored by Nest runtime.

### Event Pattern
This style is useful when we want to publish events without waiting for a response. In that case, we don't need overhead required by request-response for maintaining two channels. To create an event handler, we use the `@EventPattern()` decorator, which is imported from the `@nestjs/microservices` package.



![Communication](https://github.com/NeoSOFT-Technologies/node-rest/blob/dev/wiki/images/microservices-communication.png?raw=true)
