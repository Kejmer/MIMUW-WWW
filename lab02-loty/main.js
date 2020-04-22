var el = document.querySelector("input[name=fname]");
console.log(el);
var nowyElement = document.createElement("div");
nowyElement.innerText = "WOW TO DZIALA";
nowyElement.classList.add("middle", "big");
document.querySelector("body").appendChild(nowyElement);
