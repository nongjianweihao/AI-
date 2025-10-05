const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');
const modalTriggers = document.querySelectorAll('[data-modal-target]');
const modalDismiss = document.querySelectorAll('[data-modal-dismiss]');
const forms = document.querySelectorAll('form');
const trialForm = document.getElementById('trial-form');
const trialStatus = trialForm ? trialForm.querySelector('.form__status') : null;
let activeModal = null;

const toggleNav = () => {
    if (!navToggle || !navLinks) return;
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.classList.toggle('is-active');
    navLinks.classList.toggle('show');
};

navToggle?.addEventListener('click', toggleNav);

navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 960) {
            navLinks.classList.remove('show');
            navToggle?.setAttribute('aria-expanded', 'false');
            navToggle?.classList.remove('is-active');
        }
    });
});

const handleBackToTop = () => {
    if (!backToTop) return;
    if (window.scrollY > 320) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
};

backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (backToTop) {
    window.addEventListener('scroll', handleBackToTop);
    handleBackToTop();
}

const openModal = (selector) => {
    const modal = document.querySelector(selector);
    if (!modal) return;
    activeModal = modal;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('button, [href], input, select, textarea');
    focusable?.focus();
};

const closeModal = () => {
    if (!activeModal) return;
    activeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeModal = null;
};

modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        const target = trigger.getAttribute('data-modal-target');
        if (!target) return;
        openModal(target);
    });
});

modalDismiss.forEach((dismiss) => {
    dismiss.addEventListener('click', () => {
        const modal = dismiss.closest('.modal');
        if (modal) {
            activeModal = modal;
        }
        closeModal();
    });
});

document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            activeModal = modal;
            closeModal();
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeModal) {
        closeModal();
    }
});

const analyticsElements = document.querySelectorAll('[data-track]');
analyticsElements.forEach((element) => {
    element.addEventListener('click', () => {
        const label = element.getAttribute('data-track-label') || 'unknown';
        const type = element.getAttribute('data-track');
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'cta_click',
            trackType: type,
            trackLabel: label,
        });
    });
});

const parseUTM = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        source: params.get('utm_source') || '',
        medium: params.get('utm_medium') || '',
        campaign: params.get('utm_campaign') || '',
    };
};

const fillUTMFields = () => {
    if (!trialForm) return;
    const utm = parseUTM();
    trialForm.querySelector('[name="utm_source"]').value = utm.source;
    trialForm.querySelector('[name="utm_medium"]').value = utm.medium;
    trialForm.querySelector('[name="utm_campaign"]').value = utm.campaign;
};

fillUTMFields();

const submitTrialForm = async (event) => {
    event.preventDefault();
    if (!trialForm) return;
    const data = new FormData(trialForm);

    try {
        const response = await fetch(trialForm.action, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: data,
        });

        if (response.ok) {
            trialForm.reset();
            fillUTMFields();
            if (trialStatus) {
                trialStatus.textContent = '预约成功提交，我们将在 24 小时内联系您确认。';
                trialStatus.style.color = 'var(--color-primary)';
            }
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'form_submit', formId: 'trial' });
        } else {
            throw new Error('网络异常');
        }
    } catch (error) {
        if (trialStatus) {
            trialStatus.textContent = '提交失败，请稍后重试或直接拨打 400-800-1234。';
            trialStatus.style.color = 'var(--color-accent)';
        }
    }
};

trialForm?.addEventListener('submit', submitTrialForm);

forms.forEach((form) => {
    form.addEventListener('submit', () => {
        const label = form.getAttribute('id') || 'form';
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'form_attempt', formId: label });
    });
});

const observeLazyMedia = () => {
    const media = document.querySelectorAll('img[loading="lazy"]');
    if (!('IntersectionObserver' in window)) {
        media.forEach((el) => {
            if (el.dataset && el.dataset.src) {
                el.src = el.dataset.src;
            }
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                if (target.dataset && target.dataset.src) {
                    target.src = target.dataset.src;
                }
                observer.unobserve(target);
            }
        });
    });

    media.forEach((el) => observer.observe(el));
};

observeLazyMedia();
