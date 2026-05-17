/* ==========================================================================
   GYMLIFE JAVASCRIPT CONTROLLER
   Handles interactions, sliders, selectors, form validations, and cache
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. STICKY HEADER & SCROLL BEHAVIOR */
    const mainHeader = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });


    /* 2. MOBILE MENU NAVIGATION TOGGLE */
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggleBtn && navMenu) {
        menuToggleBtn.addEventListener('click', () => {
            const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
            menuToggleBtn.setAttribute('aria-expanded', !isExpanded);
            menuToggleBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on any navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggleBtn.setAttribute('aria-expanded', 'false');
                menuToggleBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    /* 3. DYNAMIC ACTIVE NAV INDICATOR ON SCROLL */
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActiveIndicator() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(item => item.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActiveIndicator);


    /* 4. HERO SECTION SPLIT TOGGLE (GYM VS TURF) */
    const heroTabGym = document.getElementById('heroTabGym');
    const heroTabTurf = document.getElementById('heroTabTurf');
    const heroBgGym = document.querySelector('.hero-bg-side.gym-side');
    const heroBgTurf = document.querySelector('.hero-bg-side.turf-side');
    const heroContentGym = document.getElementById('heroContentGym');
    const heroContentTurf = document.getElementById('heroContentTurf');

    function switchHeroFacility(toTurf) {
        if (toTurf) {
            heroTabGym.classList.remove('active');
            heroTabGym.setAttribute('aria-selected', 'false');
            heroTabTurf.classList.add('active');
            heroTabTurf.setAttribute('aria-selected', 'true');
            
            heroBgGym.classList.remove('active');
            heroBgTurf.classList.add('active');
            
            heroContentGym.classList.remove('active');
            heroContentTurf.classList.add('active');
        } else {
            heroTabTurf.classList.remove('active');
            heroTabTurf.setAttribute('aria-selected', 'false');
            heroTabGym.classList.add('active');
            heroTabGym.setAttribute('aria-selected', 'true');
            
            heroBgTurf.classList.remove('active');
            heroBgGym.classList.add('active');
            
            heroContentTurf.classList.remove('active');
            heroContentGym.classList.add('active');
        }
    }

    if (heroTabGym && heroTabTurf) {
        heroTabGym.addEventListener('click', () => switchHeroFacility(false));
        heroTabTurf.addEventListener('click', () => switchHeroFacility(true));
        
        // Auto alternate hero every 12 seconds unless interactive input occurs
        let heroInterval = setInterval(() => {
            const isGymActive = heroTabGym.classList.contains('active');
            switchHeroFacility(isGymActive);
        }, 12000);
        
        const clearHeroTimer = () => {
            clearInterval(heroInterval);
        };
        
        heroTabGym.addEventListener('click', clearHeroTimer);
        heroTabTurf.addEventListener('click', clearHeroTimer);
    }


    /* 5. PRICING PLAN SELECTOR SWITCHER */
    const pricingTabGym = document.getElementById('pricingTabGym');
    const pricingTabTurf = document.getElementById('pricingTabTurf');
    const pricingContentGym = document.getElementById('pricingContentGym');
    const pricingContentTurf = document.getElementById('pricingContentTurf');

    function switchPricingTab(toTurf) {
        if (toTurf) {
            pricingTabGym.classList.remove('active');
            pricingTabGym.setAttribute('aria-selected', 'false');
            pricingTabTurf.classList.add('active');
            pricingTabTurf.setAttribute('aria-selected', 'true');
            
            pricingContentGym.classList.remove('active');
            pricingContentTurf.classList.add('active');
        } else {
            pricingTabTurf.classList.remove('active');
            pricingTabTurf.setAttribute('aria-selected', 'false');
            pricingTabGym.classList.add('active');
            pricingTabGym.setAttribute('aria-selected', 'true');
            
            pricingContentTurf.classList.remove('active');
            pricingContentGym.classList.add('active');
        }
        
        // Trigger scroll reveals in pricing to avoid missing hidden cards
        triggerScrollReveal();
    }

    if (pricingTabGym && pricingTabTurf) {
        pricingTabGym.addEventListener('click', () => switchPricingTab(false));
        pricingTabTurf.addEventListener('click', () => switchPricingTab(true));
    }


    /* 6. DYNAMIC GALLERY MEDIA FILTERING */
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filterValue = tab.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hidden');
                } else if (item.classList.contains(`${filterValue}-item`)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });


    /* 7. INTERACTIVE BEFORE/AFTER TRANSFORMATION SLIDER */
    const baSlider = document.getElementById('baSliderContainer');
    const baAfterImg = document.getElementById('baAfterImage');
    const baHandle = document.getElementById('baHandle');

    if (baSlider && baAfterImg && baHandle) {
        let isDragging = false;
        
        const updateSliderPos = (clientX) => {
            const rect = baSlider.getBoundingClientRect();
            const posX = clientX - rect.left;
            let percentage = (posX / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;
            
            baAfterImg.style.width = `${percentage}%`;
            baHandle.style.left = `${percentage}%`;
        };
        
        // Desktop mouse actions
        baHandle.addEventListener('mousedown', () => {
            isDragging = true;
            baSlider.classList.add('dragging');
        });
        
        window.addEventListener('mouseup', () => {
            isDragging = false;
            baSlider.classList.remove('dragging');
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSliderPos(e.clientX);
        });
        
        // Touch events for perfect mobile support
        baHandle.addEventListener('touchstart', () => {
            isDragging = true;
        }, { passive: true });
        
        window.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches && e.touches.length > 0) {
                updateSliderPos(e.touches[0].clientX);
            }
        }, { passive: true });

        // Click inside slider box anywhere to move handle instantly
        baSlider.addEventListener('click', (e) => {
            if (e.target.closest('#baHandle')) return; // Avoid double fires on handle click
            updateSliderPos(e.clientX);
        });
    }


    /* 8. MOTIVATIONAL TESTIMONIALS SLIDER */
    const testiSlides = document.querySelectorAll('.testimonial-slide');
    const testiDots = document.querySelectorAll('.testi-dot');
    const testiPrevBtn = document.getElementById('testiPrevBtn');
    const testiNextBtn = document.getElementById('testiNextBtn');
    let currentSlideIndex = 0;
    let sliderTimer = null;

    function showTestimonialSlide(index) {
        testiSlides.forEach(slide => slide.classList.remove('active'));
        testiDots.forEach(dot => dot.classList.remove('active'));
        
        currentSlideIndex = (index + testiSlides.length) % testiSlides.length;
        
        testiSlides[currentSlideIndex].classList.add('active');
        testiDots[currentSlideIndex].classList.add('active');
    }

    function setupSliderTimer() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(() => {
            showTestimonialSlide(currentSlideIndex + 1);
        }, 6500);
    }

    if (testiSlides.length > 0) {
        showTestimonialSlide(0);
        setupSliderTimer();
        
        testiNextBtn.addEventListener('click', () => {
            showTestimonialSlide(currentSlideIndex + 1);
            setupSliderTimer();
        });
        
        testiPrevBtn.addEventListener('click', () => {
            showTestimonialSlide(currentSlideIndex - 1);
            setupSliderTimer();
        });
        
        testiDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIndex = parseInt(dot.getAttribute('data-index'));
                showTestimonialSlide(targetIndex);
                setupSliderTimer();
            });
        });
        
        // Pause timer on hover to let users read reviews easily
        const testiSliderContainer = document.getElementById('testiSliderContainer');
        if (testiSliderContainer) {
            testiSliderContainer.addEventListener('mouseenter', () => clearInterval(sliderTimer));
            testiSliderContainer.addEventListener('mouseleave', setupSliderTimer);
        }
    }


    /* 9. INTERACTIVE FAQ ACCORDION */
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const faqContent = trigger.nextElementSibling;
            const isCurrentlyActive = faqItem.classList.contains('active');
            
            // Close all other active accordion items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                item.querySelector('.faq-content').style.maxHeight = null;
            });
            
            // Toggle clicked element
            if (!isCurrentlyActive) {
                faqItem.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                faqContent.style.maxHeight = faqContent.scrollHeight + "px";
            }
        });
    });

    // Set height of the default active item (Question 1) on load
    const defaultActiveFaq = document.querySelector('.faq-item.active .faq-content');
    if (defaultActiveFaq) {
        defaultActiveFaq.style.maxHeight = defaultActiveFaq.scrollHeight + "px";
    }

    // Dynamic resize listener to prevent layout clipping inside expanded accordions
    window.addEventListener('resize', () => {
        const activeFaqContent = document.querySelector('.faq-item.active .faq-content');
        if (activeFaqContent) {
            activeFaqContent.style.maxHeight = activeFaqContent.scrollHeight + "px";
        }
    });


    /* 10. CONTACT FORM VALIDATOR & STORAGE CACHING */
    const gymContactForm = document.getElementById('gymContactForm');
    const formSuccessOverlay = document.getElementById('formSuccessOverlay');
    const successUserSpan = document.getElementById('successUser');
    const successTypeSpan = document.getElementById('successType');
    const successCloseBtn = document.getElementById('successCloseBtn');

    // Live validation helpers
    function validateField(inputElement, errorElement, conditionFn) {
        const formGroup = inputElement.closest('.form-group');
        if (conditionFn()) {
            formGroup.classList.remove('invalid');
            return true;
        } else {
            formGroup.classList.add('invalid');
            return false;
        }
    }

    if (gymContactForm) {
        const nameInput = document.getElementById('formName');
        const phoneInput = document.getElementById('formPhone');
        const goalSelect = document.getElementById('formGoal');
        const messageInput = document.getElementById('formMessage');

        // Event listeners for blur validation
        nameInput.addEventListener('blur', () => {
            validateField(nameInput, null, () => nameInput.value.trim() !== '');
        });
        
        phoneInput.addEventListener('blur', () => {
            validateField(phoneInput, null, () => {
                const phoneVal = phoneInput.value.trim();
                return /^\d{10}$/.test(phoneVal);
            });
        });
        
        goalSelect.addEventListener('change', () => {
            validateField(goalSelect, null, () => goalSelect.value !== '');
        });

        gymContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isNameValid = validateField(nameInput, null, () => nameInput.value.trim() !== '');
            const isPhoneValid = validateField(phoneInput, null, () => /^\d{10}$/.test(phoneInput.value.trim()));
            const isGoalValid = validateField(goalSelect, null, () => goalSelect.value !== '');
            
            if (isNameValid && isPhoneValid && isGoalValid) {
                // Prepare lead object
                const leadData = {
                    name: nameInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    inquiryType: goalSelect.value,
                    message: messageInput.value.trim(),
                    timestamp: new Date().toISOString()
                };
                
                // Cache lead to localStorage
                const storedLeads = JSON.parse(localStorage.getItem('gymlife_leads') || '[]');
                storedLeads.push(leadData);
                localStorage.setItem('gymlife_leads', JSON.stringify(storedLeads));
                
                // Customize success overlay messaging
                let goalLabelText = "Gymlife programs";
                if (goalSelect.value === 'gym_membership') goalLabelText = "Gym Membership";
                else if (goalSelect.value === 'personal_training') goalLabelText = "Personal Training Program";
                else if (goalSelect.value === 'turf_hourly') goalLabelText = "Cricket Turf slot reservation";
                else if (goalSelect.value === 'turf_tournament') goalLabelText = "Corporate Cricket Tournament";
                else if (goalSelect.value === 'free_trial') goalLabelText = "Free 1-Day Trial Pass";
                
                successUserSpan.textContent = leadData.name;
                successTypeSpan.textContent = goalLabelText;
                
                // Reveal success visual
                formSuccessOverlay.classList.add('active');
                formSuccessOverlay.setAttribute('aria-hidden', 'false');
                
                // Reset form inputs
                gymContactForm.reset();
                document.querySelectorAll('#gymContactForm .form-group').forEach(group => {
                    group.classList.remove('invalid');
                });
            }
        });
        
        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', () => {
                formSuccessOverlay.classList.remove('active');
                formSuccessOverlay.setAttribute('aria-hidden', 'true');
            });
        }
    }


    /* 11. TIMED FREE TRIAL POPUP MECHANICS */
    const trialModalOverlay = document.getElementById('trialModalOverlay');
    const trialModalCloseBtn = document.getElementById('trialModalCloseBtn');
    const modalTrialForm = document.getElementById('modalTrialForm');
    const modalSuccessScreen = document.getElementById('modalSuccessScreen');
    const modalSuccessUser = document.getElementById('modalSuccessUser');
    const modalSuccessCloseBtn = document.getElementById('modalSuccessCloseBtn');
    
    // Explicit footer popup trigger button
    const triggerTrialPopupBtn = document.getElementById('triggerTrialPopupBtn');

    function openTrialModal() {
        if (trialModalOverlay) {
            trialModalOverlay.classList.add('active');
            trialModalOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Disable background page scrolls
        }
    }

    function closeTrialModal() {
        if (trialModalOverlay) {
            trialModalOverlay.classList.remove('active');
            trialModalOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto'; // Enable scrolling back
            
            // Clean dynamic success screen state inside popup
            if (modalSuccessScreen) {
                modalSuccessScreen.classList.remove('active');
                modalSuccessScreen.setAttribute('aria-hidden', 'true');
            }
            if (modalTrialForm) {
                modalTrialForm.reset();
                document.querySelectorAll('#modalTrialForm .form-group').forEach(g => g.classList.remove('invalid'));
            }
        }
    }

    // Auto popup after 6 seconds, check session persistence so it only popups once
    const modalShownKey = 'gymlife_modal_shown';
    const isModalShown = sessionStorage.getItem(modalShownKey);
    
    if (!isModalShown) {
        setTimeout(() => {
            // Confirm modal is present and contact success overlay is not actively showing
            const isContactOverlayActive = formSuccessOverlay && formSuccessOverlay.classList.contains('active');
            if (!isContactOverlayActive) {
                openTrialModal();
                sessionStorage.setItem(modalShownKey, 'true');
            }
        }, 6000);
    }

    if (trialModalCloseBtn) {
        trialModalCloseBtn.addEventListener('click', closeTrialModal);
    }

    if (triggerTrialPopupBtn) {
        triggerTrialPopupBtn.addEventListener('click', openTrialModal);
    }

    // Dismiss by clicking background backdrop
    if (trialModalOverlay) {
        trialModalOverlay.addEventListener('click', (e) => {
            if (e.target === trialModalOverlay) {
                closeTrialModal();
            }
        });
        
        // Escape key binding to dismiss popup
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && trialModalOverlay.classList.contains('active')) {
                closeTrialModal();
            }
        });
    }

    // Modal Form Validation and submission
    if (modalTrialForm) {
        const modalNameInput = document.getElementById('modalName');
        const modalPhoneInput = document.getElementById('modalPhone');

        modalNameInput.addEventListener('blur', () => {
            validateField(modalNameInput, null, () => modalNameInput.value.trim() !== '');
        });
        modalPhoneInput.addEventListener('blur', () => {
            validateField(modalPhoneInput, null, () => /^\d{10}$/.test(modalPhoneInput.value.trim()));
        });

        modalTrialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isNameValid = validateField(modalNameInput, null, () => modalNameInput.value.trim() !== '');
            const isPhoneValid = validateField(modalPhoneInput, null, () => /^\d{10}$/.test(modalPhoneInput.value.trim()));
            
            if (isNameValid && isPhoneValid) {
                const leadData = {
                    name: modalNameInput.value.trim(),
                    phone: modalPhoneInput.value.trim(),
                    inquiryType: 'free_trial',
                    message: 'Modal auto trial claim pass',
                    timestamp: new Date().toISOString()
                };
                
                // Cache trial lead
                const storedLeads = JSON.parse(localStorage.getItem('gymlife_leads') || '[]');
                storedLeads.push(leadData);
                localStorage.setItem('gymlife_leads', JSON.stringify(storedLeads));
                
                // Show modal success screen
                modalSuccessUser.textContent = leadData.name;
                modalSuccessScreen.classList.add('active');
                modalSuccessScreen.setAttribute('aria-hidden', 'false');
            }
        });

        if (modalSuccessCloseBtn) {
            modalSuccessCloseBtn.addEventListener('click', closeTrialModal);
        }
    }


    /* 12. SCROLL REVEAL MANAGER */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    function triggerScrollReveal() {
        const triggerBottom = window.innerHeight * 0.88;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Initial run on load, then attach to scrolls
    triggerScrollReveal();
    window.addEventListener('scroll', triggerScrollReveal);
});
