const http = require('http');
const fs = require('fs');

const port = 4445;

const server = http.createServer((req, res) => {

    console.log(req.url);
    console.log(req.method);

    switch (true) {
        case req.url === "/" && req.method === "GET":
            fs.readFile("./views/index.html", (err, file) => {
                res.setHeader("Content-Type", "text/html; charset=UTF-8");
                res.writeHead(200);
                res.end(file);
            });
            break;

        case req.url === "/favicon.ico" && req.method === "GET":
            fs.readFile('./favicon.ico', (err, file) => {
                res.setHeader('Content-Type', 'image/ico');
                res.writeHead(200);
                res.end(file);
            });
            break;
        case req.url === "/ferfi" && req.method === "GET":
            fs.readFile('./images/ferficipo.jpg', (err, file) => {
                res.setHeader('Content-Type', 'image/jpg');
                res.writeHead(200);
                res.end(file);
            });
            break;
        case req.url === "/noi" && req.method === "GET":
            fs.readFile('./images/noicipo.jpg', (err, file) => {
                res.setHeader('Content-Type', 'image/jpg');
                res.writeHead(200);
                res.end(file);
            });
            break;
        case req.url === "/cipok" && req.method === "GET":
            fs.readFile('./data/cipok.json', (err, file) => {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(file);
            });
           // console.log("JSON feladva");
            break;
        case req.url === "/script.js" && req.method === "GET":
            fs.readFile('./public/script.js', (err, file) => {
                res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');
                res.writeHead(200);
                res.end(file);
            });
            break;

            /*****************************/
        case req.url === "/ujcipo" && req.method === "POST":
            let data = '';
            res.writeHead(200);
            req.on('data', chunk => {
              data += chunk;
            })
            req.on('end', () => {
              //console.log(JSON.parse(data));
              fs.readFile("./data/cipok.json", (err, file) => {
                if (err) {
                    throw err;
                }
                console.log("file beolvasva");
                var fileParsedAsJson = JSON.parse(file);
                console.log("parsed json file: " + fileParsedAsJson);
                dataJsonParsed = JSON.parse(data);
                validateCipo(dataJsonParsed);

                var sanitizedData = SanitizeBody(dataJsonParsed);
                fileParsedAsJson.push(JSON.parse(sanitizedData));
                console.log("push done.");


                fs.writeFile("./data/cipok.json", JSON.stringify(fileParsedAsJson), (err) => {
                    if(err) {
                        console.log(err);
                    }
                    console.log(data + '\n\nSaved!');
                });
              });
              res.end(data);
            })
            break;
            /*******************/
        default:
            fs.readFile("/views/hiba.html", (err, file) => {
                res.setHeader('content-Type', 'text/html;charset=UTF-8');
                res.writeHead(404);
                res.end(file);
            });
            break;
    }
});

function sanitizeString(str) {
    return str.replace(/[^#a-z0-9_-\s\.,]/gim, "").trim();
}

function SanitizeBody(obj) {
    var counter = 0;
    var sanitized = "{";
        for (var key in obj){
          sanitized += "\""+sanitizeString(key)+"\" : ";
          sanitized += "\""+sanitizeString(obj[key])+"\"";
          counter++;
          if (Object.keys(obj).length !== counter) {
            sanitized+=","
          }
        }
      
     sanitized+="}";
     console.log(sanitized);
     return sanitized; 
}

function validateCipo(cipo){
if(cipo["tipus"] != "noi" && cipo["tipus"] != "ferfi"){throw new Error("Nem jó típus")};
if(cipo["meret"] <35 && cipo["meret"] > 48){throw new Error("Nem jó méret")};
if(cipo["ar"] <0 && cipo["ar"] > 1000000){throw new Error("Nem jó ár")};
}

server.listen(port);