const userInput = document.getElementById("user-input");
const checkBtn = document.getElementById("check-btn");
const clear = document.getElementById("clear-btn");
const resultsDiv = document.getElementById("results-div");

const validateNumber = (number) => /^(\+?)(1\s?)?(\d{3}|\(\d{3}\))[\s\-]?\d{3}[\s\-]?\d{4}$/gm.test(number);

const returnResult = () => {
    if (userInput.value === "") {
        alert("Please provide a phone number");
        return;
    }

    if (validateNumber(userInput.value)) {
        resultsDiv.textContent = `Valid US number: ${userInput.value}`;
        resultsDiv.style.color = "green";
    } else {
        resultsDiv.textContent = `Invalid US number: ${userInput.value}`;
        resultsDiv.style.color = "red";
    }
};

userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        returnResult();
    }
});

// Check input logic
checkBtn.addEventListener("click", returnResult);

// Clear input logic
clear.addEventListener("click", () => {
    userInput.value = "";
    resultsDiv.textContent = "";
});
