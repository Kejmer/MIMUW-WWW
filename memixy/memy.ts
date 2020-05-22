

export default class Meme {
  private id: number;
  private name: string;
  private file_name: string;
  private price : number;
  private history : number[];


  constructor(id: number, name : string, file_name : string, price : number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.file_name = file_name;
    this.history = [price];
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getPrice() {
    return this.price;
  }

  getFileName() {
    return this.file_name;
  }

  getHistory() {
    return this.history.reverse();
  }

  setPrice(new_price: number) {
    if (this.price == new_price) return;
    this.price = new_price;
    this.history.push(new_price);
  }

  // save() {
  //   sqlite3.verbose();
  //   let db = new sqlite3.Database(db_name);
  //   db.get('SELECT price FROM memes WHERE id = ?', [this.id], (err, row) => {
  //     errHandler(err);
  //     if (row)
  //   });
  // }
}


export function memesInit() : Meme[] {
  let schema = [];
  let i = 1;
  schema.push(new Meme(i++, "42", "42.jpg", 42));
  schema.push(new Meme(i++, "Cyberksio", "cyberpunk.png", 13));
  schema.push(new Meme(i++, "Frontend", "frontend.png", 1023));
  schema.push(new Meme(i++, "Before and after", "math.jpg", 1));
  schema.push(new Meme(i++, "Teoria mnogosci", "mnogosc.jpg", 412));
  schema.push(new Meme(i++, "Piasek", "plaza.jpg", 551));
  schema.push(new Meme(i++, "Perspektywa bułki", "pov.png", 112));
  schema.push(new Meme(i++, "Papier toaletowy", "pqpi34.jpg", 152));
  schema.push(new Meme(i++, "Sratch chad", "scratch.png", 1020));
  schema.push(new Meme(i++, "Vim", "vim.png", 0));
  schema.push(new Meme(i++, "Bledy kompilacji", "znowu_oni.png", 1822));
  return schema;
}

export function getBest(memes: Meme[]) : Meme[] {
  function compare(a : Meme, b : Meme) {
    return b.getPrice() - a.getPrice();
  }

  return memes.sort(compare).slice(0,3);
}