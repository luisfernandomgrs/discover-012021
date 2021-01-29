const Modal = {
    open(){
        //  Abrir modal
        //  adicionar a class active ao modal
        //  DOM - document
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close(){
        //  Fechar o modal
        // remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -500000,
        date: '23/01/2021'
    },
    {
        id: 2,
        description: 'WebSite',
        amount: 50000,
        date: '23/01/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: 20000,
        date: '23/01/2021'
    },
    {
        id: 4,
        description: 'Serviços',
        amount: 50000,
        date: '28/01/2021'
    }
]

const Transaction = {

    incomes() {
        let income = 0;
        transactions.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },
    expenses() {
        let expense = 0;
        transactions.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense;
    },
    total() {
        return "Discover"
    }
}

const DOM = {
    addTransaction(ItemTransaction, index) {
        console.log(ItemTransaction)
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(ItemTransaction)

        // DOM.transactionsContainer

        // console.log(tr.innerHTML)
    },
    innerHTMLTransaction(tagItem){
        const html = `
            <td class="description">${tagItem.description}</td>
            <td class="expense">${tagItem.amount}</td>
            <td class='date'>${tagItem.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `

        return html
    }
}

// DOM.addTransaction(transactions[2])
const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g,"")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

transactions.forEach(function(transaction){
    DOM.addTransaction(transaction)
})