const toggleInput = document.getElementById('darkmode');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  toggleInput.checked = true;
}

// Toggle theme
toggleInput.addEventListener('change', () => {
  const isDarkMode = toggleInput.checked;
  body.classList.toggle('dark-mode', isDarkMode);
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  
  // Update charts for better visibility in dark mode
  updateCharts();
});

// Transaction Modal
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModal');
const quickAddBtn = document.getElementById('quick-add');
const closeModalBtn = document.getElementById('closeModal');

function openModal() {
  modal.classList.add('show');
  document.getElementById('js-amount').focus();
}

function closeModal() {
  modal.classList.remove('show');
  document.getElementById('transactionForm').reset();
}

openModalBtn.addEventListener('click', openModal);
quickAddBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// User Info Modal
const userModal = document.getElementById('userModal');
const loginBtn = document.querySelector('.login-btn');
const closeUserModalBtn = document.getElementById('closeUserModal');

function openUserModal() {
  userModal.classList.add('show');
  document.getElementById('name').focus();
}

function closeUserModal() {
  userModal.classList.remove('show');
}

loginBtn.addEventListener('click', openUserModal);
closeUserModalBtn?.addEventListener('click', closeUserModal);

// Close user modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === userModal) {
    closeUserModal();
  }
});

// Confirmation Modal
const permissionModal = document.getElementById('permission');
const closeConfirmBtn = document.querySelector('.close-confirm');
const yesBtn = document.querySelector('.yes-btn');
const noBtn = document.querySelector('.no-btn');

function openConfirmModal(message, onConfirm) {
  document.querySelector('.confirm-message').textContent = message;
  permissionModal.classList.add('show');
  
  // Remove previous event listeners
  yesBtn.replaceWith(yesBtn.cloneNode(true));
  noBtn.replaceWith(noBtn.cloneNode(true));
  
  // Add new event listeners
  document.querySelector('.yes-btn').addEventListener('click', () => {
    onConfirm();
    closeConfirmModal();
  });
  
  document.querySelector('.no-btn').addEventListener('click', closeConfirmModal);
}

function closeConfirmModal() {
  permissionModal.classList.remove('show');
}

closeConfirmBtn?.addEventListener('click', closeConfirmModal);

// Close confirm modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target === permissionModal) {
    closeConfirmModal();
  }
});

// user info
document.getElementById('userInfoForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const username = document.getElementById('name').value;
  const bankBalance = parseFloat(document.getElementById('bankBalance').value);
  const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
  const expenseLimit = parseFloat(document.getElementById('expenseLimit').value);
  
  // Store data in localStorage
  const userData = { username, bankBalance, monthlyIncome, expenseLimit };
  localStorage.setItem('userData', JSON.stringify(userData));
  
  // Update UI
  document.getElementById('showBalance').textContent = bankBalance.toLocaleString();
  document.querySelector('.login-btn').style.display = 'none';
  
  const usernameElement = document.querySelector('.username');
  usernameElement.textContent = username;
  usernameElement.style.display = 'block';
  
  // Close modal and show success message
  closeUserModal();
  showNotification('Account setup successful!', 'success');
});

document.getElementById('transactionForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const amount = parseFloat(document.getElementById('js-amount').value);
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('js-description').value || category;
  const date = document.getElementById('js-date').value;
  
  // Create transaction object
  const transaction = {
    id: Date.now(), // Unique ID for each transaction
    amount,
    type,
    category,
    description,
    date
  };
  
  // Add to localStorage
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  // Update UI
  displayTransaction(transaction);
  updateSummary();
  updateCharts();
  
  // Close modal and show success message
  closeModal();
  showNotification('Transaction added successfully!', 'success');
});

// Display a single transaction
function displayTransaction(transaction) {
  const transactionList = document.getElementById('transaction-list');
  const emptyState = transactionList.querySelector('.empty-state');
  
  // Remove empty state if it exists
  if (emptyState) {
    emptyState.remove();
  }
  
  // Create transaction item
  const transactionItem = document.createElement('div');
  transactionItem.classList.add('transaction-item');
  transactionItem.dataset.id = transaction.id;
  
  // Get icon based on category
  const categoryIcon = getCategoryIcon(transaction.category);
  
  // Format date
  const formattedDate = formatDate(transaction.date);
  
  // Create HTML structure
  transactionItem.innerHTML = `
    <div class="transaction-info">
      <div class="category-icon">
        <i class="${categoryIcon}"></i>
      </div>
      <div class="transaction-details">
        <h4>${transaction.description}</h4>
        <div class="transaction-date">${formattedDate}</div>
      </div>
    </div>
    <div class="transaction-amount ${transaction.type}">
      ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toLocaleString()}
    </div>
  `;
  
  // Add delete functionality on hover
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-transaction');
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteBtn.style.display = 'none';
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTransaction(transaction.id);
  });
  
  transactionItem.appendChild(deleteBtn);
  
  // Show/hide delete button on hover
  transactionItem.addEventListener('mouseenter', () => {
    deleteBtn.style.display = 'block';
  });
  
  transactionItem.addEventListener('mouseleave', () => {
    deleteBtn.style.display = 'none';
  });
  
  // Add to the list
  transactionList.prepend(transactionItem);
}

//  icon based on category
function getCategoryIcon(category) {
  const icons = {
    food: 'fa-solid fa-utensils',
    travel: 'fa-solid fa-plane',
    shopping: 'fa-solid fa-cart-shopping',
    rent: 'fa-solid fa-house',
    salary: 'fa-solid fa-money-bill-wave',
    investment: 'fa-solid fa-chart-line',
    entertainment: 'fa-solid fa-film',
    utilities: 'fa-solid fa-bolt',
    other: 'fa-solid fa-ellipsis'
  };
  
  return icons[category] || 'fa-solid fa-circle';
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Delete a transaction
function deleteTransaction(id) {
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions = transactions.filter(transaction => transaction.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  
  // Remove from UI
  document.querySelector(`.transaction-item[data-id="${id}"]`).remove();
  
  // Update summary and charts
  updateSummary();
  updateCharts();
  
  // Show empty state if no transactions
  if (transactions.length === 0) {
    showEmptyState();
  }
  
  showNotification('Transaction deleted!', 'warning');
}

// Show empty state
function showEmptyState() {
  const transactionList = document.getElementById('transaction-list');
  
  if (transactionList.children.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.classList.add('empty-state');
    emptyState.innerHTML = `
      <i class="fa-solid fa-receipt"></i>
      <p>No transactions yet. Add your first transaction to get started!</p>
    `;
    transactionList.appendChild(emptyState);
  }
}

// Clear all transactions
document.querySelector('.clearbtn').addEventListener('click', function() {
  openConfirmModal('Are you sure you want to delete all transactions? This action cannot be undone.', clearAllTransactions);
});

function clearAllTransactions() {
  localStorage.removeItem('transactions');
  
  // Clear transaction list
  const transactionList = document.getElementById('transaction-list');
  transactionList.innerHTML = '';
  showEmptyState();
  
  // Update summary and charts
  updateSummary();
  updateCharts();
  
  showNotification('All transactions cleared!', 'warning');
}

// Reset everything
document.querySelector('.resetBtn').addEventListener('click', function() {
  openConfirmModal('Are you sure you want to reset everything? This will delete all your data including account information.', resetEverything);
});

function resetEverything() {
  localStorage.removeItem('transactions');
  localStorage.removeItem('userData');
  
  // Reload page
  location.reload();
}

// Summary
function updateSummary() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const userData = JSON.parse(localStorage.getItem('userData')) || { bankBalance: 0 };
  
  let totalIncome = 0;
  let totalExpenses = 0;
  
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });
  
  const currentBalance = userData.bankBalance + totalIncome - totalExpenses;
  
  // Update UI
  document.getElementById('showIncome').textContent = totalIncome.toLocaleString();
  document.getElementById('showExpense').textContent = totalExpenses.toLocaleString();
  document.getElementById('showBalance').textContent = currentBalance.toLocaleString();
}

// Initialize charts
let expenseChart, barChart, lineChart;

function updateCharts() {
  updatePieChart();
  updateBarChart();
  updateLineChart();
}

function updatePieChart() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const isDarkMode = body.classList.contains('dark-mode');
  
  // Calculate category totals for expenses
  const categoryTotals = {};
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    }
  });
  
  const categories = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);
  
  // Colors for categories
  const backgroundColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8AC249', '#EA80FC', '#00E5FF', '#FF5252'
  ];
  
  // Destroy existing chart
  if (expenseChart instanceof Chart) {
    expenseChart.destroy();
  }
  
  // Create new chart if we have data
  if (categories.length > 0) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors,
          borderColor: isDarkMode ? '#1e1e1e' : '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: isDarkMode ? '#e0e0e0' : '#333333'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}

function updateBarChart() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const isDarkMode = body.classList.contains('dark-mode');
  
  // Calculate totals
  let totalIncome = 0;
  let totalExpenses = 0;
  
  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });
  
  // Destroy existing chart
  if (barChart instanceof Chart) {
    barChart.destroy();
  }
  
  // Create new chart
  const ctx = document.getElementById('barChart').getContext('2d');
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{
        label: 'Amount (₹)',
        data: [totalIncome, totalExpenses],
        backgroundColor: ['#38b000', '#ff5252'],
        borderColor: isDarkMode ? '#1e1e1e' : '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: isDarkMode ? '#e0e0e0' : '#333333',
            callback: function(value) {
              return '₹' + value.toLocaleString();
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: isDarkMode ? '#e0e0e0' : '#333333'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return '₹' + context.raw.toLocaleString();
            }
          }
        }
      }
    }
  });
}

function updateLineChart() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const isDarkMode = body.classList.contains('dark-mode');
  
  // Group transactions by month
  const monthlyData = {};
  
  // Initialize all months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach(month => {
    monthlyData[month] = { income: 0, expense: 0 };
  });
  
  // Fill with actual data
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const month = months[date.getMonth()];
    
    if (transaction.type === 'income') {
      monthlyData[month].income += transaction.amount;
    } else {
      monthlyData[month].expense += transaction.amount;
    }
  });
  
  // Prepare data for chart
  const incomeData = months.map(month => monthlyData[month].income);
  const expenseData = months.map(month => monthlyData[month].expense);
  
  // Destroy existing chart
  if (lineChart instanceof Chart) {
    lineChart.destroy();
  }
  
  // Create new chart
  const ctx = document.getElementById('lineChart').getContext('2d');
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#38b000',
          backgroundColor: 'rgba(56, 176, 0, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#ff5252',
          backgroundColor: 'rgba(255, 82, 82, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: isDarkMode ? '#e0e0e0' : '#333333',
            callback: function(value) {
              return '₹' + value.toLocaleString();
            }
          }
        },
        x: {
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            color: isDarkMode ? '#e0e0e0' : '#333333'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: isDarkMode ? '#e0e0e0' : '#333333'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ₹' + context.raw.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// NOTIFICATIONS 
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.classList.add('notification', type);
  
  // Set icon based on type
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'warning') icon = 'fa-exclamation-triangle';
  if (type === 'error') icon = 'fa-times-circle';
  
  notification.innerHTML = `
    <i class="fas ${icon}"></i>
    <p>${message}</p>
  `;
  
  // Add styles
  Object.assign(notification.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: '9999',
    transform: 'translateY(100px)',
    opacity: '0',
    transition: 'all 0.3s ease'
  });
  
  // Set colors based on type
  if (type === 'success') {
    notification.style.backgroundColor = '#38b000';
    notification.style.color = 'white';
  } else if (type === 'warning') {
    notification.style.backgroundColor = '#ffbe0b';
    notification.style.color = '#333';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#ff5252';
    notification.style.color = 'white';
  } else {
    notification.style.backgroundColor = '#3a86ff';
    notification.style.color = 'white';
  }
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.transform = 'translateY(100px)';
    notification.style.opacity = '0';
    
    // Remove from DOM after animation
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

window.addEventListener('load', function() {
  // Check if user data exists
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  if (userData) {
    // User already set up
    document.querySelector('.login-btn').style.display = 'none';
    const usernameElement = document.querySelector('.username');
    usernameElement.textContent = userData.username;
    usernameElement.style.display = 'block';
  } else {
    // Show setup modal on first visit
    setTimeout(openUserModal, 1000);
  }
  
  // Load transactions
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  
  if (transactions.length > 0) {
    // Sort transactions by date 
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Display transactions
    transactions.forEach(displayTransaction);
  } else {
    showEmptyState();
  }
  
  // Update summary and charts
  updateSummary();
  updateCharts();
  
  // Set active nav item based on scroll position
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.main-nav a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
});

// Add smooth scrolling for navigation
document.querySelectorAll('.main-nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    window.scrollTo({
      top: targetElement.offsetTop - 100,
      behavior: 'smooth'
    });
    
    // Update active class
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.classList.remove('active');
    });
    this.classList.add('active');
  });
});
