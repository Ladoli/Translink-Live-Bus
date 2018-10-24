# Translink API

This Web App displays Translink bus locations across Vancouver. It updates Bus locations every 5 seconds but this can be changed by modifying the config file. Uses Heroku Node.js as a backend to solve CORS problem with TransLink API. Can also host server locally by downloading the this repository and going into the **node_server** folder, running npm install and npm start. Then change **src/config/config.js** NODE_API_LINK to **"http://localhost:5000"**.

## Deployed Website
http://ladoli-translink.netlify.com

There may be a delay initially loading the site due to using Heroku as a backend.

# Questions
## What new technologies did you learn to complete this challenge?
I've touched upon MobX, mobx-react, Axios on server side (Node.js), react-map-gl, TypeScript, DefinitelyTyped, Learned how to deploy Node.js to Heroku, Learned differences of using Yarn to deploy to Netlify... and refreshed myself on the problem of CORS.

## Was there anything you found specifically challenging or time consuming?
Fixing issues and getting familiar with TypeScript took most of my time along with getting Translink API to work (due to CORS). MobX also had inject issues with mobx-react. I also had some difficulties using Yarn with Netlify deployment.
