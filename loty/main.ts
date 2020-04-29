let fail_modal = document.querySelector('#fail_modal') as HTMLDivElement;
let modal_msg = document.querySelector('#fail_modal #modal-message') as HTMLParagraphElement;
let fname = document.querySelector('input[name=fname]') as HTMLInputElement;
let lname = document.querySelector('input[name=lname]') as HTMLInputElement;
let fdate = document.querySelector('input[name=flight-date]') as HTMLInputElement;
let sbtn = document.querySelector('input[type=submit]') as HTMLInputElement;

sbtn.addEventListener("click", (e:Event) => checkForm(e));
fail_modal.addEventListener("click", (e:Event) => hideFormMsg());

function checkForm(e:Event) {
  const date: Date = new Date(fdate.value);
  const now: Date = new Date();

  if (fname.value == "" || lname.value == "") {
    failFormMsg("Proszę wypełnić pola z imieniem i nazwiskiem!", e);
    return;
  }
  if (fdate.value == "") {
    failFormMsg("Proszę podać datę wylotu!", e);
    return;
  }
  if (date < now && date.toDateString() !== now.toDateString()) {
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
        console.log("No photo provided");
    }
    ceo_container.appendChild(photo);
  }
 );


console.log("Pe");