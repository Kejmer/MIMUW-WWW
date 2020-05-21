import {createServer, IncomingMessage, ServerResponse} from 'http';
import * as sqlite3 from "sqlite3";

const db_name = 'stats.db';

interface MyFile {
  name: string,
  counter: number
}

function isMyFile(obj: any) : obj is MyFile {
  return !(obj.name === undefined || obj.counter === undefined );
}

dbSetup();
let server = createServer(
  (req, res) => {
    res.statusCode = validateURL(req.url);
    if (res.statusCode != 200) {
      res.write("BAD REQUEST");
      res.end();
    }
    else
      handleRequest(req.url).then((val) => {
        res.write(val);
        res.end();
      });
  }
);
server.listen(8080);

function validateURL(url: string) : number {
  if (url.split('/').length != 2 || url.length <= 1)
    return 404;
  return 200;
}

async function handleRequest(path: string) {
  path = path.substring(1);
  if (path == 'statystyki')
    return await statsIndex();
  return singleFile(path);
}

function statsIndex() : Promise<string> {
  return getStats().then((val) => {
    return val;
  });
}

function dbSetup() {
  sqlite3.verbose();
  let db = new sqlite3.Database(db_name);
  db.get('SELECT name FROM sqlite_master WHERE type="table" AND name = "activity"', [], (err, row) => {
    errHandler(err);
    if (!row)
      db.run('CREATE TABLE activity (name VARCHAR(255) PRIMARY KEY, counter INT);');
  });
  db.close();
}

let errHandler = (err) => {
  if (err) throw(err);
}

function updateCounter(file: string) {
  sqlite3.verbose();
  let db = new sqlite3.Database(db_name);
  db.get('SELECT counter FROM activity WHERE name = ?;', [file], (err,row) => {
    errHandler(err);
    let counter = !!row ? row.counter : 0;
    db.run('REPLACE INTO activity (name, counter) VALUES (?, ?);', [file, counter + 1], errHandler);
    db.close();
  });
}

function getStats(): Promise<string> {

  sqlite3.verbose();
  let db = new sqlite3.Database(db_name);
  return new Promise((res, rej) => {
    db.all('SELECT name, counter FROM activity;', [], (err, rows) => {
      if (err) rej(err);
      let stats = "";

      for (let {name, counter} of rows) {
        stats += name + ": " + counter + '\n';
      }
      db.close();
      res(stats);
    });
  });
}

import * as fs from 'fs';

function singleFile(file: string) : Promise<string> {
  updateCounter(file);
    return new Promise((res, rej) => {
      try {
        var contents = fs.readFileSync(file, 'utf8');
        res(contents);
      } catch(err) {
        res("Plik nie ma miejsca w tym systemie")
      }
  });
}
