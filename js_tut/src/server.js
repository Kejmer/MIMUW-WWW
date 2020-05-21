import { createServer } from 'http';
let server = createServer((req, res) => {
    res.write('Ale super serwer!!!');
    res.end();
});
server.listen(8080);
