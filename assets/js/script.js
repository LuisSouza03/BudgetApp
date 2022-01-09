const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount')

const LocalStorageTransactions = JSON.parse(localStorage.
    getItem('transactions'))


let transactions = localStorage
    .getItem('transactions') !== null ? LocalStorageTransactions : []


const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
        transaction.id !== ID)

    updateLocalStorage();
    init();
}

const addTransactionIntoDOM = transaction => {

    const operator = transaction.amount < 0 ? '-' : '+' // If the value is less than 0, then it has the sign '-' and negative, else value it becomes positive.
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus' // If the value is less than 0, the class is minus, else the class is plus.
    const amountWithoutOperator = Math.abs(transaction.amount) // Removing sign '-' or '+'

    const li = document.createElement('li') // Creating a new element in HTML

    li.classList.add(CSSClass) // Adding a new class for Li
    li.innerHTML = `
        ${transaction.name} <span> ${operator} R$ ${amountWithoutOperator} 
        </span>
        <button class="delete-btn" onClick = "removeTransaction(${transaction.id})">
            x
        </button>
    `

    transactionsUl.append(li) // This method "append", receive argument "li" as last child for this element. So, when we adding a new item for the list, the most recent transaction will be entered as the last "li" inside the "ul" 

}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((acumulator, value) => acumulator + value, 0))
    .toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts // Filter when you need to creat a new Array, containing specific elements.
    .filter(value => value > 0)
    .reduce((acumulator, value) => acumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((acumulator, transaction) => acumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValue = () => {
    const transactionsAmounts = transactions.map(({ amount }) => amount) // Creating a "map" in "transaction", for search only "amount" in the array

    const total = getTotal(transactionsAmounts);
    const income = getIncome(transactionsAmounts);
    const expense = getExpenses(transactionsAmounts);

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM) // To each item for transaction, he add the list
    updateBalanceValue()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateId = () => Math.round(Math.random() * 1000) // This function generate a aleatory number from 0 to 1000

const addToTransactionsArray = (transactionName, transactionAmount) => {

    transactions.push({
        id: generateId(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

    if (isSomeInputEmpty) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please, enter both the Value and Transaction fields!'
        })
        return
    }

    addToTransactionsArray(transactionName, transactionAmount);
    init();
    updateLocalStorage();
    cleanInputs();
}

form.addEventListener('submit', handleFormSubmit)

