var http = require('http');
const https = require("https");
const _ = require('lodash');

// Setup Figma authentication token
const headers = {
    'X-Figma-Token':'183-86cafbe3-09c3-4aa1-aa31-949db308fc62'
}
// Pass in parameters for the Figma API call
const options = {
  hostname: 'api.figma.com',
  path: '/v1/files/WtymrNrGJUNsKAKjrbCDZ84Q',
  method: 'GET',
  headers: headers
};

var filteredItems = [];
var finalItems = [];


var express = require('express');
var bodyParser     =        require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var server = require('http').createServer(app);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

const filterType = (needle, haystack) => {
    filteredItems = [];
    _.forEach(haystack, (item) => {
        if (_.includes(_.toLower(item.type), _.toLower(needle))) {
            filteredItems.push(item);
        }
        if (item.children) {
            item.children = filterType(needle, item.children);
        }
    });
}
function returnContent(rest) {
  _.forEach(filteredItems, (item) => finalItems.push({text:item.characters}));
  var reversed = finalItems.reverse();
  console.log(reversed);
  rest.send(reversed);
  reversed = [];
}
app.post('/getContent', function(req, rest){
  var url = req.body.url;
  if (url == undefined) {
    url = "/v1/files/WtymrNrGJUNsKAKjrbCDZ84Q";
  }
  else {
    url = "/v1/files/"+ url;
  }
  options.path = url;
  obj = [];

  // Make GET Http request call to Figma API
  https.get(options, res => {
    res.setEncoding("utf8");
    let json = "";
    res.on("data", data => {
      json += data;
    });
    res.on("end", () => {
      finalItems = [];
      var obj = JSON.parse(json);
      finalItems.push({image:obj.thumbnailUrl});
      filterType('text', obj);
      returnContent(rest);
    });
  });

});
