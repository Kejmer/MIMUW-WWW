var passengers = document.querySelectorAll(".passenger-list > li");
var biggest = "";
// function sprawdzDaneLiniiLotniczej(dane: any): dane is ILiniaLotnicza
function isPassenger(object) {
    return object.getAttribute("data-indetyfikator-pasazera") !== "undefined";
}
passengers.forEach(function (child) {
    if (isPassenger(child))
        console.log(child.dataset.identyfikatorPasazera);
});
// for(let child of passengers) {
//   // if (biggest < child.dataset.indentyfikatorPasazera) {
//     biggest = child;
//     console.log(child);
//     // console.log(child.dataset.identyfikatorPasazera);
//   // }
// }
// alert(biggest);
