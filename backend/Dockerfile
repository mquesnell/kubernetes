FROM gcr.io/distroless/java

WORKDIR /app
COPY build/libs/ourbackend.jar /app
COPY application.yml /app
CMD ["ourbackend.jar"]