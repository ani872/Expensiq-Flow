// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Check initial dark mode preference
    const isDarkMode = Storage.get('darkMode');
    if (isDarkMode || (isDarkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            Storage.set('darkMode', isDark);
        });
    }

    // Sidebar Mobile Toggle
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('open-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    const toggleSidebar = () => {
        sidebar.classList.toggle('-translate-x-full');
    };

    if (openSidebarBtn) openSidebarBtn.addEventListener('click', toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);

    // View Switching
    const navLinks = document.querySelectorAll('.nav-link');
    const viewSections = document.querySelectorAll('.view-section');

    const switchView = (targetViewId) => {
        // Update links
        navLinks.forEach(link => {
            if (link.dataset.view === targetViewId) {
                link.classList.add('active', 'bg-brand-50', 'text-brand-600', 'dark:bg-brand-900/20', 'dark:text-brand-400');
                link.classList.remove('text-slate-600', 'dark:text-slate-400');
            } else {
                link.classList.remove('active', 'bg-brand-50', 'text-brand-600', 'dark:bg-brand-900/20', 'dark:text-brand-400');
                link.classList.add('text-slate-600', 'dark:text-slate-400');
            }
        });

        // Update sections
        viewSections.forEach(section => {
            if (section.id === targetViewId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Close sidebar on mobile after clicking
        if (window.innerWidth < 768 && !sidebar.classList.contains('-translate-x-full')) {
            toggleSidebar();
        }

        // Trigger chart resize if navigating to analytics or home
        if (targetViewId === 'analytics-view' || targetViewId === 'home-view') {
            setTimeout(() => {
                if (window.appCharts) {
                    if (window.appCharts.mainChart) window.appCharts.mainChart.resize();
                    if (window.appCharts.barChart) window.appCharts.barChart.resize();
                    if (window.appCharts.pieChart) window.appCharts.pieChart.resize();
                }
            }, 50);
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.view;
            if (target) {
                switchView(target);
            }
        });
    });
});
