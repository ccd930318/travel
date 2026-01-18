// Toggle backup section
function toggleBackup(button) {
    const section = button.closest('.backup-section');
    section.classList.toggle('collapsed');
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active nav on scroll
const sections = document.querySelectorAll('.day-section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Checklist functionality
function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    // Load saved state
    checkboxes.forEach(checkbox => {
        const id = checkbox.id;
        const saved = localStorage.getItem(`checklist_${id}`);
        if (saved === 'true') {
            checkbox.checked = true;
            checkbox.closest('.checklist-item').classList.add('checked');
        }
        
        // Save on change
        checkbox.addEventListener('change', function() {
            localStorage.setItem(`checklist_${id}`, this.checked);
            this.closest('.checklist-item').classList.toggle('checked', this.checked);
            updateProgress();
        });
    });
    
    updateProgress();
}

function updateProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const total = checkboxes.length;
    const checked = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `${checked}/${total}`;
    }
}

// Reset checklist
function resetChecklist() {
    if (confirm('確定要重設所有項目嗎？')) {
        const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest('.checklist-item').classList.remove('checked');
            localStorage.removeItem(`checklist_${checkbox.id}`);
        });
        updateProgress();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initChecklist();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }
});
