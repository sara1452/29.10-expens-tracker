document.addEventListener('DOMContentLoaded', function() {
    let expenses = [];
    let id = 1;
    const desc = document.getElementById("desc");
    const amount = document.getElementById("amount");
    const expenseForm = document.getElementById('expense-form');
    const form_error = document.getElementById("form-error");
    const categorySelect = document.getElementById('category');
    const rowsContainer = document.getElementById('rows');
    const totalElement = document.getElementById('total');
    const filterSelect = document.getElementById('filter');
    function render() {
        Array.from(rowsContainer.children).forEach(child => {
            if (child.id !== 'no-rows') {
                child.remove();
            }
        });
        const noRowsMsg = document.getElementById("no-rows");
        const selectedCategory = filterSelect ? filterSelect.value : 'all';
        let filteredExpenses = expenses;
        if (selectedCategory && selectedCategory !== 'all') {
            filteredExpenses = expenses.filter(expense => expense.category === selectedCategory);
        }
        if (filteredExpenses.length === 0) {
            if (noRowsMsg) {
                noRowsMsg.hidden = false;
                noRowsMsg.removeAttribute('hidden');
                noRowsMsg.style.display = "";
            }
            totalElement.textContent = "0.00";
            return;
        }
        if (noRowsMsg) {
            noRowsMsg.hidden = true;
            noRowsMsg.setAttribute('hidden', '');
            noRowsMsg.style.display = "none";
        }
        let totalSum = 0;
        filteredExpenses.forEach(expense => {
            totalSum += expense.amount;
            const tr = document.createElement('tr');
            if (expense.amount > 100) {
                tr.classList.add('big');
            }
            tr.innerHTML = `
                <td>${expense.desc}</td>
                <td><span class="badge">${expense.category}</span></td>
                <td>${expense.amount.toFixed(2)}</td>
                <td><button class="delete" type="button" data-id="${expense.id}">Delete</button></td>
            `;
            rowsContainer.appendChild(tr);
        });
        totalElement.textContent = totalSum.toFixed(2);
    }
    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const descTemp = desc.value.trim();
        const amountStrTemp = amount.value.trim();
        const categoryTemp = categorySelect.value;
        if (descTemp === "") {
            showError("Please add a description");
            return;
        }
        const amountNum = Number(amountStrTemp);
        if (amountStrTemp === "" || isNaN(amountNum) || amountNum <= 0) {
            showError("The amount must be larger than 0");
            return;
        }
        hideError();
        const newExpense = {
            id: id++,
            desc: descTemp,
            amount: amountNum,
            category: categoryTemp
        };
        expenses.push(newExpense);
        desc.value = "";
        amount.value = "";
        categorySelect.value = "food";
        desc.focus();
        render();
    });
    rowsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete')) {
            const expenseId = Number(event.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== expenseId);
            render();
        }
    });
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            render();
        });
    }
    function showError(message) {
        form_error.textContent = message;
        form_error.hidden = false;
    }
    function hideError() {
        form_error.textContent = "";
        form_error.hidden = true;
    }
    render();
});