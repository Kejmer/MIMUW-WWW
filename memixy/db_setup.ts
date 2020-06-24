import * as sqlite from "sqlite3";
import {memesInit} from "./memy";
import {usersInit} from "./login";
import {openDB} from "./db_handler"

sqlite.verbose();

function dbSetup() {
  let db = openDB();
  console.log("START");
  db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' AND name IN ('memes', 'history', 'users');`, (err, rows) => {
    if (err) throw err;

    if (rows[0].cnt === 3) {
      console.log('Database tables already exist.');
      return;
    }

    console.log('Creating database tables...');
    db.serialize(() => {
      db.run(`
        CREATE TABLE history (
          meme_id INTEGER NOT NULL,
          price INTEGER NOT NULL,
          created_at REAL NOT NULL,
          author TEXT
        )
        `, [], (err: any) => {
          if (err) throw err;
        });
      db.run(`
        CREATE INDEX history_time_idx
          ON history(created_at)
        `, [], (err: any) => {
          if (err) throw err;
      });
      db.run(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          username TEXT UNIQUE,
          hashed_pass TEXT
        )
        `, [], (err: any) => {
          if (err) throw err;
      });
      db.run(`
        CREATE TABLE memes (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          url TEXT NOT NULL,
          price INTEGER NOT NULL,
          last_updator TEXT
        )`
        , [], (err: any) => {
          if (err) throw err;
        });
      db.close(() => {
        console.log('Done.');
        usersInit();
        memesInit();
      });
    });
  });
}



dbSetup()