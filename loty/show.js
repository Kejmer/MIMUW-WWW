var passengers = document.querySelectorAll(".passenger-list > li");
var biggest = "";
// function sprawdzDaneLiniiLotniczej(dane: any): dane is ILiniaLotnicza
function isPassenger(object) {
    return object.getAttribute("data-indetyfikator-pasazera") !== "undefined";
}
var passIdArr = [];
passengers.forEach(function (child) {
    if (isPassenger(child))
        passIdArr.push(child.dataset.identyfikatorPasazera);
});
passIdArr.sort().reverse();
console.log(passIdArr[0]);
// for(let child of passengers) {
//   // if (biggest < child.dataset.indentyfikatorPasazera) {
//     biggest = child;
//     console.log(child);
//     // console.log(child.dataset.identyfikatorPasazera);
//   // }
// }
// alert(biggest);
