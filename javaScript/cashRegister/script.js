const price = 1.87;
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

const denominations = [
  ['ONE HUNDRED', 10000],
  ['TWENTY', 2000],
  ['TEN', 1000],
  ['FIVE', 500],
  ['ONE', 100],
  ['QUARTER', 25],
  ['DIME', 10],
  ['NICKEL', 5],
  ['PENNY', 1]
];

const priceScreen = document.getElementById('price');
const cashDrawerDisplay = document.querySelector('.drawer-details');
const displayChangeDue = document.getElementById('change-due');
const cash = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');

function formatResult(status, change) {
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>` +
    change.map(([name, amount]) => `<p>${name}: $${amount}</p>`).join('');
}

function calculateChange(changeDue, cashInDrawer) {
  let change = [];
  for (let [name, value] of denominations) {
    let available = cashInDrawer[name];
    let amountToGive = Math.min(available, Math.floor(changeDue / value) * value);
    if (amountToGive > 0) {
      change.push([name, amountToGive / 100]);
      changeDue -= amountToGive;
    }
  }
  return changeDue === 0 ? change : null;
}

function checkCashRegister() {
  const cashInCents = Math.round(Number(cash.value) * 100);
  const priceInCents = Math.round(price * 100);

  if (cashInCents < priceInCents) {
    alert('Customer does not have enough money to purchase the item');
    cash.value = '';
    return;
  }

  if (cashInCents === priceInCents) {
    displayChangeDue.innerHTML = '<p>No change due - customer paid with exact cash</p>';
    cash.value = '';
    return;
  }

  let changeDue = cashInCents - priceInCents;
  let cashInDrawer = Object.fromEntries(cid.map(([name, amount]) => [name, Math.round(amount * 100)]));
  let totalCID = Object.values(cashInDrawer).reduce((sum, amount) => sum + amount, 0);

  if (totalCID < changeDue) {
    displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  let change = calculateChange(changeDue, cashInDrawer);

  if (!change) {
    displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  if (totalCID === changeDue) {

    let closedChange = cid
      .filter(([name, amount]) => amount > 0)
      .reverse();

    formatResult('CLOSED', closedChange);
  } else {
    formatResult('OPEN', change);
    updateCashDrawer(change);
  }
}

function updateCashDrawer(change) {
  change.forEach(([name, amount]) => {
    let target = cid.find(([denomination]) => denomination === name);
    if (target) {
      target[1] = parseFloat((target[1] - amount).toFixed(2));
    }
  });
  updateUI();
}

function updateUI() {
  cash.value = '';
  priceScreen.textContent = `Total: $${price}`;

  cashDrawerDisplay.innerHTML = `<p><strong>Change in the drawer:</strong></p>` +
    cid.map(([name, amount]) => `<p>${name}: $${amount.toFixed(2)}</p>`).join('');
}

purchaseBtn.addEventListener('click', checkCashRegister);
cash.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkCashRegister(); 
});

updateUI();
