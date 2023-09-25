# Getting Started with DQM Webapp - Backend

The Data Quality Monitor frontend is developed in React using Typescript language. DQM frontend is served by backend APIs. These APIs are also developed in Typescript.

## Local Development
To get started with local development, follow these steps:
* Clone the repository using the following command:
    ```
    git clone https://github.com/google/data-quality-monitor.git
    ```
* Install the frontend dependencies by navigating to the `webapp/backend` directory and running:
    ```
    cd webapp/backend
    npm install
    npm run build-dev
    ```
* Start the backend by running:
    ```
    npm run dev
    ```
This command runs the app in development mode, and you can access your backend APIs at this path: http://localhost:5000/....



## Swagger

All the backend APIs are documented here at this URL after successful build.
http://localhost:5000/docs/


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

### To run the app in Google Appengine

Run the following command to start the backend in production environment:
```
npm run start
```


## License

**This is not an officially supported Google product.**

Copyright 2023 Google LLC. This solution, including any related sample code or data, is made available on an "as is", "as available", and "with all faults" basis, solely for illustrative purposes, and without warranty or representation of any kind. This solution is experimental, unsupported and provided solely for your convenience. Your use of it is subject to your agreements with Google, as applicable, and may constitute a beta feature as defined under those agreements. To the extent that you make any data available to Google in connection with your use of the solution, you represent and warrant that you have all necessary and appropriate rights, consents and permissions to permit Google to use and process that data. By using any portion of this solution, you acknowledge, assume and accept all risks, known and unknown, associated with its usage, including with respect to your deployment of any portion of this solution in your systems, or usage in connection with your business, if at all.
