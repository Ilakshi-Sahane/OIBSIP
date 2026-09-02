document.addEventListener('DOMContentLoaded', () => {

  /*  TYPEWRITER EFFECT IN HERO SECTION */
  const typewriterTarget = document.getElementById('typewriter-target');
  const rolesList = [
    "Frontend Developer",
    "Java Developer",
    "Web Application Developer",
    "Computer Engineering Student"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeWriter() {
    if (!typewriterTarget) return;

    const currentRole = rolesList[roleIndex];

    if (isDeleting) {
      typewriterTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % rolesList.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeWriter, typingSpeed);
  }

  typeWriter();


  /*  STICKY HEADER BACKGROUND & ACTIVE NAV LINK HIGHLIGHT */
  const mainHeader = document.getElementById('main-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item-link');

  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', handleHeaderScroll);


  /*  MOBILE DRAWER MENU TOGGLE */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawerMenu = document.getElementById('mobile-drawer-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuToggle && mobileDrawerMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileDrawerMenu.classList.toggle('active');
    });

    
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawerMenu.classList.remove('active');
      });
    });
  }


  /* SKILLS CATEGORY FILTERING TABS */
  const filterTabBtns = document.querySelectorAll('.filter-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTabBtns.forEach(tab => tab.classList.remove('active-tab'));
      btn.classList.add('active-tab');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === cardCategory) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });


  /*  SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)*/
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  /*  CONTACT FORM HANDLING & VALIDATION */
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-response-toast');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Sending...';
      }

      // Simulate network response
      setTimeout(() => {
        contactForm.reset();
        
        if (formToast) {
          formToast.classList.remove('hidden');
          setTimeout(() => {
            formToast.classList.add('hidden');
          }, 5000);
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = 'Send Message';
        }
      }, 1000);
    });
  }

});
