// Dark-Light mode code
const toggleInp = document.getElementById('darkmode');

toggleInp.addEventListener('change', () => {
  const isDarkMode = toggleInp.checked;
  document.body.classList.toggle("dark-mode", isDarkMode);
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add("dark-mode");
  toggleInp.checked = true;
}

// transaction form opening code

document.getElementById("openModal").addEventListener("click", function () {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 10);
});

document.getElementById("closeModal").addEventListener("click", function () {
  const modal = document.getElementById("modal");
  modal.classList.remove("show");
  setTimeout(() => modal.style.display = "none", 300);
});

window.addEventListener("click", function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.classList.remove("show");
    setTimeout(() => modal.style.display = "none", 300);
  }
});

// Userinfo form open code

document.querySelector('.login-btn').addEventListener('click', function () {
  const modalUser = document.getElementById('userModal');
  modalUser.style.visibility = 'visible';
  modalUser.style.opacity = '1'
});

window.addEventListener("click", function (event) {
  const modalUser = document.getElementById("userModal");
  if (event.target === modalUser) {
    modalUser.style.visibility = 'hidden';
    modalUser.style.opacity = '0'
  }
});

//taking the userinputs in fields of userinfo form

document.getElementById('saveInfo').addEventListener('click', function () {
  const username = document.getElementById('name').value;
  const bankBalance = parseFloat(document.getElementById('bankBalance').value);
  const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
  const expenseLimit = parseFloat(document.getElementById('expenseLimit').value);

  //store data in localStorage
  const userData = { username, bankBalance, monthlyIncome, expenseLimit };
  localStorage.setItem('userData', JSON.stringify(userData));
  document.getElementById('showBalance').innerHTML = `${bankBalance}`;

  document.getElementById("userInfoForm").addEventListener("submit", function () {
    this.reset();
    const modalUser = document.getElementById("userModal");
    modalUser.style.visibility = 'hidden';
    modalUser.style.opacity = '0';
    alert('Saved')
  });

  document.querySelector('.login-btn').style.display = 'none';
  const showName = document.querySelector('.username');
  showName.textContent = `${username}`
  showName.style.display = 'block';
});

window.addEventListener("load", function () {
  // Check if user data exists in localStorage
  const userData = JSON.parse(localStorage.getItem('userData'));

  if (userData) {
    document.querySelector('.login-btn').style.display = 'none';
    document.querySelector('.username').style.display = 'block';
    document.querySelector('.username').innerHTML = userData.username;
  }

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.forEach(displayTransaction);
  updateSummary();
});

document.getElementById("userInfoForm").addEventListener("submit", function (event) {
  event.preventDefault();
  this.reset()
});

// very important Transaction code

function submitbtn() {
  let description = document.getElementById('js-description').value;
  let date = document.getElementById('js-date').value;
  let category = document.getElementById("category").value;
  let type = document.getElementById('type').value;
  let amount = parseFloat(document.getElementById('js-amount').value);

  const transaction = { description, date, category, type, amount };
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.push(transaction)
  localStorage.setItem('transactions', JSON.stringify(transactions));

  displayTransaction(transaction);
  updateSummary();
}

// function to display transaction cards

function displayTransaction(transaction) {
  const { description, date, category, type, amount } = transaction;
  const displayCards = document.querySelector('.cards-box');

  // Create the transaction card
  const card = document.createElement('div');
  card.classList.add('card');

  // Left side
  const leftSide = document.createElement('div');
  leftSide.classList.add('left-side');

  const amtCateg = document.createElement('div');
  amtCateg.classList.add('amt-categ');

  const amountSpan = document.createElement('span');
  amountSpan.classList.add('amount');

  // Apply color based on transaction type
  if (type === 'income') {
    amountSpan.textContent = `+₹${amount}`;
    amountSpan.classList.add('add'); // Green color class
  } else {
    amountSpan.textContent = `-₹${amount}`;
    amountSpan.classList.add('minus'); // Red color class
  }

  const categorySpan = document.createElement('div');
  categorySpan.classList.add('category');
  categorySpan.textContent = ` (${category})`;

  amtCateg.appendChild(amountSpan);
  amtCateg.appendChild(categorySpan);

  const descr = document.createElement('div');
  descr.classList.add('descr');
  const descriptionP = document.createElement('p');
  descriptionP.classList.add('description');
  descriptionP.textContent = description;
  descr.appendChild(descriptionP);

  // Right side
  const rightSide = document.createElement('div');
  rightSide.classList.add('right-side');
  const dateP = document.createElement('p');
  dateP.classList.add('date');
  dateP.textContent = date;
  rightSide.appendChild(dateP);

  // Append all parts
  leftSide.appendChild(amtCateg);
  leftSide.appendChild(descr);
  card.appendChild(leftSide);
  card.appendChild(rightSide);

  const generatedColor = getRandomColor();
  card.style.background = generatedColor;

  // Append the card to the container
  displayCards.appendChild(card);

  document.getElementById("transactionForm").addEventListener("submit", function (event) {
    event.preventDefault();
    this.reset()
  });

  document.querySelector('.first-card').style.display = 'none'
}

//function to generate random color cards
function getRandomColor() {
  let randomColor = [
    'linear-gradient(to right,#707619, #00ff00)',
    'linear-gradient(90deg, #020024 0%, #090979 35%, #00d4ff 100%)',
    'radial-gradient(circle, #5c0067 0%, #00d4ff 100%)',
    'linear-gradient(135deg, orange 60%, cyan)',
    'linear-gradient(135deg, #2ecc71, #27ae60, #3498db, #2980b9)',
    'linear-gradient(135deg, #2ecc71, #3498db)',
    'linear-gradient(120deg, #3498db, #9b59b6)',
    'linear-gradient(130deg, #f1c40f, #2c3e50)',
    'linear-gradient(140deg, #1abc9c, #34495e)',
    'linear-gradient(145deg, #2ecc71, #2c3e50)',
    'linear-gradient(150deg, #9b59b6, #e74c3c)',
    'linear-gradient(160deg, #2980b9, #1abc9c)',
    'linear-gradient(170deg, #145a32, #2ecc71)',
    'linear-gradient(180deg, #2c3e50, #1abc9c)',
    'linear-gradient(190deg, #f39c12, #9b59b6)'
  ];
  let i = Math.floor(Math.random() * randomColor.length);
  return randomColor[i];
}

// update summary
function updateSummary() {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  let userData = JSON.parse(localStorage.getItem('userData'));
  let income = 0, expenses = 0, currentBalance = userData.bankBalance;
  parseFloat(income, expenses, bankBalance);

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      income += transaction.amount;
      currentBalance += income;
    } else if (transaction.type === 'expense') {
      expenses += transaction.amount;
      currentBalance -= expenses;
    }
    document.getElementById('charts').style.display = 'flex';
    document.querySelector('.right-dashboard').style.display='block'
  });

  document.getElementById('showIncome').textContent = `${income}`;
  document.getElementById('showExpense').textContent = `${expenses}`
  document.getElementById('showBalance').textContent = `${currentBalance}`;

  updatePieChart();
  renderBarChart();
  createLineChart();
}

//function to show expense chart
function updatePieChart() {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let categoryTotals = {};

  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      categoryTotals[transaction.category] =
        (categoryTotals[transaction.category] || 0) + parseFloat(transaction.amount);
    }
  });

  let categories = Object.keys(categoryTotals);
  let values = Object.values(categoryTotals);

  // Destroy existing chart to prevent duplication
  if (window.expenseChart instanceof Chart) {
    window.expenseChart.destroy();
  }

  let ctx = document.getElementById('expenseChart').getContext('2d');
  window.expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: values,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
      }]
    }
  });
}

//function for the bar chart
function renderBarChart() {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  let incomeTotal = 0, expenseTotal = 0;

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      incomeTotal += Number(transaction.amount);
    } else {
      expenseTotal += Number(transaction.amount);
    }
  });

  const ctx = document.getElementById("barChart").getContext("2d");

  if (window.barChart instanceof Chart) {
    window.barChart.destroy(); // Destroy old chart before creating a new one
  }

  window.barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [{
        label: "Amount (₹)",
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["#4CAF50", "#FF4D4D"], // Green for income, red for expenses
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(incomeTotal, expenseTotal) + 200,
          ticks: {
            stepSize: 100
          }
        }
      }
    }
  });
}

//function to show the line chart
function createLineChart() {
  const ctx = document.getElementById('lineChart').getContext('2d');

  const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // months
      datasets: [{
        label: 'Income', // Dataset for income
        data: [12000, 15000, 17000, 16000, 18000, 20000, 21000, 22000, 24000, 25000, 27000, 30000], // sample data
        borderColor: 'green',
        fill: false, // Line without filling the area
        tension: 0.1 // Smoothness of the line
      },
      {
        label: 'Expenses', // Dataset for expenses
        data: [5000, 6000, 7000, 7500, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000], // sample data
        borderColor: 'red',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true, // Ensure the Y-axis starts at 0
          ticks: {
            max: 35000, // Adjust the maximum Y-axis value
            stepSize: 5000 // Adjust step size for better readability
          }
        }
      }
    }
  });
}


// Load transactions on page load
window.addEventListener("load", function () {
  updateSummary();
  updatePieChart();
  renderBarChart();
  createLineChart();
});

// clear all transaction 
function clearAllTransactions() {
  const clear = document.getElementById('permission');
  clear.style.visibility = 'visible';
  clear.style.opacity = '1';

  const yes = document.querySelector('.yes-btn');
  const no = document.querySelector('.no-btn');

  yes.addEventListener('click', () => {
    localStorage.removeItem('transactions');
    clear.style.visibility = 'hidden';
    clear.style.opacity = '0';
    location.reload();

  });
  no.addEventListener('click', () => {
    clear.style.visibility = 'hidden';
    clear.style.opacity = '0';
  })
};

window.addEventListener("click", function (event) {
  const clear = document.getElementById("permission");
  if (event.target === clear) {
    clear.style.visibility = 'hidden';
    clear.style.opacity = '0'
  }
});

function resetEverything() {
  const clear = document.getElementById('permission');
  clear.style.visibility = 'visible';
  clear.style.opacity = '1';

  const yes = document.querySelector('.yes-btn');
  const no = document.querySelector('.no-btn');

  yes.addEventListener('click', () => {
    localStorage.removeItem('transactions');
    localStorage.removeItem('userData');
    clear.style.visibility = 'hidden';
    clear.style.opacity = '0';
    location.reload();

  });
  no.addEventListener('click', () => {
    clear.style.visibility = 'hidden';
    clear.style.opacity = '0';
  })
};