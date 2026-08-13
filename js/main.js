let lastFocusedElement = null;

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    syncThemeUI();
    checkWorkingHours();
});

function syncThemeUI() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light-red';
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = isLight ? '☾' : '☀';
        btn.classList.toggle('sun-mode', !isLight);
    }
}

function toggleTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light-red';
    const newTheme = isLight ? 'dark' : 'light-red';
    
    if (newTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', 'light-red');
    }
    localStorage.setItem('theme', newTheme);
    syncThemeUI();
}

function checkWorkingHours() {
    const now = new Date();
    const day = now.getDay(); 
    
    // Перевод текущего времени в минуты от начала дня
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const holidays = ["01-01","01-02","01-03","01-04","01-05","01-06","01-07","01-08","02-23","03-08","05-01","05-09","06-12","11-04"];
    const today = String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

    // Время работы в минутах: 10:00 = 600 мин, 18:00 = 1080 мин, 14:00 = 840 мин
    const isOpen = !holidays.includes(today) && (
        (day >= 1 && day <= 5 && currentMinutes >= 600 && currentMinutes < 1080) ||
        (day === 6 && currentMinutes >= 600 && currentMinutes < 840)
    );

    const el = document.getElementById('statusIndicator');
    if (el) {
        el.textContent = isOpen ? 'ONLINE' : 'OFFLINE';
        el.classList.toggle('status-online', isOpen);
        el.classList.toggle('status-offline', !isOpen);
    }
}

/* Функции для управления модальным окном просмотрщика фото */
function openModal(imgSrc) {
    lastFocusedElement = document.activeElement;
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;

    if (modal && modalImg) {
        modalImg.src = imgSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (closeBtn) {
            closeBtn.focus();
        }
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
