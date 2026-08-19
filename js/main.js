(function() {
    let lastFocusedElement = null;

    function init() {
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        syncThemeUI();
        checkWorkingHours();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.syncThemeUI = function() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light-red';
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.textContent = isLight ? '☾' : '☀';
            btn.classList.toggle('sun-mode', !isLight);
        }
    };

    window.toggleTheme = function() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light-red';
        const newTheme = isLight ? 'dark' : 'light-red';
        
        if (newTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'light-red');
        }
        localStorage.setItem('theme', newTheme);
        syncThemeUI();
    };

    function checkWorkingHours() {
        const now = new Date();
        const day = now.getDay(); 
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        const holidays = ["01-01","01-02","01-03","01-04","01-05","01-06","01-07","01-08","02-23","03-08","05-01","05-09","06-12","11-04"];
        const today = String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

        const isOpen = !holidays.includes(today) && (
            (day >= 1 && day <= 5 && currentMinutes >= 600 && currentMinutes < 1080) ||
            (day === 6 && currentMinutes >= 600 && currentMinutes < 840)
        );

        const el = document.getElementById('statusIndicator');
        if (el) {
            const statusText = isOpen ? 'ONLINE' : 'OFFLINE';
            el.textContent = statusText;
            el.setAttribute('data-status', statusText);
        }
    }

    window.openModal = function(imgSrc) {
        lastFocusedElement = document.activeElement;
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');

        if (modal && modalImg) {
            modalImg.src = imgSrc;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) closeBtn.focus();
        }
    };

    window.closeModal = function() {
        const modal = document.getElementById('imageModal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';

            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
})();
