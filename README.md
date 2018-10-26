# Translink API

This Web App displays Translink bus locations across Vancouver. It updates Bus locations every 5 seconds but this can be changed by modifying the config file. Uses Heroku Node.js as a backend to solve CORS problem with TransLink API. Can also host server locally by downloading the this repository and going into the **node_server** folder, running npm install and npm start. Then change **src/config/config.js** NODE_API_LINK to **"http://localhost:5000"**.

# Deployed Website
http://ladoli-translink.netlify.com

There may be a delay initially loading the site due to hosting the backend with Heroku.


# Disclaimer:
Some of the data used in this product or service is provided by permission of TransLink. TransLink assumes no responsibility for the accuracy or currency of the Data used in this product or service.
