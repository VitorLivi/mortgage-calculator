<h1 align="center"> Mortgage Calculator </h1>
Calculate your monthly mortgage payments with CMHC insurance considerations. Get accurate estimates for your home purchase in Canada.
<h3></h3>

<img width="1234" height="1358" alt="image" src="https://github.com/user-attachments/assets/a72dc4e4-e65d-4083-8f8f-e2c9c0c00695" />


### How to start the project?

<pre>
1 - Clone the project
2 - Enter the root folder
3 - run the command "docker compose up --build"  or "docker-compose up --build" if you have the older version of the docker compose
</pre>

<strong> Requirements </strong>
- docker
- docker compose

### Application URLs

| Service     | URL                             |
|-------------|----------------------------------|
| Frontend    | [http://localhost:3001](http://localhost:3000)       |
| Storybook   | [http://localhost:6006](http://localhost:6006)       |
| Backend     | [http://localhost:5000](http://localhost:5000)       |
| Swagger API | [http://localhost:5000/api/docs](http://localhost:5000/api/docs) |

## Backend

### Architecture
Although this was a small challenge, I chose to use Clean Architecture to demonstrate my ability to work with this architectural pattern and to bring a market-recognized standard to the project.

#### Clean Architecture
Clean Architecture separates business logic from external concerns like databases or frameworks. It promotes testability, maintainability, and a clear dependency flow from the outer layers to the core.

<img width="772" height="567" alt="image" src="https://github.com/user-attachments/assets/6bfe910f-9c0a-4321-bfb6-bedd991c07ef" />

<h3></h3>

<strong> Commands </strong>
<pre>
  - npm run build // Compiles the NestJS application using the Nest compiler
  - npm start // Starts the application in production mode
  - npm run start:dev // Starts the application in development mode and watches for changes
  - npm run start:debug // Starts the application in debug mode with watch enabled
  - npm run start:prod // Starts the compiled application from the dist folder
  - npm run lint // Runs ESLint on the codebase and automatically fixes issues
  - npm test // Runs all unit tests using Jest
  - npm run test:watch // Runs tests in watch mode using Jest
  - npm run test:cov // Runs tests and generates a coverage report
  - npm run test:debug // Runs Jest in debug mode with Node.js inspector enabled
</pre>

### Folder Structure
<img width="740" height="943" alt="image" src="https://github.com/user-attachments/assets/5930af37-0d35-444d-ade3-b36d737003f2" />

### Swagger
<img width="1462" height="1332" alt="image" src="https://github.com/user-attachments/assets/333940a9-e195-4931-b93f-c56ab685a5a2" />


### Features
 - API documentation
 - Input validation with class-validator
 - Containerization
 - Unit tests

## Frontend

### Architecture
For the frontend, I opted for a feature-based architecture due to its simplicity, ease of use, and the decoupling it offers compared to the traditional React structure where components and interfaces are often tightly coupled.

#### Feature Based Architecture
Feature-based architecture is a software design approach where the project structure is organized around specific functionalities or features, rather than technical layers.

<strong> Commands </strong>
<pre>
  - npm run dev // Starts the frontend in development mode using Vite
  - npm run build // Compiles TypeScript and builds the project using Vite
  - npm run lint // Runs ESLint to check for linting issues
  - npm run preview // Serves the production build locally using Vite
  - npm run test // Runs all tests using Vitest
  - npm run test:ui // Opens the Vitest UI for interactive testing
  - npm run test:coverage // Runs tests and generates a coverage report
  - npm run storybook // Starts Storybook on port 6006 for UI component development
  - npm run build-storybook // Builds the static Storybook for production
</pre>

### Folder Structure
<img width="755" height="818" alt="image" src="https://github.com/user-attachments/assets/5c6bb3dd-d67a-46eb-87a1-829829309356" />

### Storybook
<img width="2556" height="562" alt="image" src="https://github.com/user-attachments/assets/6ad3d577-7056-411b-9f11-b017b511024f" />

### Features
  - Component documentation with Storybook
  - Containerization
  - Unit tests

<h2>Final Notes</h2>

How was it developed?
I focused on decoupling components on the frontend, writing unit tests, input validations, and implementing the required features as described in the challenge. I also compared results against the documentation to ensure correctness.

### Challenges
- Understanding the amortization calculation
- Verifying amortization values to ensure accuracy
- Frontend testing (I’m a bit out of practice)
- Bringing clean architecture and containerization into a single-day project

### Possible Improvements
- Add realistic scenarios and graphs for amortization as seen in the provided documentation
- Introduce more advanced design patterns as the project grows
- Benchmark performance to evaluate the use of memoized functions and classes
- Create smaller, custom, reusable components for the frontend, such as input and button
- Add observability
- Implement production deployment logic
- Add automated tests for the most critical user flows, both frontend and backend
- Implement regression tests on the frontend
- Implement load testing
- Implement end-to-end testing
- Create a token system for translation support
- Add a notification system (Toaster) for errors and alerts
