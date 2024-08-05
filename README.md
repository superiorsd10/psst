# psst

## Description
This project is a secure pastebin-like application designed to allow users to create, manage, and access encrypted pastes. It provides user authentication, secure paste storage, and click tracking, with data managed across multiple services including AWS S3, Redis, and PostgreSQL.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)

## Features
- **User Authentication**: 
  - Register and log in using a username and password.
  - JWT token-based authentication for secure API access.

- **Paste Creation**:
  - Users can create pastes with metadata including title, content, tags, visibility (public/private), expiration time, and security settings.
  - Unique ID generation for each paste using `nanoid`, validated for uniqueness with a Bloom filter.
  - Content encryption with AES-256-CBC algorithm, and CRC32 checksum for integrity verification.
  - Validation to ensure content size does not exceed 1MB.
  - Paste content is stored securely in Amazon S3.

- **Paste Access**:
  - Private pastes require authentication; access is controlled based on user permissions.
  - Cached content retrieval from Redis to improve performance and reduce S3 calls.
  - Metadata and content retrieval using signed URLs from S3 when not cached.
  - Paste expiration and visibility checks, password protection, and data integrity verification.
  - Secure pastes are decrypted upon retrieval if necessary.

- **Click Tracking**:
  - Increment click counts in Redis, and periodically update PostgreSQL with batch processing.

## Technologies
This project utilizes a variety of technologies to provide a robust and secure pastebin-like application:

- **Programming Languages & Frameworks**:
  - **TypeScript**: Provides type safety and enhances JavaScript with static typing.
  - **Node.js**: A JavaScript runtime built on Chrome's V8 engine, used for building server-side applications.
  - **Express**: A web application framework for Node.js, used for handling HTTP requests and routing.

- **Security**:
  - **JWT (JSON Web Tokens)**: Used for secure user authentication and session management.
  - **AES-256-CBC**: Advanced Encryption Standard used for encrypting paste content.
  - **bcrypt**: A library for hashing passwords securely.

- **Databases & Caching**:
  - **PostgreSQL**: An open-source relational database used for storing user data, paste metadata, and click tracking information.
  - **Redis**: An in-memory data structure store used for caching and managing click tracking.

- **Storage & File Management**:
  - **Amazon S3**: A scalable object storage service used for storing paste content files.

- **Utilities**:
  - **nanoid**: A library for generating unique IDs.
  - **Bloom filter**: A probabilistic data structure used for checking uniqueness of IDs.
  - **CRC32**: A checksum algorithm used for data integrity verification.

- **Development Tools**:
  - **Docker**: A platform for developing, shipping, and running applications in containers.
  - **Docker Compose**: A tool for defining and running multi-container Docker applications.
  - **ESLint**: A tool for identifying and fixing problems in JavaScript and TypeScript code.
  - **Prettier**: A code formatter for maintaining consistent code style.


## Installation

### Docker Compose

To set up the application using Docker Compose, follow these steps:

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/superiorsd10/psst.git
   cd psst
   ```

2. **Create Environment File**:
   Copy the example environment file and customize it with your settings:
   ```sh
   cp .env.example .env
   ```

3. **Build and Start Containers**:
   Use Docker Compose to build and start the application and its dependencies:
   ```sh
   docker-compose up --build
   ```

4. **Access the Application**:
   Once the containers are running, you can access the application at `http://localhost:<port>`, where `<port>` is specified in your `docker-compose.yml` file.

5. **Stopping the Containers**:
   To stop the application and remove the containers, use:
   ```sh
   docker-compose down
   ```

### Local Development

1. **Install Dependencies**:
   ```sh
   npm install
   ```

2. **Run the Application**:
   ```sh
   npm run build && npm start
   ```

## Architecture
- **src**: Contains the main source code.
  - **api**: Manages API endpoints and middleware.
    - **controllers**: Handles business logic for routes.
    - **middlewares**: Contains middleware functions.
    - **routes**: Defines API routes.
  - **config**: Contains configuration files.
  - **prisma**: Manages database schema and migrations.
  - **schemas**: Defines validation schemas.
  - **services**: Contains business logic and external service interactions.
  - **utils**: Utility functions and constants.
  - `app.ts`: Application setup and middleware registration.
  - `server.ts`: Server setup and initialization.
  - `types.d.ts`: Type definitions.

## Folder Structure
```
- src
  - api
    - controllers
      - pasteController.ts
      - userController.ts
    - middlewares
      - authMiddleware.ts
      - errorHandlerMiddleware.ts
      - getPasteMiddleware.ts
      - rateLimiterMiddleware.ts
      - validationMiddleware.ts
    - routes
      - pasteRoutes.ts
      - userRoutes.ts
  - config
    - config.ts
  - prisma
    - migrations
    - prisma.ts
    - schema.prisma
  - schemas
    - userSchema.ts
    - pasteSchema.ts
  - services
    - encryptionService.ts
    - idGenerationService.ts
    - jwtService.ts
    - pasteClickService.ts
    - pasteService.ts
    - redisService.ts
    - s3Service.ts
    - userService.ts
  - utils
    - apiError.ts
    - httpStatusCodes.ts
  - app.ts
  - server.ts
  - types.d.ts
- .eslintignore
- .eslintrc
- .gitignore
- .env.example
- .prettierrc
- docker-compose.yml
- Dockerfile
- nodemon.json
- package-compose.json
- package.json
- tsconfig.json
```

## Usage
1. **Register a new user:**
   ```http
   POST /api/user/register
   {
     "username": "example",
     "password": "password"
   }
   ```
2. **Log in to get JWT token:**
   ```http
   POST /api/user/login
   {
     "username": "example",
     "password": "password"
   }
   ```
3. **Create a new paste:**
   ```http
   POST /api/paste
   Authorization: Bearer <JWT Token>
   {
     "title": "Sample Paste",
     "content": "This is a sample paste.",
     "tags": "sample, test",
     "visibility": "public",
     "expirationTime": "2024-12-31T23:59:59Z",
     "isSecured": true,
     "password": "securepassword"
   }
   ```
4. **Access a paste:**
   ```http
   GET /api/paste/:id
   Authorization: Bearer <JWT Token> (if private)
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with your improvements or bug fixes.

## Contact
For any inquiries, please contact [Sachin Dapkara](mailto:sachindapkara6@gmail.com).

---