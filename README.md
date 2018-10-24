# Translink API

This Web App displays Translink bus locations across Vancouver. It updates Bus locations every 5 seconds. Uses Heroku Node.js as a backend to solve CORS problem with TransLink API. Can also host server locally by downloading the this repository and going into the **node_server** folder, running npm install and npm start. Then change **src/config/config.js** NODE_API_LINK to **"http://localhost:5000"**.

## Deployed Website
ladoli-translink.netlify.com



# Questions
## What new technologies did you learn to complete this challenge?
I've touched upon MobX, mobx-react, Axios on server side (Node.js), react-map-gl, TypeScript, DefinitelyTyped, Learned how to deploy Node.js to Heroku
Refreshed myself on the problem of CORS.

## Was there anything you found specifically challenging or time consuming?
Fixing issues and getting familiar with TypeScript, Getting Translink API to work (due to CORS), MobX inject issues with mobx-react
