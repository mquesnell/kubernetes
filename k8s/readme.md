# Kubernetes Notes

The files in this directory are used to run a sample application in Kubernetes.

## Deployments
* frontend.yaml: deploys a pod containing the frontend (see below)
* backend.yaml: deploys a pod containing the backend (see below)

## Pods
* frontend: contains a node.js instance that serves a React applicaiton on port 3000, implemented by the docker container **toybackend**
* backend: contains a Spring Boot application that implements an API on port 8080, implemented by the docker container **toyfrontend**

## Services
* backend-svc: maps port 31111 to the backend port 8080
* frontend: maps port 30033 to the frontend port 3000

File **services.yaml** creates both services.

Note: in **minikube**, none of the service ports listed above are accessible directly. To access the services:

  1. Open a new terminal
  2. In the new terminal issue the command:

      ```
      minikube service <service-name> --url
      ```
  3. Leave the terminal open and access the service using the URL provided by minikube

# Docker Notes

## Images

* backend/Dockerfile: based on the Google java non-root image, adds the .jar file to the image and runs it
* frontend/Dockerfile: builds an image based on Alpine Linux, copies the frontend code, builds it, and then runs the node.js **serve** command

## Building the Images

### Configuration
In order to deploy local images in minikube, docker must be configured to use the local minikube registry. To do so, issue the following command in the terminal where you will issue the docker build command:

```eval $(minikube -p minikube docker-env)```

### Backend

To build the backend:
1. Edit the source code
2. In the backend directory, run:
    ```./gradlew bootJar```
1. In the backend directory, run:
    ```docker build -t toybackend .```

### Frontend

To build the frontend:
1. Edit **RequestHelper.ts** to point to the URL where the backend is available (see above)
2. In the frontend directory, run:
   ```docker build -t toyfrontend .```

