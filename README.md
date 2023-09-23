# Task Manager App

Task Manager App is a web application that allows users to manage their tasks efficiently. It provides features such as task creation, task status tracking, user registration, and authentication.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)

## Features

- User Registration: Users can create accounts with a valid email address and password.
- User Authentication: Registered users can log in securely using their credentials.
- Task Management: Users can create, update, delete, and view their tasks.
- Task Status Tracking: Tasks can be marked as "To Do," "In Progress," or "Completed."
- User Profile: Users can view and edit their profile information like username and email.

## Getting Started

### Prerequisites

- Node.js and npm installed on your local machine.
- MongoDB installed and running locally or a remote MongoDB database URI.
- An active internet connection for fetching dependencies.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/task-manager-app.git

2. Change into the project directory:

    ```bash
    cd task-manager-app
   
3. Install dependencies:

    ```
    npm install

4. Create a .env file in the project root directory and configure your environment variables. You will need to set variables like MONGODB_URI, JWT_SECRET .Example .env file:

    MONGODB_URI=mongodb://localhost:27017/task-manager
    JWT_SECRET=your-secret-key
    COOKIE_SECRET=another-secret-key

5. Start your application

    ```bash
    npm run dev

The app should now be running on http://localhost:3000.

## Usage

- Open a web browser and access the application at http://localhost:3000.
- Register for an account or log in if you already have one.
- Create, manage, and track your tasks on the dashboard.
- Customize your profile information in the settings.

## API Endpoints

The application provides the following API endpoints for managing tasks and user details:

- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Log in an existing user.
- POST /api/auth/logout: Log out the authenticated user.
- GET /api/tasks: Fetch all tasks for the authenticated user.
- POST /api/tasks: Create a new task for the authenticated user.
- GET /api/tasks/:taskId: Fetch a specific task by ID.
- PUT /api/tasks/:taskId: Update a specific task by ID.
- DELETE /api/tasks/:taskId: Delete a specific task by ID.
- GET /api/user: Fetch user details for the authenticated user.
- PUT /api/user: Update user details for the authenticated user.

## Technologies Used

- Node.js: Backend server environment.
- Express.js: Web application framework.
- MongoDB: Database for storing task and user data.
- Next.js: React framework for building the user interface.
- Tailwind CSS: CSS framework for styling.


