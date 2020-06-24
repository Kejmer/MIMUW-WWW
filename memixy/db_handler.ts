import * as sqlite from "sqlite3";

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function openDB() : sqlite.Database {
  let db = new sqlite.Database('memes.db');
  // db.run("PRAGMA journal_mode = WAL")
   // db.configure("busyTimeout", 6000);
  db.run("PRAGMA busy_timeout = 10000");
  return db;
}

export function dbRun(db : sqlite.Database, query: string, params : any[]) : Promise<void> {
  return new Promise((res, rej) => {
    db.run(query, params, (err) => {
      if (err) rej(err);
      // if(err) throw err;
      else res();
    })
  })
}

export function dbBegin(db : sqlite.Database) : Promise<void> {
  return dbRun(db, "BEGIN", []);
}

export function dbEnd(db : sqlite.Database) : Promise<void> {
  return dbRun(db, "END", []);
}

export function dbClose(db : sqlite.Database) : Promise<void> {
  return new Promise((res, rej) => {
    db.close((err) => {
      if (err) rej(err);
      else res();
    })
  })
}