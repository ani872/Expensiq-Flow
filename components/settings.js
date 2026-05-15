// components/settings.js
class Settings {
    constructor() {
        this.profile = {};
        this.render();
        this.attachEventListeners();
    }

    render() {
        const section = document.getElementById('settings-view');
        if (!section) return;
        const inp = (id, type, placeholder, extra = '') =>
            `<input type="${type}" id="${id}" placeholder="${placeholder}" ${extra} class="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all">`;

        section.innerHTML = `
        <div>
            <h1 class="text-2xl font-bold">Settings &amp; Profile</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Manage your account and personal details.</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Profile Card -->
            <div class="glass rounded-2xl p-6 flex flex-col items-center text-center gap-4">
                <div class="relative group">
                    <div id="profile-avatar-wrapper" class="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-500 to-blue-500 text-white flex items-center justify-center text-4xl font-bold shadow-xl overflow-hidden border-4 border-white dark:border-dark-border">
                        <span id="profile-avatar-initial">U</span>
                    </div>
                    <label for="avatar-upload" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <i class="fa-solid fa-camera text-white text-xl"></i>
                    </label>
                    <input type="file" id="avatar-upload" accept="image/*" class="hidden">
                </div>
                <div>
                    <h2 id="profile-display-name" class="text-xl font-bold">User Name</h2>
                    <p id="profile-display-email" class="text-sm text-slate-500 dark:text-slate-400">user@example.com</p>
                </div>
                <p id="profile-display-bio" class="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed px-2">No bio yet. Tell us about yourself!</p>
                <div id="profile-display-location" class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <i class="fa-solid fa-location-dot text-brand-500"></i>
                    <span>Location not set</span>
                </div>
            </div>
            <!-- Edit Form -->
            <div class="lg:col-span-2 glass rounded-2xl p-6 space-y-5">
                <h3 class="text-lg font-bold border-b border-slate-200 dark:border-dark-border pb-3">Edit Profile</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-semibold mb-1">Full Name</label>${inp('settings-name','text','Your full name')}</div>
                    <div><label class="block text-sm font-semibold mb-1">Email</label>${inp('settings-email','email','your@email.com')}</div>
                    <div><label class="block text-sm font-semibold mb-1">Phone</label>${inp('settings-phone','tel','+91 XXXXX XXXXX')}</div>
                    <div><label class="block text-sm font-semibold mb-1">Date of Birth</label>${inp('settings-dob','date','')}</div>
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-1">Bio</label>
                    <textarea id="settings-bio" rows="3" placeholder="Write something about yourself..." class="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all resize-none"></textarea>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="block text-sm font-semibold mb-1">City</label>${inp('settings-city','text','Kolkata')}</div>
                    <div><label class="block text-sm font-semibold mb-1">Country</label>${inp('settings-country','text','India')}</div>
                </div>
                <button id="detect-location-btn" class="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all text-sm font-semibold">
                    <i class="fa-solid fa-location-crosshairs"></i> Auto-Detect My Location
                </button>
                <button id="save-profile-btn" class="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-500/30 transition-all hover-lift">
                    Save Profile
                </button>
            </div>
        </div>`;
    }

    loadProfile() {
        const user = window.appAuth.getCurrentUser();
        if (!user) return;

        const savedProfile = Storage.get(`profile_${user.id}`) || {};
        this.profile = {
            name: savedProfile.name || user.name || '',
            email: savedProfile.email || user.email || '',
            phone: savedProfile.phone || '',
            dob: savedProfile.dob || '',
            bio: savedProfile.bio || '',
            city: savedProfile.city || '',
            country: savedProfile.country || '',
            avatar: savedProfile.avatar || null,
        };

        this.populateForm();
        this.updateProfileCard();
    }

    populateForm() {
        const p = this.profile;
        const safe = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || '';
        };
        safe('settings-name', p.name);
        safe('settings-email', p.email);
        safe('settings-phone', p.phone);
        safe('settings-dob', p.dob);
        safe('settings-bio', p.bio);
        safe('settings-city', p.city);
        safe('settings-country', p.country);
    }

    updateProfileCard() {
        const p = this.profile;

        // Avatar
        const wrapper = document.getElementById('profile-avatar-wrapper');
        const initial = document.getElementById('profile-avatar-initial');
        if (wrapper && p.avatar) {
            wrapper.innerHTML = `<img src="${p.avatar}" class="w-full h-full object-cover" alt="Avatar">`;
        } else if (initial) {
            initial.textContent = (p.name || 'U').charAt(0).toUpperCase();
        }

        // Also update the top navbar avatar
        const navInitial = document.getElementById('user-initial');
        if (navInitial) {
            if (p.avatar) {
                navInitial.innerHTML = `<img src="${p.avatar}" class="w-full h-full rounded-full object-cover" alt="Avatar">`;
                navInitial.closest('div').classList.add('overflow-hidden', 'p-0');
            } else {
                navInitial.textContent = (p.name || 'U').charAt(0).toUpperCase();
            }
        }

        // Name / Email
        const nameEl = document.getElementById('profile-display-name');
        const emailEl = document.getElementById('profile-display-email');
        if (nameEl) nameEl.textContent = p.name || 'User Name';
        if (emailEl) emailEl.textContent = p.email || 'user@example.com';

        // Bio
        const bioEl = document.getElementById('profile-display-bio');
        if (bioEl) bioEl.textContent = p.bio ? `"${p.bio}"` : 'No bio yet. Tell us about yourself! ✨';

        // Location
        const locEl = document.getElementById('profile-display-location');
        if (locEl) {
            const parts = [p.city, p.country].filter(Boolean);
            const locationSpan = locEl.querySelector('span');
            if (locationSpan) {
                locationSpan.textContent = parts.length > 0 ? parts.join(', ') : 'Location not set';
            }
        }

        // Update navbar greeting
        const greetEl = document.getElementById('user-greeting');
        if (greetEl && p.name) {
            greetEl.textContent = `Hi, ${p.name.split(' ')[0]} 👋`;
        }
    }

    saveProfile() {
        const getVal = (id) => (document.getElementById(id)?.value || '').trim();

        this.profile.name = getVal('settings-name');
        this.profile.email = getVal('settings-email');
        this.profile.phone = getVal('settings-phone');
        this.profile.dob = getVal('settings-dob');
        this.profile.bio = getVal('settings-bio');
        this.profile.city = getVal('settings-city');
        this.profile.country = getVal('settings-country');

        const user = window.appAuth.getCurrentUser();
        if (!user) return;

        Storage.set(`profile_${user.id}`, this.profile);
        this.updateProfileCard();
        Helpers.showToast('✅ Profile saved successfully!', 'success');
    }

    handleAvatarUpload(file) {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            Helpers.showToast('❌ Please upload an image file.', 'error');
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            Helpers.showToast('❌ Image must be under 3 MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.profile.avatar = e.target.result;
            const wrapper = document.getElementById('profile-avatar-wrapper');
            if (wrapper) {
                wrapper.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover" alt="Avatar">`;
            }
            Helpers.showToast('🖼️ Avatar updated! Save to keep.', 'info');
        };
        reader.readAsDataURL(file);
    }

    detectLocation() {
        if (!navigator.geolocation) {
            Helpers.showToast('❌ Geolocation is not supported by your browser.', 'error');
            return;
        }

        const btn = document.getElementById('detect-location-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Detecting...';
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    const address = data.address || {};

                    const city = address.city || address.town || address.village || address.county || '';
                    const country = address.country || '';

                    const cityEl = document.getElementById('settings-city');
                    const countryEl = document.getElementById('settings-country');
                    if (cityEl) cityEl.value = city;
                    if (countryEl) countryEl.value = country;

                    Helpers.showToast(`📍 Location detected: ${city}, ${country}`, 'success');
                } catch {
                    Helpers.showToast('⚠️ Could not reverse-geocode location. Enter manually.', 'info');
                }

                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> 📍 Auto-Detect My Location';
                }
            },
            (err) => {
                let msg = '❌ Location access denied.';
                if (err.code === err.TIMEOUT) msg = '⏱️ Location request timed out.';
                Helpers.showToast(msg, 'error');
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> 📍 Auto-Detect My Location';
                }
            },
            { timeout: 10000 }
        );
    }

    attachEventListeners() {
        document.addEventListener('userLoggedIn', () => {
            this.loadProfile();
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('#save-profile-btn')) {
                this.saveProfile();
            }
            if (e.target.closest('#detect-location-btn')) {
                this.detectLocation();
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.id === 'avatar-upload') {
                this.handleAvatarUpload(e.target.files[0]);
            }
        });
    }
}

window.appSettings = new Settings();
