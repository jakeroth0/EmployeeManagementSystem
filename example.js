const inquirer = require('inquirer')

const genList = (list) => {
    const choices = list.map((item, index) => {
        return {
            key: index,
            name: `${item.id}: ${item.quantity}@${item.price}`,
            value: item.id
        }
    }) 
    return {
        type: 'rawlist',
        message: 'Which order to pick',
        name: 'orders',
        choices: choices
    }
}

const getList = () => {
    return Promise.resolve([
        {
            id: 'A001',
            quantity: 20,
            price: 103
        },
        {
            id: 'A002',
            quantity: 75,
            price: 2.03
        },
        {
            id: 'A003',
            quantity: 16,
            price: 900.01
        }
    ])
}
const confirmUpdate = (id) => {
    return {
        type: 'confirm',
        name: 'toUpdate',
        message: `Would you like to update ${id}?`
    }
}

/*
// Without using async/await:
inquirer.prompt({
    type: 'input',
    name: 'account',
    message: 'What is the account?'
}).then(answers => {
    return getList().then(list => {
        return inquirer.prompt(genList(list)).then( answers1 => {
            return answers1.orders
        })
    })
}).then(id => {
    return inquirer.prompt(confirmUpdate(id))
}).then(answers => {
    // it's not easy to access the order id selected
    if(answers.toUpdate) {
        return 'to update'
    } else {
        return 'NOT to update'
    }
}).then(console.log)
*/

// async/await awesomeness
async function main() {
    const getAccount = await inquirer.prompt({
        type: 'input',
        name: 'account',
        message: 'What is the account?'
    })
    const orderList = await getList()
    const getOrder = await inquirer.prompt(genList(orderList))
    const getConfirm = await inquirer.prompt(confirmUpdate(getOrder.orders))

    if(getConfirm.toUpdate) {
        console.log('to update', getOrder.orders, 'for account', getAccount.account)
    } else {
        console.log('NOT to update', getOrder.orders)
    }
}
main()