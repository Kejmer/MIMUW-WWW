let el = document.querySelector("input[name=fname]");
console.log(el);
let nowyElement = document.createElement("div");
nowyElement.innerText = "WOW TO DZIALA";
nowyElement.classList.add("middle", "big")
document.querySelector("body").appendChild(nowyElement);
