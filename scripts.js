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

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
        // return []
    },

    set(transactions) {
        localStorage.setItem("dev2.finances:transactions", 
                             JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index){
        Transaction.all.splice(index,1)
        App.reload()
    },

    incomes() {
        let income = 0;
        // Outra forma de criar a função
        // transactions.forEach(transaction => {
        Transaction.all.forEach(function(transaction) {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total() {
        //  é realizado uma soma por estar armazenado no valor, o sinal negativo
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer : document.querySelector('#data-table tbody'),

    addTransaction(ItemTransaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(ItemTransaction, index)
        tr.dataset = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(tagItemValue, index) {
        const CSSclass = tagItemValue.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(tagItemValue.amount)

        const html = `
            <td class="description">${tagItemValue.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class='date'>${tagItemValue.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `

        return html
    },

    updateBalance(ItemTransaction){
        // poderia usar também o document.querySelector()
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes(ItemTransaction))
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses(ItemTransaction))
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total(ItemTransaction))
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        /*
        //  valores como 1250,84 | 110,84 - 110,89... geram bug no valor calculado.

        let iIndexOf = 0;

        iIndexOf = value.indexOf(".")
        if (iIndexOf === 0) iIndexOf = value.indexOf(",")

        if (iIndexOf > 0)
        {
            let setValue = "";
            let iLength = value.length;

            value += "00";
            setValue = value.substring(0,iIndexOf);
            setValue += value.substring(++iIndexOf, iIndexOf+2);

            value = Number(setValue);
        }
        else {
            value = Number(value) * 100;
        }
        */
       value *= 100
        
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

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

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        //  outra seria. criar uma variave e atribuir o valor | const description = Form.getValues().description
        //  ou const description = document.querySelector('input#descrption').value
        
        //  esta é uma maneira de "pegar" os dados que desejamos da função getValues

        const {description,amount,date} = Form.getValues()        
        
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() == "")
        {
            throw new Error("Por favor preencha todos os campos")
        }
    },

    formatValues() {
        let {description,amount,date} = Form.getValues()
        // console.log(amount)

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        
        return {
            //  Em javascript é permitido usar um short-hand quando os nomes das variáveis são os mesmo para retornar...
            //  outra maneira seria:
            //  return {descValue: description, amountValue: amount, dateValue: date}

            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        // console.log(event)
        event.preventDefault()

        try {
            Form.validateFields()

            const transaction = Form.formatValues()
            Transaction.add(transaction)
            
            Form.clearFields()
            Modal.close()
        }
        catch (error) {
            //  refatorar escondendo os objetos e mostrando a mensagem
            //  no Form-Modal com botão de OK para voltar ao formulário
            //  ou colocar uma "barra" vermelha no topo exibindo o alerta com
            //  botão ok para liberar o formulário para edição.

            alert(error.message)
        }
    }
}

const App = {
    init(){
        // Transaction.all.forEach((transaction, index) => {
        //     DOM.addTransaction(transaction, index)
        // })
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(transaction.all)
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()


/* Desafio - Criar uma função Toogle
   para refatorar o objeto Modal,
   melhorando a funcionalidade de Open e Close */