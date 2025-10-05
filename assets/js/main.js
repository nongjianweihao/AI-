const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const chips = document.querySelectorAll('.chip');
const scheduleRows = document.querySelectorAll('.schedule__row');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        navToggle.classList.toggle('active');
    });
}

chips.forEach((chip) => {
    chip.addEventListener('click', () => {
        const filter = chip.dataset.filter;

        chips.forEach((c) => c.classList.remove('chip--active'));
        chip.classList.add('chip--active');

        scheduleRows.forEach((row) => {
            if (filter === 'all' || row.dataset.type === filter) {
                row.style.display = 'grid';
            } else {
                row.style.display = 'none';
            }
        });
    });
});

const toggleBackToTop = () => {
    if (window.scrollY > 240) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
};

window.addEventListener('scroll', toggleBackToTop);
toggleBackToTop();

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const forms = document.querySelectorAll('form');
forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('感谢您的关注，我们的顾问将尽快与您联系！');
        form.reset();
    });
});
