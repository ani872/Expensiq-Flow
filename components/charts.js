// charts.js
class AppCharts {
    constructor() {
        this.mainChart = null;
        this.barChart = null;
        this.pieChart = null;
        
        this.chartColors = {
            brand: '#14b8a6', // Teal
            income: '#10b981', // Emerald
            expense: '#ef4444', // Red
            categories: [
                '#3b82f6', // Blue
                '#f59e0b', // Amber
                '#8b5cf6', // Violet
                '#ec4899', // Pink
                '#14b8a6', // Teal
                '#f97316', // Orange
                '#64748b'  // Slate
            ]
        };

        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('transactionsUpdated', (e) => {
            this.updateCharts(e.detail);
        });

        // Handle dark mode toggle for charts
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (this.mainChart || this.barChart || this.pieChart) {
                        const transactions = window.appTransactions?.transactions || [];
                        this.updateCharts(transactions);
                    }
                }
            });
        });
        
        observer.observe(document.documentElement, { attributes: true });
    }

    getThemeConfig() {
        const isDark = document.documentElement.classList.contains('dark');
        return {
            textColor: isDark ? '#94a3b8' : '#64748b',
            gridColor: isDark ? '#334155' : '#e2e8f0'
        };
    }

    updateCharts(transactions) {
        if (!window.Chart) return;

        this.renderMainChart(transactions);
        this.renderBarChart(transactions);
        this.renderPieChart(transactions);
    }

    renderMainChart(transactions) {
        const ctx = document.getElementById('mainChart');
        if (!ctx) return;

        const theme = this.getThemeConfig();
        
        // Process data (Last 7 days expenses)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const data = last7Days.map(date => {
            return transactions
                .filter(t => t.type === 'expense' && t.date === date)
                .reduce((sum, t) => sum + t.amount, 0);
        });

        const labels = last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' }));

        if (this.mainChart) this.mainChart.destroy();

        this.mainChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Expenses',
                    data: data,
                    borderColor: this.chartColors.brand,
                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: this.chartColors.brand,
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        cornerRadius: 8,
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: theme.textColor }
                    },
                    y: {
                        grid: { color: theme.gridColor, borderDash: [5, 5] },
                        ticks: {
                            color: theme.textColor,
                            callback: (value) => '₹' + value
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    renderBarChart(transactions) {
        const ctx = document.getElementById('barChart');
        if (!ctx) return;

        const theme = this.getThemeConfig();
        
        let totalIncome = 0;
        let totalExpense = 0;
        
        transactions.forEach(t => {
            if (t.type === 'income') totalIncome += t.amount;
            if (t.type === 'expense') totalExpense += t.amount;
        });

        if (this.barChart) this.barChart.destroy();

        this.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expense'],
                datasets: [{
                    data: [totalIncome, totalExpense],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: theme.textColor }
                    },
                    y: {
                        grid: { color: theme.gridColor },
                        ticks: {
                            color: theme.textColor,
                            callback: (value) => '₹' + value
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderPieChart(transactions) {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;

        const theme = this.getThemeConfig();
        
        const expenses = transactions.filter(t => t.type === 'expense');
        const categories = {};
        
        expenses.forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        });

        const labels = Object.keys(categories);
        const data = Object.values(categories);

        if (this.pieChart) this.pieChart.destroy();

        if (data.length === 0) {
            // Render empty state
            const ctx2d = ctx.getContext('2d');
            ctx2d.font = '14px Inter';
            ctx2d.fillStyle = theme.textColor;
            ctx2d.textAlign = 'center';
            ctx2d.clearRect(0, 0, ctx.width, ctx.height);
            ctx2d.fillText('No expenses yet', ctx.canvas.clientWidth / 2, ctx.canvas.clientHeight / 2);
            return;
        }

        this.pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: this.chartColors.categories.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: theme.textColor,
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return ` $${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

window.appCharts = new AppCharts();
