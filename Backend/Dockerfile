# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -q

# Stage 2: Runtime image
FROM amazoncorretto:17-alpine
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Default port (Render will override with PORT env var)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
