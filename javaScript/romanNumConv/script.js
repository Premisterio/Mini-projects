const inputElement = document.getElementById("number");
const convertBtn = document.getElementById("convert-btn");
const resultElement = document.getElementById("output");

const romanNumerals = [
  { value: 1000, numeral: "M" },
  { value: 900, numeral: "CM" },
  { value: 500, numeral: "D" },
  { value: 400, numeral: "CD" },
  { value: 100, numeral: "C" },
  { value: 90, numeral: "XC" },
  { value: 50, numeral: "L" },
  { value: 40, numeral: "XL" },
  { value: 10, numeral: "X" },
  { value: 9, numeral: "IX" },
  { value: 5, numeral: "V" },
  { value: 4, numeral: "IV" },
  { value: 1, numeral: "I" }
];

function convertToRoman(number) {
  let result = "";

  for (const { value, numeral } of romanNumerals) {
    while (number >= value) {
      result += numeral;
      number -= value;
    }
  }
  return result;
}


function returnResult() {
    const number = parseInt(inputElement.value);
    
    if (isNaN(number)) {
        resultElement.innerText = "Please enter a valid number";
    } else if (number < 1) {
        resultElement.innerText = "Please enter a number greater than or equal to 1";
    } else if (number > 3999) {
        resultElement.innerText = "Please enter a number less than or equal to 3999";
    } else {
        const romanNumeral = convertToRoman(number);
        resultElement.innerText = romanNumeral;
    }
}

convertBtn.addEventListener("click", returnResult);
inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {5
        returnResult();
    }
});