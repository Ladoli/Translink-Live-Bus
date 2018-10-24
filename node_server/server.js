const express        = require('express');
const axios          = require('axios');
const bodyParser     = require('body-parser');
const cors           = require('cors');
const app            = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );
app.use(cors());


const port = 5000;





app.listen(port, () => {
  console.log('We are live on the ' + port);
});


app.get('/', getFromTransLink);




function getFromTransLink(req, response) {
  axios.get("https://api.translink.ca/rttiapi/v1/buses?apikey=tkODCAj46hdAoH9XO9Ml", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(res => {
    response.send(res.data);
  })
  .catch(err => {
    console.log(err);
  });



}
