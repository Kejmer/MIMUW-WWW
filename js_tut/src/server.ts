import {createServer} from 'http';

let server = createServer(
  (req, res) => {
    res.write(req.url);
    res.end();
  }
);

server.listen(8080);