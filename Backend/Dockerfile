# Use pre-built JAR (mvn clean package -DskipTests runs locally)
FROM amazoncorretto:17-alpine
WORKDIR /app

# Copy the pre-built JAR
COPY target/*.jar app.jar

# Render listens on PORT env var (defaults to 8080)
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
