let modal_msg = document.querySelector('#fail_modal #modal-message') as HTMLParagraphElement;
let dest  = document.querySelector('select[name=destination]') as HTMLInputElement;
let fdate = document.querySelector('input[name=flight-date]') as HTMLInputElement;
let sbtn  = document.querySelector('input[type=submit]') as HTMLInputElement;
let fname = document.querySelector('input[name=fname]') as HTMLInputElement;
let lname = document.querySelector('input[name=lname]') as HTMLInputElement;
let from  = document.querySelector('select[name=from]') as HTMLInputElement;
let fail_modal = document.querySelector('#fail_modal') as HTMLDivElement;

fail_modal.addEventListener("click", (e:Event) => hideFormMsg());
sbtn.addEventListener("click", (e:Event) => checkForm(e));

function validName() : boolean {
  return fname.value != "" && lname.value != "";
}

function existDate() : boolean {
  return fdate.value != "";
}

function validDate() : boolean {
  const date: Date = new Date(fdate.value);
  const now: Date = new Date();
  return existDate() && (date > now || date.toDateString() == now.toDateString());
}

function validFlight() : boolean {
  return from.value != "" && dest.value != "" && dest.value != from.value;
}

function validForm() {
  return validDate() && validName() && validFlight();
}

function checkForm(e:Event) {

  if (validName()) {
    failFormMsg("Proszę wypełnić pola z imieniem i nazwiskiem!", e);
    return;
  }
  if (existDate()) {
    failFormMsg("Proszę podać datę wylotu!", e);
    return;
  }
  if (validDate()) {
    failFormMsg("Nie sprzedajemy lotów w przeszłość!", e);
  }
}

function failFormMsg(s:string, e?:Event) {
  fail_modal.classList.remove('hidden');
  modal_msg.innerHTML = s;
  if (e !== undefined)
    e.preventDefault();
}

function hideFormMsg() {
  fail_modal.classList.add('hidden');
}

let nowyElement = document.createElement("div");
nowyElement.innerText = "WOW TO DZIALA";
nowyElement.classList.add("middle", "big")
document.querySelector("body").appendChild(nowyElement);


setTimeout(() => {
  console.log('Minęły dwie sekundy');
}, 2000);

function wait(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

async function rainbowColors(el: HTMLElement) {
  console.log('kolorki');
  const colors = ['red', 'orange', 'yellow', 'blue', 'indigo', 'purple'];
  for (const color of colors) {
    await wait(1000);
    // console.log(color);
    el.style.background = color;
  }
}

let footer = document.querySelector('footer') as HTMLElement;
rainbowColors(footer);

interface Commit {
  author: {
    avatar_url: string;
  }
}
function isCommit(object: any): object is Commit {
  if (object.author === undefined)
    return false;
  return object.author.avatar_url !== undefined;
}

function getPhoto(commit: Commit): string {
  return commit.author.avatar_url;
}

interface Photo {
  src: string;
}

function isPhoto(object: any): object is Photo {
  return object.src !== undefined;
}

let commit : Commit;
let ceo_container = document.querySelector("#ceo-container") as HTMLDivElement;
let photo : HTMLElement;

fetch('https://api.github.com/repos/Kejmer/MIMUW-WWW/commits')
  .then(response => response.json())
  .then(data => {
    commit = data[0];
    if (isCommit(commit)) {
        photo = document.createElement('IMG');
        photo.classList.add("small-img");
        if (isPhoto(photo))
          photo.src = getPhoto(commit);
    }
    else {
        photo = document.createElement('p');
        photo.innerText = "No photo provided";
    }
    ceo_container.appendChild(photo);
  }
 );


// KROK 7

function randomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

let right_col = document.querySelector('#delayed-flights') as HTMLElement;
let form = document.querySelector('#delayed-flights form') as HTMLElement;
let table = document.querySelector('#opoznienia') as HTMLElement;


right_col.addEventListener("click", (e:Event) => rightBackground2(e));

//używając event.target
function rightBackground(e: Event) {
  let node = e.target as Node;
  if (node.contains(table) || node.contains(form))
    right_col.style.backgroundColor = randomColor();
}

//nie używając
let clicksCntr = 0;

form.addEventListener("click", (e:Event) => {
  e.stopPropagation();
});

async function rightBackground2(e: Event) {
  clicksCntr++;
  console.log(fib(clicksCntr * 10));
  right_col.style.background = randomColor();
}

//fibonaci

let fibMem = {};
function fib(i: number) : number {
  if (i in fibMem)
    return fibMem[i];
  if (i < 2)
    return i;
  fibMem[i] = fib(i-1) + fib(i-2);
  return fibMem[i];
}

// obsługa submit

function checkSubmit() {
  sbtn.disabled = !validForm();
}
checkSubmit();

form.onchange = () => checkSubmit();