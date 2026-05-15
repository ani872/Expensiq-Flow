// demoData.js

const demoUser = {
    id: 'usr_demo_123',
    name: 'Alex Johnson',
    email: 'demo@expensiqflow.com',
    password: 'password123'
};

const demoTransactions = [
    {
        id: 'tx_1',
        type: 'income',
        amount: 55000,
        description: 'Monthly Salary',
        category: 'Salary',
        date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0]
    },
    {
        id: 'tx_2',
        type: 'expense',
        amount: 2800,
        description: 'Groceries',
        category: 'Food & Dining',
        date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split('T')[0]
    },
    {
        id: 'tx_3',
        type: 'expense',
        amount: 799,
        description: 'Internet Bill',
        category: 'Housing',
        date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0]
    },
    {
        id: 'tx_4',
        type: 'expense',
        amount: 1400,
        description: 'Dinner with friends',
        category: 'Food & Dining',
        date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]
    },
    {
        id: 'tx_5',
        type: 'expense',
        amount: 320,
        description: 'Ola/Uber ride',
        category: 'Transportation',
        date: new Date().toISOString().split('T')[0]
    },
    {
        id: 'tx_6',
        type: 'expense',
        amount: 3499,
        description: 'Boat Earphones',
        category: 'Shopping',
        date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString().split('T')[0]
    }
];

const initializeDemoData = () => {
    if (!Storage.get('users')) {
        Storage.set('users', [demoUser]);
    }
    // We do not auto-login, let the user sign up or use demo
    // Wait, let's allow them to login with demo credentials
};
