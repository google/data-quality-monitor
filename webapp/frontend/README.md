# Getting Started with DQM Webapp - Frontend

The Data Quality Monitor frontend is developed in React using Typescript language. The frontend webapp is created using Google's Material UI framework. Webapp consists of frontend and backend.

## Local Development
To get started with local development, follow these steps:
* Clone the repository using the following command:
    ```
    git clone https://github.com/google/data-quality-monitor.git
    ```
* Install the frontend dependencies by navigating to the `webapp/frontend` directory and running:
    ```
    cd webapp/frontend
    npm install
    ```
* Make a copy of `.env.example` file and save it as `.env.dev`. Set the environment variables for your development environment.

* Start the frontend by running:
    ```
    npm run dev
    ```

This command runs the app in development mode, and you can access it in your web browser at http://localhost:3000.

## Linting
You can run linting on the project using the following command:
```
npm run lint
```

## Fixing Lint Issues
To automatically fix linting issues, run the following command:
```
npm run fix
```

## Building for Production
To build the web application for production, use the following command:
```
npm run build
```

This will create a production-ready build in the build folder. The build process optimizes the application for performance, including minification and file hashing.

Your application is now prepared for deployment!

## Deploying to Google App Engine
For deploying the production build to Google App Engine, use the following command:
```
npm run gcp-build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.\
Your app is ready to be deployed!

This command is specifically tailored for deploying the application on Google App Engine.