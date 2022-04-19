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

We get the access token and refresh token which we can use further for authorisation.

![Password Grant type flow](https://user-images.githubusercontent.com/87794374/156330776-51298fe8-efa4-41fa-9a16-8782563a2105.png)
<p align = "center">Fig - Resource Owner Password Credentials Grant</p>

### **Token Validation**
The Token validation in this repository takes place in two ways viz: The first method is when the token is generated after the keycloak server is hit and second method is via the use of Public Key. Below we have discussed the methods in details.

**Method - I image**

![Token-Validation-Method-I](https://user-images.githubusercontent.com/87708447/164010136-f3f366c9-261a-4adf-9a0e-cbeda50edbdc.png)

- The Method-1 Token validation is as follows: 
- When the token comes at the server side, first it passes through the AuthGuard    middleware.
- OpenID Connect defines a discovery mechanism, called OpenID Connect Discovery,   where an OpenID server publishes its metadata at a well-known URL.
- The URL is as follows: `http(s)://{host}:{port}/realms/{realm-name}/.well-known/openid-configuration`
- It lists endpoints and other configuration options relevant to the OpenID Connect implementation in Keycloak. 
- To validate the token, we hit the Introspection endpoint whose URL is given as: `http(s)://{host}:{port}/auth/realms/{realm-name}/protocol/openid-connect/token/
- The Authorization server will check the token signature and also exp, aud etc. If the token is valid, a validated response containing isActive: true field is returned. Else isActive: false is returned.

**Method - II image**

![Token-validation-Method-II](https://user-images.githubusercontent.com/87708447/164010290-0d0c38c3-d400-4a9f-9d54-d6b355b0bfb6.png)

- The Method - II validation is as follows
- In this method rather than sending the token to the Authorization server to introspect, we validate the token on the server itself.
- But to validate the signature of the server, we need to have the public key. OIDC well-known configuration lists an API to retrieve the public key.
- The URL which is hit is as follows: `http(s)://{host}:{port}/auth/realms/{realm-name}/protocol/openid-connect/
certs`.
- After verifying the token signature, next we decode the token to check expiry time of the token. If expiry time is also valid, the validated response can be sent containing isActive: true field. Otherwise send isActive: false in response.

**Challenges in Method - II**
- In Method 2, if we don’t want to go to the Authorization Server to reduce latency, we must have the public key saved on the server itself. Public keys are different for different tenants. 
- So it is not good to store the Public Key on the server. 
- In order to encounter this problem we will be using Caching mechanism to store the Public Key.

### **NestJS Guard for Authorization**

After the token is received , the resources of the client can accessed. We are using Role based Access Control(RBAC) and to establish the access control layer we are implementing a custom guard namely *`KeycloakAuthGuard`*.

It performs two important tasks for us before granting access to any resource:

1. Token Validation: It validates the token received from Authorization header using public key *`jwks_uri endpoint`*
    > /realms/{realm-name}/protocol/openid-connect/certs

    We have *`validateTokenwithKey`* method in out `AuthService` class.  This method takes in token and public key (which we get using the above endpoint) as the input and returns error if the token is invalid.The implementation stores public key in cache so as not to hit authorization server repeatedly.

2. Extract `available roles & permissions` from access token to grant access to the resources after checking if the `required role & permissions` are present in the available roles & permissions.

### **Logout endpoint**
The logout endpoint logs out the authenticated user. To invoke this endpoint directly the refresh token needs to be included as well as the credentials required to authenticate the client.

> /realms/{realm-name}/protocol/openid-connect/logout

