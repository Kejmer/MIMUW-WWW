var fail_modal = document.querySelector('#fail_modal');
var modal_msg = document.querySelector('#fail_modal #modal-message');
var fname = document.querySelector('input[name=fname]');
var lname = document.querySelector('input[name=lname]');
var fdate = document.querySelector('input[name=flight-date]');
var sbtn = document.querySelector('input[type=submit]');
sbtn.addEventListener("click", function (e) { return checkForm(e); });
fail_modal.addEventListener("click", function (e) { return hideFormMsg(); });
function checkForm(e) {
    var date = new Date(fdate.value);
    var now = new Date();
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
function failFormMsg(s, e) {
    fail_modal.classList.remove('hidden');
    modal_msg.innerHTML = s;
    if (e !== undefined)
        e.preventDefault();
}
function hideFormMsg() {
    fail_modal.classList.add('hidden');
}
var nowyElement = document.createElement("div");
nowyElement.innerText = "WOW TO DZIALA";
nowyElement.classList.add("middle", "big");
document.querySelector("body").appendChild(nowyElement);
