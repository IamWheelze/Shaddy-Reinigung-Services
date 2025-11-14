// Navbar toggle
const hamburger=document.getElementById('hamburger');
const navLinks=document.getElementById('navLinks');
hamburger.addEventListener('click',()=>{
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when clicking nav links
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Slides
const slides=[
  {image:"https://images.pexels.com/photos/4099264/pexels-photo-4099264.jpeg",title:"Sparkling Homes. Happy Clients.",sub:"Premium house & apartment cleaning with trusted professionals."},
  {image:"https://images.pexels.com/photos/4176302/pexels-photo-4176302.jpeg",title:"Office Cleaning You Can Count On.",sub:"Quiet, efficient, after-hours service to keep workspaces pristine."},
  {image:"https://images.pexels.com/photos/4097996/pexels-photo-4097996.jpeg",title:"Windows & Deep Cleaning Experts.",sub:"Streak-free glass and thorough deep cleans — top to bottom."}
];
let i=0,timer;const hero=document.querySelector('.hero-slideshow'),bgs=hero.querySelectorAll('.slide-bg'),titleEl=hero.querySelector('.slide-title'),subEl=hero.querySelector('.slide-sub'),dots=document.querySelector('.hero-dots');
slides.forEach((_,n)=>{const d=document.createElement('button');d.setAttribute('aria-label', `Go to slide ${n+1}`);d.addEventListener('click',()=>go(n));dots.appendChild(d)});
function show(n){i=(n+slides.length)%slides.length;bgs.forEach((b,j)=>{b.style.backgroundImage=`url("${slides[j].image}")`;b.classList.toggle('is-active',j===i)});titleEl.textContent=slides[i].title;subEl.textContent=slides[i].sub;[...dots.children].forEach((d,j)=>d.setAttribute('aria-selected',j===i))}
function go(n){show(n);start()}
function next(){show(i+1)}function prev(){show(i-1)}function start(){stop();timer=setInterval(next,5000)}function stop(){clearInterval(timer)}
show(0);start();
document.querySelector('.hero-next').onclick=()=>{next();start()};document.querySelector('.hero-prev').onclick=()=>{prev();start()};
hero.onmouseenter=stop;hero.onmouseleave=start;

// Scroll reveal for service cards
(function(){
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
  },{threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();

// Prefill service when clicking a service button
document.querySelectorAll('.service-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const val=btn.getAttribute('data-service');
    const sel=document.getElementById('service');
    sel.value=val;
    document.getElementById('booking').scrollIntoView({behavior:'smooth'});
  });
});



// Price Estimator
const priceEstimateEl = document.getElementById('price-estimate');
const serviceSelect = document.getElementById('service');
const sizeSelect = document.getElementById('size');
const extrasCheckboxes = document.querySelectorAll('input[name="Extras"]');

const pricing = {
    baseRates: {
        'House Cleaning': 25,
        'Office Cleaning': 25,
        'Deep Cleaning': 30,
        'Move-In / Move-Out': 30,
        'Window Cleaning': 25,
        'Post-Construction': 30,
        'Airbnb / Short‑Stay': 25,
        'Carpet & Upholstery': 25,
        'Pressure Washing': 30,
    },
    timeEstimates: {
        'Studio / 1 Zimmer': 2,
        '2 Zimmer': 3,
        '3 Zimmer': 4,
        '4+ Zimmer': 5,
        'Office: < 100 m²': 3,
        'Office: 100–300 m²': 5,
        'Office: 300+ m²': 8,
    },
    extras: {
        'Inside Oven': 1,
        'Inside Fridge': 0.5,
        'Windows': 1.5,
        'Balcony/Patio': 0.5,
        'Ironing': 1,
    }
};

function calculateAndDisplayEstimate() {
    const service = serviceSelect.value;
    const size = sizeSelect.value;
    
    let totalHours = pricing.timeEstimates[size] || 0;
    const hourlyRate = pricing.baseRates[service] || 0;

    extrasCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            totalHours += pricing.extras[checkbox.value] || 0;
        }
    });

    const totalPrice = totalHours * hourlyRate;
    priceEstimateEl.textContent = `€${totalPrice.toFixed(2)}`;
}

serviceSelect.addEventListener('change', calculateAndDisplayEstimate);
sizeSelect.addEventListener('change', calculateAndDisplayEstimate);
extrasCheckboxes.forEach(checkbox => checkbox.addEventListener('change', calculateAndDisplayEstimate));


// Form submission handler
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        const formData = new FormData(bookingForm);
        const response = await fetch(bookingForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Show success message
            bookingForm.innerHTML = `
                <div style="text-align:center; padding:40px 20px; background:rgba(0,191,255,0.1); border:2px solid rgba(0,191,255,0.3); border-radius:16px;">
                    <div style="font-size:4rem; margin-bottom:16px;">✓</div>
                    <h3 style="color:#00bfff; margin:0 0 12px; font-family:var(--font-fancy);">Booking Request Received!</h3>
                    <p style="color:#cfefff; margin:0 0 24px;">Thank you for your booking request. We'll contact you at <strong>info@shaddyreinigungservice.com</strong> within 24 hours to confirm your appointment.</p>
                    <a href="#home" style="display:inline-block; background:var(--accent); color:#fff; text-decoration:none; padding:12px 28px; border-radius:12px; font-weight:600;">Back to Home</a>
                </div>
            `;
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        alert('There was a problem submitting your form. Please email us directly at info@shaddyreinigungservice.com');
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Year
document.getElementById('year').textContent=new Date().getFullYear();


// Language Switching
const translations = {
  de: {
    // Navigation
    nav_home: 'Home',
    nav_services: 'Leistungen',
    nav_testimonials: 'Bewertungen',
    nav_faq: 'FAQ',
    nav_gallery: 'Galerie',
    nav_booking: 'Buchen',
    nav_contact: 'Kontakt',
    book_btn: 'Jetzt Buchen',

    // Hero
    hero_title1: 'Strahlende Häuser. Glückliche Kunden.',
    hero_sub1: 'Premium Haus- und Wohnungsreinigung mit vertrauenswürdigen Profis.',
    hero_title2: 'Büroreinigung, auf die Sie zählen können.',
    hero_sub2: 'Ruhig, effizient, nach Feierabend - für makellose Arbeitsbereiche.',
    hero_title3: 'Experten für Fenster & Tiefenreinigung.',
    hero_sub3: 'Streifenfreies Glas und gründliche Tiefenreinigung - von oben bis unten.',

    // Services
    services_title: 'Unsere Reinigungsleistungen',
    services_subtitle: 'Wählen Sie einen Service um Details zu sehen und das Buchungsformular vorzufüllen.',

    // Business Info
    info_title: 'Über Unseren Service',
    info_subtitle: 'Professionelle Reinigung in Karlsruhe und Umgebung',
    info_hours_title: 'Öffnungszeiten',
    info_hours_text: 'Montag - Freitag: 8:00 - 18:00<br>Samstag: 9:00 - 16:00<br>Sonntag: Geschlossen<br><em style="font-size:.9rem;color:#a9d9ff">Notfallservice verfügbar</em>',
    info_area_title: 'Einzugsgebiet',
    info_area_text: 'Karlsruhe & Umgebung<br>Bis zu 20km Radius<br>Pforzheim, Rastatt, Bruchsal<br><em style="font-size:.9rem;color:#a9d9ff">Größere Entfernungen auf Anfrage</em>',
    info_payment_title: 'Zahlungsmethoden',
    info_payment_text: 'Barzahlung<br>Banküberweisung<br>PayPal<br><em style="font-size:.9rem;color:#a9d9ff">Rechnung für Firmen</em>',

    // Testimonials
    testimonials_title: 'Was Unsere Kunden Sagen',
    testimonials_subtitle: 'Über 200 zufriedene Kunden in Karlsruhe',

    // FAQ
    faq_title: 'Häufig Gestellte Fragen',
    faq_subtitle: 'Alles was Sie über unseren Service wissen müssen',

    // Gallery
    gallery_title: 'Vorher & Nachher',
    gallery_subtitle: 'Sehen Sie die Ergebnisse unserer Arbeit',

    // Booking
    booking_title: 'Buchen Sie Jetzt Ihre Reinigung',
    booking_lead: 'Senden Sie Ihre Anfrage und wir antworten von <strong>info@shaddyreinigungservice.com</strong> innerhalb von 24 Stunden.',
    form_name: 'Vollständiger Name',
    form_email: 'E-Mail',
    form_phone: 'Telefon',
    form_address: 'Adresse',
    form_postcode: 'PLZ / Stadt',
    form_service: 'Service',
    form_frequency: 'Häufigkeit',
    form_date: 'Startdatum',
    form_time: 'Bevorzugte Uhrzeit',
    form_size: 'Objektgröße',
    form_days: 'Wochentage (für wiederkehrende Reinigung)',
    form_extras: 'Extras',
    form_notes: 'Notizen / Besondere Wünsche',
    form_submit: 'Buchungsanfrage Senden',
    form_disclaimer: 'Mit dem Absenden wird Ihre Buchungsanfrage direkt an uns gesendet. Wir kontaktieren Sie von <a href="mailto:info@shaddyreinigungservice.com">info@shaddyreinigungservice.com</a> innerhalb von 24 Stunden um Ihren Termin zu bestätigen.',
    price_estimate: 'Geschätzter Preis:',
    price_disclaimer: 'Dies ist eine Schätzung. Der endgültige Preis kann variieren.',

    // Contact
    contact_title: 'Kontakt',
    contact_email: 'E-Mail:',
    contact_phone: 'Telefon:',
    whatsapp_btn: 'Auf WhatsApp chatten'
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_services: 'Services',
    nav_testimonials: 'Testimonials',
    nav_faq: 'FAQ',
    nav_gallery: 'Gallery',
    nav_booking: 'Book',
    nav_contact: 'Contact',
    book_btn: 'Book Now',

    // Hero
    hero_title1: 'Sparkling Homes. Happy Clients.',
    hero_sub1: 'Premium house & apartment cleaning with trusted professionals.',
    hero_title2: 'Office Cleaning You Can Count On.',
    hero_sub2: 'Quiet, efficient, after-hours service to keep workspaces pristine.',
    hero_title3: 'Windows & Deep Cleaning Experts.',
    hero_sub3: 'Streak-free glass and thorough deep cleans — top to bottom.',

    // Services
    services_title: 'Our Cleaning Services',
    services_subtitle: 'Choose a service to see details and pre-fill the booking form.',

    // Business Info
    info_title: 'About Our Service',
    info_subtitle: 'Professional Cleaning in Karlsruhe and Surroundings',
    info_hours_title: 'Business Hours',
    info_hours_text: 'Monday - Friday: 8:00 AM - 6:00 PM<br>Saturday: 9:00 AM - 4:00 PM<br>Sunday: Closed<br><em style="font-size:.9rem;color:#a9d9ff">Emergency service available</em>',
    info_area_title: 'Service Area',
    info_area_text: 'Karlsruhe & Surroundings<br>Up to 20km radius<br>Pforzheim, Rastatt, Bruchsal<br><em style="font-size:.9rem;color:#a9d9ff">Larger distances on request</em>',
    info_payment_title: 'Payment Methods',
    info_payment_text: 'Cash<br>Bank Transfer<br>PayPal<br><em style="font-size:.9rem;color:#a9d9ff">Invoicing for companies</em>',

    // Testimonials
    testimonials_title: 'What Our Customers Say',
    testimonials_subtitle: 'Over 200 satisfied customers in Karlsruhe',

    // FAQ
    faq_title: 'Frequently Asked Questions',
    faq_subtitle: 'Everything you need to know about our service',

    // Gallery
    gallery_title: 'Before & After',
    gallery_subtitle: 'See the results of our work',

    // Booking
    booking_title: 'Book Your Cleaning Now',
    booking_lead: 'Submit your request and we\'ll reply from <strong>info@shaddyreinigungservice.com</strong> within 24 hours.',
    form_name: 'Full Name',
    form_email: 'Email',
    form_phone: 'Phone',
    form_address: 'Address',
    form_postcode: 'Postcode / City',
    form_service: 'Service',
    form_frequency: 'Frequency',
    form_date: 'Start Date',
    form_time: 'Preferred Time',
    form_size: 'Property Size',
    form_days: 'Weekdays (for recurring cleaning)',
    form_extras: 'Extras',
    form_notes: 'Notes / Special Requests',
    form_submit: 'Submit Booking Request',
    form_disclaimer: 'By submitting, your booking request will be sent to us directly. We\'ll contact you from <a href="mailto:info@shaddyreinigungservice.com">info@shaddyreinigungservice.com</a> within 24 hours to confirm your appointment.',
    price_estimate: 'Estimated Price:',
    price_disclaimer: 'This is an estimate. The final price may vary.',

    // Contact
    contact_title: 'Contact Us',
    contact_email: 'Email:',
    contact_phone: 'Phone:',
    whatsapp_btn: 'Chat on WhatsApp'
  }
};

let currentLang = 'de';

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('preferredLanguage', lang);

  // Update language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      // Check if element should use innerHTML (contains HTML tags)
      if (translations[lang][key].includes('<')) {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  // Update hero slideshow with new language
  updateHeroSlides(lang);

  // Update HTML lang attribute
  document.documentElement.lang = lang;
}

// Update hero slideshow texts
function updateHeroSlides(lang) {
  const newSlides = [
    {image: slides[0].image, title: translations[lang].hero_title1, sub: translations[lang].hero_sub1},
    {image: slides[1].image, title: translations[lang].hero_title2, sub: translations[lang].hero_sub2},
    {image: slides[2].image, title: translations[lang].hero_title3, sub: translations[lang].hero_sub3}
  ];

  // Update the global slides array
  slides.splice(0, slides.length, ...newSlides);

  // Update current slide display
  titleEl.textContent = slides[i].title;
  subEl.textContent = slides[i].sub;
}

// Initialize language from localStorage or default to German
const savedLang = localStorage.getItem('preferredLanguage') || 'de';
switchLanguage(savedLang);

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    const wasActive = faqItem.classList.contains('active');

    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    // Open clicked FAQ if it wasn't active
    if (!wasActive) {
      faqItem.classList.add('active');
    }
  });
});

// Show/Hide recurring days based on frequency selection
const frequencySelect = document.getElementById('frequency');
const recurringDays = document.getElementById('recurring-days');

if (frequencySelect && recurringDays) {
  frequencySelect.addEventListener('change', function() {
    if (this.value === 'One‑time') {
      recurringDays.style.display = 'none';
    } else {
      recurringDays.style.display = 'block';
    }
  });
}
