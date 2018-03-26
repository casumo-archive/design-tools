// Load the http module to create an http server.
var http = require('http');
const https = require("https");
const headers = {
    'X-Figma-Token':'183-86cafbe3-09c3-4aa1-aa31-949db308fc62'
}
const options = {
  hostname: 'api.figma.com',
  path: '/v1/files/WtymrNrGJUNsKAKjrbCDZ84Q',
  method: 'GET',
  headers: headers
};

var translateList = [];

// Create a server that invokes the `handler` function upon receiving a request
http.createServer(handler).listen(9999, function(err){
  if(err){
    console.log('Error starting http server');
  } else {
    console.log("Server running at http://127.0.0.1:9999/ or http://localhost:9999/");
  };
});

function getObjects(obj) {
    for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] == "object") {
          var newObj = obj[key];
          getObjects(newObj);
        }
        else {
          if(obj[key] == "TEXT") {
            translateList.push(obj.characters);
          }
        }
    }
  }
}

function handler(req, rest){
  translateList = [];
  list = [];
  obj = [];
  https.get(options, res => {
    res.setEncoding("utf8");
    let json = "";
    res.on("data", data => {
      json += data;
    });
    res.on("end", () => {
      var obj = JSON.parse(json);
      translateList.push(obj.thumbnailUrl);
      translateList.push(getObjects(obj.document.children[0].children[0].children));
      var list = translateList.reverse();
      rest.setHeader('Content-Type', 'text/html');
      rest.writeHead(200);
      console.log(list);
      var html = '<!doctype html> \
                  <html lang="en"> \
                  <head> \
                    <meta charset="UTF-8">  \
                    <title>Translator</title> \
                  </head> \
                  <body> \
                      <img src="'+ list[4] +'" style="float:left;"/> \
                      <ul style="list-style:none; margin-left:30px;">';
                      var arrayLength = list.length-1;
                      for (var i = 1; i < arrayLength; i++) {
                        html += '<li>'+list[i]+'</li>';
                      }

                  html += '</body> \
                  </html>';
      rest.end(html);
    });
  });
}
