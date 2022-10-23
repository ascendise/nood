# Nood

This is a website for managing your tasks. Create checklists, add your tasks and check them off when you are done. So simple!

## Technical Specifications

This project was generated with Angular CLI version 14.0.0.

It uses the [Todolist API](https://github.com/ascendise/todolistapi) as a backend.

## Installation

### Docker

The following docker-compose.yml shows an example for how to deploy the app on docker.

```YAML
services:
  mysql:
    image: "mysql"
    expose:
      - "3306"
    environment:
      MYSQL_ROOT_PASSWORD: "{placeholder}"
      MYSQL_USER: "spring"
      MYSQL_PASSWORD: "{placeholder}"
      MYSQL_DATABASE: "todolistdb"
  todolistapi:
    depends_on:
      - mysql
    image: "ascendise/todolistapi:v2.0.7"
    ports:
      - "5050:8080"
    links:
      - mysql:mysql
    environment:
      spring.security.oauth2.resourceserver.jwt.issuer-uri: "{placeholder}"
      spring.security.oauth2.resourceserver.jwt.jwk-set-uri: "{placeholder}"
      spring.jpa.hibernate.ddl-auto: "update"
      spring.datasource.url: "jdbc:mysql://mysql:3306/todolistdb"
      spring.datasource.username: "spring"
      spring.datasource.password: "{MYSQL_PASSWORD}"
      spring.datasource.driver-class-name: "com.mysql.cj.jdbc.Driver"
      server.servlet.context-path: "/api"
      spring.output.ansi.enabled: "DETECT"
      logging.level.org.springframework.web: DEBUG
  nood:
    depends_on:
      - todolistapi
    image: "ascendise/nood:1.0.0"
    ports:
      - "4200:80"
    environment:
      API_BASE_URI: "{placeholder}"
      OAUTH_ISSUER: "{placeholder}"
      OAUTH_REDIRECT_URI: "{placeholder}"
      OAUTH_CLIENT_ID: "{placeholder}"
      OAUTH_LOGOUT_URL: "{placeholder}"
      OAUTH_LOGIN_URL: "{placeholder}"
      OAUTH_AUDIENCE: "{placeholder}"
```
For setting up the todolistapi, see the [todolistapi Github page](https://github.com/ascendise/todolistapi) for more information.

#### Environment variables
The nood docker image takes the environment variables you pass in your docker-compose.yml to construct the config.json.

The `API_BASE_URI` is where you host the todolistapi. E.g. https://todo.example.com/api  
The `OAUTH_REDIRECT URI` is where the user should get redirected after login. Provide the uri where you host nood for this. E.g. https://nood.example.com

All the other variables prefixed with `OAUTH` are information about the OAuth-Provider you are using for SSO. See your OAuth-providers documentation for finding the values

#### Versioning
Use the versions specified in the docker-compose.yml. See [Semantic Versioning](##semantic-versioning) for more info

## Semantic Versioning

The versioning in Nood has mostly influence in how there may be changes when deploying the app. Increasing the version works as following:  

`MAJOR`.`MINOR`.`PATCH`

`MAJOR`: Nood uses a new version of the todolistapi. E.g. changing from ascendise/todolistapi:v2.0.7 to ascendise/todolistapi:v2.1.0. This will require you to change the deployed version of the todolistapi.

`MINOR`: There is new functionality implemented, which does not depend on a new version of the todolistapi. Therefore only the nood image has to be updated. And nothing else has to be done.

`PATCH`: A bug in nood was fixed. Only needed to change the nood image.

It is not recommended to use the latest-tag for either nood or the todolistapi, as both projects are developed independently and both latest versions may not be compatible. 
E.g. when the todolistapi has a breaking change which nood hasn't (yet) adapted to.

Always check the README when updating to a new `MAJOR` version of nood.  
It is safe to update to a new `MINOR` or `PATCH` version without having to fear incompatibility. 
The same applies to the todolistapi.

## Troubleshooting

If you encounter any bugs or steps from this documentation don't work, then feel free to create an issue.

