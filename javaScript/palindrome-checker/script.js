const textInput = document.getElementById("text-input");
const checkBtn = document.getElementById("check-btn");
const result = document.getElementById("result");

function checkPalindrome() {
  const cleanedInput = textInput.value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(); 
  const isPalindrome = cleanedInput === cleanedInput.split("").reverse().join("");
  return isPalindrome;
}

function returnResult() {
    const isPalindrome = checkPalindrome();
    if (textInput.value === "") {
        setTimeout(() => {
            alert("Please input a value");
        }, 100);
        return;
    } else if (isPalindrome) {
        result.classList.remove("hidden");
        result.textContent =`${textInput.value} is a palindrome!`;
    } else {
        result.classList.remove("hidden");
        result.textContent =`${textInput.value} is not a palindrome!`;
    }
};

checkBtn.addEventListener("click", returnResult);
textInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        returnResult();
    }
});