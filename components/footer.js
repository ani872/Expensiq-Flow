// components/footer.js
class Footer {
    constructor() {
        this.render();
    }

    render() {
        const container = document.getElementById('views-container');
        if (!container) return;

        // Remove existing footer if any
        const existingFooter = container.querySelector('footer#app-footer');
        if (existingFooter) existingFooter.remove();

        const footerHtml = `
        <footer id="app-footer" class="mt-16 bg-slate-900 dark:bg-[#080e1e] text-slate-300 rounded-2xl overflow-hidden shadow-2xl">

            <!-- Top Band -->
            <div class="px-8 pt-10 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                <!-- Brand Column -->
                <div class="lg:col-span-1 space-y-4">
                    <div class="flex items-center gap-2">
                        <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-lg">
                            <i class="fa-solid fa-wallet text-white text-base"></i>
                        </div>
                        <span class="text-xl font-bold text-white" style="font-family:'Sora',sans-serif;">ExpensiqFlow</span>
                    </div>
                    <p class="text-base leading-relaxed text-slate-400">
                        Track Smart. Spend Better. — Your all-in-one personal finance dashboard built for clarity and control.
                    </p>
                    <!-- Social Icons -->
                    <div class="flex items-center gap-3 pt-2">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon text-slate-300 hover:text-white">
                            <i class="fa-brands fa-linkedin-in"></i>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon text-slate-300 hover:text-white">
                            <i class="fa-brands fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" class="social-icon text-slate-300 hover:text-white">
                            <i class="fa-brands fa-x-twitter"></i>
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="social-icon text-slate-300 hover:text-white">
                            <i class="fa-brands fa-youtube"></i>
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="social-icon text-slate-300 hover:text-white">
                            <i class="fa-brands fa-github"></i>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="space-y-4">
                    <h4 class="text-sm font-bold uppercase tracking-widest text-teal-400" style="font-family:'Sora',sans-serif;">Quick Links</h4>
                    <ul class="space-y-3 text-base">
                        <li><a href="#" onclick="document.querySelector('[data-view=\\'home-view\\']').click();return false;" class="hover:text-teal-400 transition-colors flex items-center gap-2"><i class="fa-solid fa-chevron-right text-xs text-teal-600"></i> Dashboard</a></li>
                        <li><a href="#" onclick="document.querySelector('[data-view=\\'transactions-view\\']').click();return false;" class="hover:text-teal-400 transition-colors flex items-center gap-2"><i class="fa-solid fa-chevron-right text-xs text-teal-600"></i> Transactions</a></li>
                        <li><a href="#" onclick="document.querySelector('[data-view=\\'analytics-view\\']').click();return false;" class="hover:text-teal-400 transition-colors flex items-center gap-2"><i class="fa-solid fa-chevron-right text-xs text-teal-600"></i> Analytics</a></li>
                        <li><a href="#" onclick="document.querySelector('[data-view=\\'budgets-view\\']').click();return false;" class="hover:text-teal-400 transition-colors flex items-center gap-2"><i class="fa-solid fa-chevron-right text-xs text-teal-600"></i> Budgets</a></li>
                    </ul>
                </div>

                <!-- Product -->
                <div class="space-y-4">
                    <h4 class="text-sm font-bold uppercase tracking-widest text-teal-400" style="font-family:'Sora',sans-serif;">Product</h4>
                    <ul class="space-y-3 text-base">
                        <li><a href="#" class="hover:text-teal-400 transition-colors flex items-center gap-2"><i class="fa-solid fa-chevron-right text-xs text-teal-600"></i> Features</a></li>
                        <li><a href="#" class="hover:text-teal-400 transition-colors flex items-center gap-2"><i class="fa-solid fa-chevron-right text-xs text-teal-600"></i> Pricing</a></li>
                        <li><a href="#" class="hover:text-teal-400 transition-colors flex items-center gap-2"><i class="fa-solid fa-chevron-right text-xs text-teal-600"></i> Changelog</a></li>
                        <li><a href="#" class="hover:text-teal-400 transition-colors flex items-center gap-2"><i class="fa-solid fa-chevron-right text-xs text-teal-600"></i> Roadmap</a></li>
                    </ul>
                </div>

                <!-- Contact -->
                <div class="space-y-4">
                    <h4 class="text-sm font-bold uppercase tracking-widest text-teal-400" style="font-family:'Sora',sans-serif;">Contact</h4>
                    <ul class="space-y-3 text-sm">
                        <li class="flex items-start gap-3">
                            <i class="fa-solid fa-envelope mt-0.5 text-teal-500 w-4 shrink-0"></i>
                            <a href="mailto:support@expensiqflow.com" class="hover:text-teal-400 transition-colors break-all">support@expensiqflow.com</a>
                        </li>
                        <li class="flex items-start gap-3">
                            <i class="fa-solid fa-phone mt-0.5 text-teal-500 w-4 shrink-0"></i>
                            <a href="tel:+11234567890" class="hover:text-teal-400 transition-colors">+1 (123) 456-7890</a>
                        </li>
                        <li class="flex items-start gap-3">
                            <i class="fa-solid fa-location-dot mt-0.5 text-teal-500 w-4 shrink-0"></i>
                            <span>Kolkata, West Bengal, India</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Divider -->
            <div class="border-t border-slate-700/60 mx-6"></div>

            <!-- Bottom Bar -->
            <div class="px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
                <p>&copy; 2026 <span class="text-slate-400 font-semibold">ExpensiqFlow</span>. All rights reserved.</p>
                <div class="flex items-center gap-5">
                    <a href="#" class="hover:text-teal-400 transition-colors">Privacy Policy</a>
                    <a href="#" class="hover:text-teal-400 transition-colors">Terms of Service</a>
                    <a href="#" class="hover:text-teal-400 transition-colors">Cookie Policy</a>
                </div>
            </div>
        </footer>`;

        container.insertAdjacentHTML('beforeend', footerHtml);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.appFooter = new Footer();
});
