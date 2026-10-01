# Customer Feedback UI

Angular frontend for the customer feedback app. Register, log in, submit feedback, and (if you are admin) open the admin page.

This talks to the Spring Boot API. Start the backend first. It should be running at http://localhost:8080.

## Requirements

- Node.js and npm

## Run

From this folder:

```
npm install
npm start
```

Open http://localhost:4200

## Pages

- `/login` — login
- `/register` — create a user account
- `/feedback` — add, view, and edit your own feedback
- `/admin` — all feedback. Only the admin can open this and delete feedback.

Default admin (created by the backend on first run):

- username: `admin`
- password: `admin123`

## Build

```
npm run build
```

Output goes to the `dist` folder.
