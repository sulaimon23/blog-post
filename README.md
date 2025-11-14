# Idle Timeout on Deployed URL
  NOte: Server can sleep....

## Running the Application

### Prerequisites

- Docker and Docker Compose installed
- Make (optional, for using Makefile commands)

### Using Docker

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file if you need to change default ports or configuration.

2. **Start the application:**
   ```bash
   make dev
   ```
   This starts both applications with hot reload - changes are automatically reflected without rebuilding.

   Or run in background:
   ```bash
   make up
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000 (or the port specified in `.env`)
   - Backend API: http://localhost:3001 (or the port specified in `.env`)

4. **View logs:**
   ```bash
   make logs
   ```

5. **Stop the application:**
   ```bash
   make down
   ```

6. **Clean up:**
   ```bash
   make clean
   ```

### Makefile Commands

- `make dev` - Start application with hot reload
- `make up` - Start containers in background
- `make down` - Stop containers
- `make logs` - View container logs
- `make clean` - Remove containers and images

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=production
BACKEND_PORT=3001
FRONTEND_PORT=3000
DB_PATH=./data.db
VITE_API_BASE_URL=http://localhost:3001
```

For Docker deployment, ensure `VITE_API_BASE_URL` points to your backend URL (e.g., `http://localhost:3001` or your production backend URL).


# Web Developer Assignment

This full-stack assignment involves building a user management system where developers must extend a Node.js/SQLite backend for user and post operations, and create a React/TypeScript frontend that displays user data in a paginated table and allows for post management, all while following provided design specifications.


## Backend

### Provided Backend

A Node server written in TypeScript is provided.
The server utilizes an SQLite database (data.db) containing all relevant data, including users posts and addresses.
The server exposes several partial RESTful API endpoints:

User Endpoints:
- `GET /users` -  Returns a list of users with pagination support. (e.g., /users?pageNumber=0&pageSize=10).
- `GET /users/count` - Returns the total number of users.
Post Endpoint:
- `GET /posts` - Returns posts filtered by a specific user ID, using the userId query parameter (e.g., /posts?userId={userId}).

### Backend Requirements

You are required to implement the following backend functionalities:

- **Address to User**
  - Extend the existing user-related endpoints to include address (metadata associated with the user).
  - Query the address from the database and include them in the user response.
  - Ensure the address are properly validated and formatted before returning to the frontend.
- **Post Deletion**
  - Create an endpoint to delete a post by its ID.
  - Remove the post from the database upon successful deletion.
  - Return appropriate HTTP status codes and messages.
- **Add a New Post**
  - Create an endpoint to add a new post for a user, accepting **Title**, **Body**, and **User ID**.
  - Validate input data and handle errors.
  - Save the new post to the database upon success.

## Front-End

### General Requirements

- Implement the web UI using **TypeScript**, **React**, **React Query**, and **Tailwind CSS**.
- Follow the **Tailwind** and **shadcn/ui** design tokens (defined in Figma) for consistent styling.
- Follow the **Figma design** provided in the Resources section.
- Ensure **graceful handling of API errors** or unexpected data from the backend.
- Components and pages should have **error and loading states**.
- Emphasize **code reusability** and **separation of concerns** in your components.

### Users Table

- Set up an internal API that fetches a list of users from your backend API, using the pagination.
- Display the users in an organized table with the following features:
  - **Pagination**: Show 4 users per page.
  - **User Details**:
    - Full Name
    - Email Address
    - Address formatted as "street, state, city, zipcode". Keep the address column at 392px width and use ellipsis (...) for any overflow.

### User Posts

- When clicking on a user row, navigate to a new page that displays a list of the user's posts.
- Fetch the user's posts from your backend API.
- The page should include:
  - A header with a summary of the user and the number of posts.
  - A list of all posts (**no pagination required**).
  - Each post should display:
    - **Title**
    - **Body**
    - A **Delete** icon.
      - Clicking the Delete icon should delete the post via your backend API and update the UI accordingly.
  - An option to **add a new post**:
    - Include a button that opens a form to create a new post with **Title** and **Body** fields.
    - Upon submission, the new post should be saved via your backend API and appear in the list of posts without requiring a page refresh.
- Ensure the design is intuitive and posts are easily readable by closely following the provided Figma design.

## Guidelines

1. **State Management with React Query**
   - Use React Query to manage server state.
   - Ensure efficient data fetching, caching, and synchronization with the backend.
   - Utilize React Query's features to handle loading and error states.
2. **Code Reusability and Separation**
   - Structure your components to promote reusability and maintainability.
   - Abstract shared logic into custom hooks or utility functions where appropriate.
   - Follow best practices for component composition and props management.
3. **Responsiveness**
   - Ensure the application is responsive and functions well on various screen sizes and devices.
   - Use Tailwind CSS utilities to create responsive layouts.
4. **Error Handling**
   - Implement robust error handling for API requests and unexpected data.
   - Provide meaningful feedback to the user in case of errors.
   - Use try-catch blocks and handle promise rejections appropriately in your backend.

## Resources

- **Backend Server**: A partially implemented Node server in TypeScript will be provided. You are expected to complete the specified backend functionalities.
- **SQLite Database**: The backend uses the `data.db` SQLite database, which contains all necessary data.
- **Figma Design**: Follow the design specifications outlined in the provided Figma file.
  [Figma Design for Web UI](https://www.figma.com/design/Wkbz27sGWBOFMDocOck4mm/Full-Stack-Developer-Assignment?node-id=0-1&node-type=canvas&t=zK4X8qKaPmxu84XZ-0)

## Deliverables

- A full-stack application that meets the above requirements.
- Source code organized and documented for readability.
- Completed backend functionalities as specified.
- At least one unit test demonstrating testing of a component or functionality.
- Instructions on how to run the application locally, including setting up the backend and frontend.

## Submission Instructions

- **Code Repository**: Provide access to your code via a Git repository (e.g., GitHub, GitLab).
- **Readme File**: Include a `README.md` file with instructions on how to install dependencies, set up the database, run migrations (if any), and start both the backend and frontend servers.
