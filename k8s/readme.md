# Kubernetes Notes

The files in this directory are used to run a sample application in Kubernetes. The backend supplies several REST endpoints and the frontend provides minimal ability to access the endpoints.

## Deployments
* frontend.yaml: deploys a pod containing the frontend (see below)
* backend.yaml: deploys a pod containing the backend (see below)

## Pods
* frontend: contains a node.js instance that serves a React application on port 3000, implemented by the docker container **toyfrontend**
* backend: contains a Spring Boot application that implements an API on port 8080, implemented by the docker container **toybackend**. This pod relies on several environment variables. The database password is stored in the secret created by **mysql-secret.yaml**.

## Services
* backend-svc: maps port 31111 to the backend port 8080
* frontend: maps port 30033 to the frontend port 3000

File **services.yaml** creates both services.

### Minikube
In **minikube**, none of the service ports listed above are accessible directly. To access the services:

1. Open a new terminal
2. In the new terminal issue the command:

    ```
    minikube service <service-name> --url
    ```
3. Leave the terminal open and access the service using the URL provided by minikube

Example: ```minikube service backend-svc --url```

Returns: 
```
http://127.0.0.1:41997
❗  Because you are using a Docker driver on linux, the terminal needs to be open to run it.
```

The backend endpoints can now be accessed at http://127.0.0.1:41997/api/toys, etc. Frontend access is similar.

<p>&nbsp;</p>

# MySQL Notes

MySQL is run in a pod and attached to a persistent volume for data storage.

## Pod
**mysql.yaml** creates a pod that runs the latest version of mysql

## Secret
**mysql-secret.yaml** creates a Kubernetes Secret that contains the base64 encoded root password for the mysql pod

## Service
**mysql-service.yaml** creates a Service that allows the backend to connect to the mysql pod on port 3306

## Persistent Volume
**mysql-pv.yaml** creates a 10 MB persistent volume in the local file system for mysql data storage. The volume is retained when the pod is stopped.

## Peristent Volume Claim
**mysql-pvc.yaml** claims 10 MB of storage in the persistent volume for mysql data storage


<p>&nbsp;</p>

# Docker Notes

## Images

* backend/Dockerfile: based on the Google java non-root image, adds the .jar file to the image and runs it
* frontend/Dockerfile: builds an image based on Alpine Linux, copies the frontend code, builds it, and then runs the node.js **serve** command

## Building the Images

### Configuration
In order to deploy local images in minikube, docker must be configured to use the local minikube registry. To do so, issue the following command in the terminal where you will issue the docker build commands:

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
1. In the frontend directory, run:
   ```docker build -t toyfrontend .```

<p>&nbsp;</p>

# TODO
* the mysql .yaml files could be combined into one
* mysql should be converted to a deployment
* the environment variables used by the backend should be converted to a ConfigMap

