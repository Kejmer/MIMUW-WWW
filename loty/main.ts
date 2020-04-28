let fail_modal = document.querySelector('#fail_modal') as HTMLDivElement;
let modal_msg = document.querySelector('#fail_modal #modal-message') as HTMLParagraphElement;
let fname = document.querySelector('input[name=fname]') as HTMLInputElement;
let lname = document.querySelector('input[name=lname]') as HTMLInputElement;
let fdate = document.querySelector('input[name=flight-date]') as HTMLInputElement;
let sbtn = document.querySelector('input[type=submit]') as HTMLInputElement;

sbtn.addEventListener("click", (e:Event) => checkForm(e));
fail_modal.addEventListener("click", (e:Event) => hideFormMsg());

function checkForm(e:Event) {
  let date: Date = new Date(fdate.value);
  let now: Date = new Date();


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
