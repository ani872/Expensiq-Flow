// auth.js
class Auth {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Initialize demo data
        if (typeof initializeDemoData === 'function') {
            initializeDemoData();
        }

        // Check session
        const session = Storage.get('currentUser');
        if (session) {
            this.currentUser = session;
            this.showApp();
        } else {
            this.showAuth();
        }

        this.attachEventListeners();
    }

    attachEventListeners() {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const showLoginBtn = document.getElementById('show-login');
        const showSignupBtn = document.getElementById('show-signup');
        const logoutBtn = document.getElementById('logout-btn');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        if (showLoginBtn && showSignupBtn) {
            showLoginBtn.addEventListener('click', () => {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
                showLoginBtn.classList.add('text-brand-600', 'dark:text-brand-500', 'border-brand-500');
                showLoginBtn.classList.remove('text-slate-500', 'border-transparent');
                showSignupBtn.classList.remove('text-brand-600', 'dark:text-brand-500', 'border-brand-500');
                showSignupBtn.classList.add('text-slate-500', 'border-transparent');
            });

            showSignupBtn.addEventListener('click', () => {
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
                showSignupBtn.classList.add('text-brand-600', 'dark:text-brand-500', 'border-brand-500');
                showSignupBtn.classList.remove('text-slate-500', 'border-transparent');
                showLoginBtn.classList.remove('text-brand-600', 'dark:text-brand-500', 'border-brand-500');
                showLoginBtn.classList.add('text-slate-500', 'border-transparent');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Google Sign-In Buttons
        const googleLoginBtn = document.getElementById('google-login-btn');
        const googleSignupBtn = document.getElementById('google-signup-btn');

        if (googleLoginBtn) googleLoginBtn.addEventListener('click', () => this.triggerGoogleSignIn());
        if (googleSignupBtn) googleSignupBtn.addEventListener('click', () => this.triggerGoogleSignIn());
    }

    triggerGoogleSignIn() {
        // Check if google accounts API is loaded
        if (typeof google === 'undefined' || !google.accounts) {
            Helpers.showToast('Google Sign-In is not available. Please check your connection.', 'error');
            return;
        }
        google.accounts.id.initialize({
            // NOTE: Replace with your real Google Client ID from console.cloud.google.com
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: (response) => this.handleGoogleSignIn(response),
            auto_select: false,
            cancel_on_tap_outside: true
        });
        google.accounts.id.prompt();
    }

    handleGoogleSignIn(response) {
        try {
            // Decode JWT payload (base64) — no signature verification needed client-side
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));

            const { name, email, sub: googleId, picture } = payload;

            let users = Storage.get('users') || [];
            let user = users.find(u => u.email === email);

            if (!user) {
                // Auto-register Google user
                user = {
                    id: 'ggl_' + googleId,
                    name,
                    email,
                    password: null, // Google users have no password
                    picture: picture || null,
                    provider: 'google'
                };
                users.push(user);
                Storage.set('users', users);
                Storage.set(`transactions_${user.id}`, []);
            }

            this.currentUser = { id: user.id, name: user.name, email: user.email, picture: user.picture };
            Storage.set('currentUser', this.currentUser);
            Helpers.showToast(`Welcome, ${user.name}! 🎉`, 'success');

            // Show avatar picture if available
            if (user.picture) {
                const avatarEl = document.getElementById('user-initial');
                if (avatarEl) {
                    avatarEl.innerHTML = `<img src="${user.picture}" class="w-full h-full rounded-full object-cover" alt="Avatar">`;
                }
            }

            this.showApp();
        } catch (err) {
            console.error('Google Sign-In error:', err);
            Helpers.showToast('Google Sign-In failed. Please try again.', 'error');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!Validations.validateEmail(email)) {
            Helpers.showToast('Please enter a valid email address.', 'error');
            return;
        }

        const users = Storage.get('users') || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = { id: user.id, name: user.name, email: user.email };
            Storage.set('currentUser', this.currentUser);
            Helpers.showToast(`Welcome back, ${user.name}!`, 'success');
            
            // Seed transactions for demo user if none exist
            if (user.id === 'usr_demo_123' && !Storage.get(`transactions_${user.id}`)) {
                Storage.set(`transactions_${user.id}`, typeof demoTransactions !== 'undefined' ? demoTransactions : []);
            }

            this.showApp();
        } else {
            Helpers.showToast('Invalid email or password.', 'error');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;

        if (!Validations.validateName(name)) {
            Helpers.showToast('Name must be at least 2 characters.', 'error');
            return;
        }

        if (!Validations.validateEmail(email)) {
            Helpers.showToast('Please enter a valid email address.', 'error');
            return;
        }

        if (!Validations.validatePassword(password)) {
            Helpers.showToast('Password must be at least 6 characters.', 'error');
            return;
        }

        const users = Storage.get('users') || [];
        if (users.find(u => u.email === email)) {
            Helpers.showToast('Email already in use.', 'error');
            return;
        }

        const newUser = {
            id: 'usr_' + Helpers.generateId(),
            name,
            email,
            password
        };

        users.push(newUser);
        Storage.set('users', users);
        
        // Auto login
        this.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        Storage.set('currentUser', this.currentUser);
        Storage.set(`transactions_${newUser.id}`, []); // Initialize empty transactions
        
        Helpers.showToast('Account created successfully!', 'success');
        this.showApp();
    }

    handleLogout() {
        this.currentUser = null;
        Storage.remove('currentUser');
        Helpers.showToast('Logged out successfully.', 'info');
        this.showAuth();
        
        // Clear forms
        document.getElementById('login-form').reset();
        document.getElementById('signup-form').reset();
    }

    showApp() {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        
        // Update user UI
        document.getElementById('user-greeting').textContent = `Hi, ${this.currentUser.name.split(' ')[0]}`;
        document.getElementById('user-initial').textContent = this.currentUser.name.charAt(0).toUpperCase();

        // Trigger an event so other components know user is logged in
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: this.currentUser }));
    }

    showAuth() {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
        document.dispatchEvent(new Event('userLoggedOut'));
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

window.appAuth = new Auth();
