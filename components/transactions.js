// transactions.js
class Transactions {
    constructor() {
        this.transactions = [];
        this.attachEventListeners();
    }

    loadTransactions() {
        const user = window.appAuth.getCurrentUser();
        if (!user) return;
        
        this.transactions = Storage.get(`transactions_${user.id}`) || [];
        this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        this.updateDashboard();
        this.renderTransactions();
        
        // Notify charts to update
        document.dispatchEvent(new CustomEvent('transactionsUpdated', { detail: this.transactions }));
    }

    attachEventListeners() {
        document.addEventListener('userLoggedIn', () => {
            this.loadTransactions();
        });

        document.addEventListener('userLoggedOut', () => {
            this.transactions = [];
        });

        // Modal triggers
        const modal = document.getElementById('transaction-modal');
        const openModalBtn = document.getElementById('open-add-modal');
        const closeModalBtn = document.getElementById('close-modal');
        const modalBackdrop = document.getElementById('modal-backdrop');
        const form = document.getElementById('transaction-form');
        
        const openModal = () => {
            form.reset();
            document.getElementById('trans-id').value = '';
            document.getElementById('trans-date').value = new Date().toISOString().split('T')[0];
            
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                document.getElementById('modal-content').classList.remove('scale-95');
            }, 10);
        };

        const closeModal = () => {
            modal.classList.add('opacity-0');
            document.getElementById('modal-content').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.style.display = '';
            }, 300);
        };

        if (openModalBtn) openModalBtn.addEventListener('click', openModal);
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

        // Form Submit
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTransaction();
                closeModal();
            });
        }

        // Filters and Search
        const filterType = document.getElementById('filter-type');
        const searchInput = document.getElementById('search-transaction');

        if (filterType) {
            filterType.addEventListener('change', () => this.renderTransactions());
        }

        if (searchInput) {
            searchInput.addEventListener('input', () => this.renderTransactions());
        }
    }

    saveTransaction() {
        const id = document.getElementById('trans-id').value || 'tx_' + Helpers.generateId();
        const type = document.querySelector('input[name="type"]:checked').value;
        const amount = parseFloat(document.getElementById('trans-amount').value);
        const description = document.getElementById('trans-desc').value.trim();
        const category = document.getElementById('trans-category').value;
        const date = document.getElementById('trans-date').value;

        const newTx = { id, type, amount, description, category, date };
        
        const existingIndex = this.transactions.findIndex(t => t.id === id);
        if (existingIndex > -1) {
            this.transactions[existingIndex] = newTx;
            Helpers.showToast('Transaction updated successfully', 'success');
        } else {
            this.transactions.push(newTx);
            Helpers.showToast('Transaction added successfully', 'success');
        }

        // Sort by date desc
        this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const user = window.appAuth.getCurrentUser();
        Storage.set(`transactions_${user.id}`, this.transactions);
        
        this.updateDashboard();
        this.renderTransactions();
        document.dispatchEvent(new CustomEvent('transactionsUpdated', { detail: this.transactions }));
    }

    deleteTransaction(id) {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        
        this.transactions = this.transactions.filter(t => t.id !== id);
        
        const user = window.appAuth.getCurrentUser();
        Storage.set(`transactions_${user.id}`, this.transactions);
        
        Helpers.showToast('Transaction deleted', 'info');
        
        this.updateDashboard();
        this.renderTransactions();
        document.dispatchEvent(new CustomEvent('transactionsUpdated', { detail: this.transactions }));
    }

    editTransaction(id) {
        const tx = this.transactions.find(t => t.id === id);
        if (!tx) return;

        document.getElementById('trans-id').value = tx.id;
        document.querySelector(`input[name="type"][value="${tx.type}"]`).checked = true;
        document.getElementById('trans-amount').value = tx.amount;
        document.getElementById('trans-desc').value = tx.description;
        document.getElementById('trans-category').value = tx.category;
        document.getElementById('trans-date').value = tx.date;

        document.getElementById('open-add-modal').click();
    }

    updateDashboard() {
        let income = 0;
        let expense = 0;

        this.transactions.forEach(t => {
            if (t.type === 'income') income += t.amount;
            if (t.type === 'expense') expense += t.amount;
        });

        const balance = income - expense;
        const savings = balance > 0 ? balance : 0;

        document.getElementById('total-balance').textContent = Helpers.formatCurrency(balance);
        document.getElementById('total-income').textContent = Helpers.formatCurrency(income);
        document.getElementById('total-expense').textContent = Helpers.formatCurrency(expense);
        document.getElementById('total-savings').textContent = Helpers.formatCurrency(savings);

        // Update recent transactions list (max 5)
        const recentList = document.getElementById('recent-transactions-list');
        if (!recentList) return;

        recentList.innerHTML = '';
        const recentTxs = this.transactions.slice(0, 5);

        if (recentTxs.length === 0) {
            recentList.innerHTML = '<p class="text-sm text-slate-500 text-center py-4">No recent transactions</p>';
            return;
        }

        recentTxs.forEach(tx => {
            const isIncome = tx.type === 'income';
            const icon = isIncome ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
            const colorClass = isIncome ? 'text-green-500 bg-green-50 dark:bg-green-500/10' : 'text-red-500 bg-red-50 dark:bg-red-500/10';
            const amountClass = isIncome ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200';
            const sign = isIncome ? '+' : '-';

            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-dark-border bg-white/50 dark:bg-dark-card/50 hover:bg-white dark:hover:bg-dark-card transition-colors';
            item.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center ${colorClass}">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div>
                        <p class="font-medium text-sm">${tx.description}</p>
                        <p class="text-xs text-slate-500 dark:text-slate-400">${tx.category} &bull; ${Helpers.formatDate(tx.date)}</p>
                    </div>
                </div>
                <div class="font-bold text-sm ${amountClass}">
                    ${sign}${Helpers.formatCurrency(tx.amount)}
                </div>
            `;
            recentList.appendChild(item);
        });
    }

    renderTransactions() {
        const list = document.getElementById('all-transactions-list');
        const emptyState = document.getElementById('transactions-empty-state');
        const filterType = document.getElementById('filter-type')?.value || 'all';
        const searchQuery = (document.getElementById('search-transaction')?.value || '').toLowerCase();

        if (!list) return;

        list.innerHTML = '';

        let filtered = this.transactions.filter(tx => {
            const matchType = filterType === 'all' || tx.type === filterType;
            const matchSearch = tx.description.toLowerCase().includes(searchQuery) || 
                              tx.category.toLowerCase().includes(searchQuery);
            return matchType && matchSearch;
        });

        if (filtered.length === 0) {
            list.parentElement.classList.add('hidden');
            emptyState.classList.remove('hidden');
            emptyState.style.display = 'flex';
            return;
        }

        list.parentElement.classList.remove('hidden');
        emptyState.classList.add('hidden');
        emptyState.style.display = '';

        filtered.forEach(tx => {
            const isIncome = tx.type === 'income';
            const badgeClass = isIncome ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
            const amountClass = isIncome ? 'text-green-600 dark:text-green-400' : 'text-slate-800 dark:text-slate-200';
            const sign = isIncome ? '+' : '-';

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50/50 dark:hover:bg-dark-bg/50 transition-colors group';
            tr.innerHTML = `
                <td class="p-4">
                    <div class="font-medium">${tx.description}</div>
                    <div class="text-xs text-slate-500 lg:hidden mt-1">${Helpers.formatDate(tx.date)}</div>
                </td>
                <td class="p-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}">${tx.category}</span>
                </td>
                <td class="p-4 text-sm text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                    ${Helpers.formatDate(tx.date)}
                </td>
                <td class="p-4 font-bold text-right ${amountClass}">
                    ${sign}${Helpers.formatCurrency(tx.amount)}
                </td>
                <td class="p-4 text-center">
                    <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="w-8 h-8 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors" onclick="window.appTransactions.editTransaction('${tx.id}')">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="w-8 h-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors" onclick="window.appTransactions.deleteTransaction('${tx.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            list.appendChild(tr);
        });
    }
}

// Global instance to allow inline onclick handlers in render
window.appTransactions = new Transactions();
