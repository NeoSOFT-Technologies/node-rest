# Authentication & Authorization

## OAuth 2.0
[OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749) is an authorization framework that lets an authenticated user grant access to third parties via tokens. A token is usually limited to some scopes with a limited lifetime. Therefore, it's a safe alternative to the user's credentials.

OAuth 2.0 comes with four main components:

- **Resource Owner** – the end-user or a system that owns a protected resource or data
- **Resource Server** – the service exposes a protected resource usually through an HTTP-based API
- **Client** – calls the protected resource on behalf of the resource owner
- **Authorization Server** – issues an OAuth 2.0 token and delivers it to the client after authenticating the resource owner

## OpenID Connect

[OpenID Connect 1.0](https://openid.net/connect/) (OIDC) is built on top of OAuth 2.0 to add an identity management layer to the protocol. Hence, it allows clients to verify the end user's identity and access basic profile information via a standard OAuth 2.0 flow. OIDC has introduced a few standard scopes to OAuth 2.0, like *openid*, *profile*, and *email*.

## Keycloak as Authorization Server
[Keycloak](http://www.keycloak.org/) is an Identity and Access Management(IAM) Software, which will act as an essential tool in your business product. IAM typically aims to verify the identity of a user or system which is requesting access to your environment, and evaluates a set of rules which tells what features and assets is that user/system has access to.

Keycloak exposes a variety of REST endpoints for OAuth 2.0 flows. We are using the endpoint provided by keycloak for implementing our authentication and authorization service.

### **Token endpoint**

The token endpoint is used to obtain tokens. Tokens can either be obtained by exchanging an authorization code or by supplying credentials directly depending on what flow is used. The token endpoint is also used to obtain new access tokens when they expire. OAuth 2.0 supports different grant types, like *authorization_code*, *refresh_token*, or *password*. However, each grant type needs some dedicated form parameters (application/x-www-form-urlencoded).

> /realms/{realm-name}/protocol/openid-connect/token

We have *`getAccessToken`* method in out `AuthService` class which abstracts the use of token endpoint

The parameters required by this function are:

- `username` : Username of registered user
- `password` : Password
- `tenantName` : Tenantname under which user is rgistered
- `clientId` : Client Id of the confidential client whose access is requested
- `clientSecret` : Client secret of the that confidential client

We get the access token and refresh token which we can use further for authorisation.

### **NestJS Guard for Authorization**

After the token is received , the resources of the client can accessed. We are using Role based Access Control(RBAC) and to establish the access control layer we are implementing a custom guard namely *`KeycloakAuthGuard`*.

It performs two important tasks for us before granting access to any resource:

1. Token Validation: It validates the token received from Authorization header using *`Introspection endpoint`*
    > /realms/{realm-name}/protocol/openid-connect/token/introspect

    We have *`validateToken`* method in out `AuthService` class which abstracts the use of this endpoint. This method takes in token as the input and returns `true` if the token is active.

2. Extract `available roles` from access token to grant access to the resources after checking if the `required role` is present in the available roles.

### **Logout endpoint**
The logout endpoint logs out the authenticated user. To invoke this endpoint directly the refresh token needs to be included as well as the credentials required to authenticate the client.

> /realms/{realm-name}/protocol/openid-connect/logout

