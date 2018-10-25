const express        = require('express');
const axios          = require('axios');
const bodyParser     = require('body-parser');
const cors           = require('cors');
const app            = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );
app.use(cors());


const port = process.env.PORT || 5000;





app.listen(port, () => {
  console.log('We are live on the ' + port);
});


app.get('/', getBussesFromTransLink);




function getBussesFromTransLink(req, response) {
  let routesFilter = "";
  if(req && req.query && req.query.route){
    routesFilter = "&routeNo="+req.query.route;
  }
  axios.get("https://api.translink.ca/rttiapi/v1/buses?apikey=tkODCAj46hdAoH9XO9Ml" + routesFilter, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(res => {
    response.send(res.data);
  })
  .catch(err => {
    response.send(err.response.data);
  });
}
