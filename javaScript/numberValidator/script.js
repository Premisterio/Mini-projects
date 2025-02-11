const input = document.getElementById("user-input");
const check = document.getElementById("check-btn");
const clear = document.getElementById("clear-btn");
const result = document.getElementById("results-div");


const validateNumber = (number) => /^(\+?)(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/gm.test(number); // goofy ahh regex 

console.log(validateNumber("1223-456-7890")); // works ig




// Clear input logic
clear.addEventListener("click", () => {
    input.value = "";
    result.textContent = "";
});


// checkBtn.addEventListener("click", returnResult);
// textInput.addEventListener("keydown", (event) => {
//     if (event.key === "Enter") {
//         returnResult();
//     }
// });