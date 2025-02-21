let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");


// Alerts:
// - If cash input is less than the price, alert the user.
// - If there's not enough cash in the drawer, display "Status: INSUFFICIENT_FUNDS"
// - If the cash in the drawer matches exactly the change due, display "Status: CLOSED"
// - Otherwise, return change in highest-to-lowest denominations with "Status: OPEN"


const handlePurchase = () => {
  const cashGiven = parseFloat(cash.value);

  if (isNaN(cashGiven) || cashGiven < price) {
    alert('Customer does not have enough money to purchase the item');
    return;
  }
  calculateChange(cashGiven);
};

// fix this 
const calculateChange = (cashGiven) => {
  let changeDue = Math.round((cashGiven - price) * 100);
  let totalCID = Math.round(cid.reduce((sum, [, amount]) => sum + amount, 0) * 100);

  if (totalCID < changeDue) {
    changeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  // doesn't work
  if (totalCID === changeDue) {
    changeDue.innerHTML = '<p>Status: CLOSED</p>';
    // No change due - customer paid with exact cash
    return;
  }

  // TODO: Implement logic to return change in the correct denominations
  // change innerHTML to textContext
};

purchaseBtn.addEventListener("click", handlePurchase);
cash.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handlePurchase()
});
