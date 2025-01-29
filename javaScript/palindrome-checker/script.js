// the code must to remove all non-alphanumeric characters (punctuation, spaces and symbols) and turn everything into the same case (lower or upper case) in order to check for palindromes.
// remove hidden class to display the result

// get the elements
const palindromeForm = document.getElementById("palindrome-form");
const textInput = document.getElementById("text-input");
const checkBtn = document.getElementById("check-btn");
const result = document.getElementById("result");

function checkPalindrome() {
  const inputValue = textInput.value;
  if (inputValue === "") {
    alert("Please enter a value!");
    return;
  }
  const cleanedInput = inputValue.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(); 
  const isPalindrome = cleanedInput === cleanedInput.split("").reverse().join("");
  return isPalindrome;
}

function returnResult() {
    const isPalindrome = checkPalindrome();
    if (textInput.value === "") {
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
