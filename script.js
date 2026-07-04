// Mark that JS is active — images/sections only start hidden (for the
// scroll animation) when this class is present, so if JS ever fails the
// content still shows by default.
document.documentElement.classList.add('js');

// Image fallback: if a photo can't load (e.g. blocked hotlink), mark it so
// CSS fades it out and the designed gradient behind it shows instead of a
// broken-image icon. Every card/hero still looks intentional without photos.
function markImg(img){
  if (img.complete && img.naturalWidth === 0) img.classList.add('img-failed');
  img.addEventListener('error', () => img.classList.add('img-failed'));
  img.addEventListener('load', () => {
    if (img.naturalWidth === 0) img.classList.add('img-failed');
  });
}
document.querySelectorAll('img').forEach(markImg);

// Failsafe: if the scroll observer hasn't revealed everything within a few
// seconds (slow device, observer glitch), force everything visible so no
// image is ever stuck invisible.
setTimeout(() => {
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-clip')
    .forEach(el => el.classList.add('in-view'));
}, 2500);

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

// Scroll reveal system — a single, elegant fade+scale, staggered per group
(function(){
  // Service cards and bento tiles get a soft scale-in; everything else fades up.
  document.querySelectorAll('#services .service-card.reveal, .work-item.reveal').forEach(el => {
    el.classList.remove('reveal');
    el.classList.add('reveal-scale');
  });
  const allAnimated = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-clip');
  const groups = new Map();
  allAnimated.forEach(el => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const parent = e.target.parentElement;
      const siblings = groups.get(parent) || [e.target];
      const idx = siblings.indexOf(e.target);
      const delay = Math.min(idx * 90, 540); // cap stagger so long grids don't lag
      e.target.style.transitionDelay = delay + 'ms';
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    });
  }, { threshold: 0.08 });
  allAnimated.forEach(el => io.observe(el));

  // Scroll progress bar
  const bar = document.getElementById('scrollProgress');
  if (bar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / h * 100) + '%';
    }, { passive: true });
  }

  // Active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = document.querySelector('.nav-links a[href="#' + e.target.id + '"]');
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => navIO.observe(s));
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
        'House Cleaning': 23,
        'Office Cleaning': 27,
        'Deep Cleaning': 23,
        'One-Time Cleaning': 23,
        'Regular Weekly': 22,
        'Regular Bi-Weekly': 22,
        'Move-In / Move-Out': 25,
        'Window Cleaning': 25,
        'Glass Cleaning': 25,
        'Staircase Cleaning': 22,
        'Nursing & Retirement Home': 25,
        'Gym & Hall Cleaning': 23,
        'School & Kindergarten': 25,
        'Post-Construction': 25,
        'Airbnb / Short‑Stay': 23,
        'Carpet & Upholstery': 25,
        'Pressure Washing': 25,
    },
    timeEstimates: {
        studio: 2,
        'two-rooms': 3,
        'three-rooms': 4,
        'four-plus': 5,
        'office-small': 3,
        'office-medium': 5,
        'office-large': 8,
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
    submitBtn.textContent = translations[currentLang].form_sending;
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
            // Show success message using translations
            bookingForm.innerHTML = `
                <div style="text-align:center; padding:40px 20px; background:var(--accent-light); border:1.5px solid #BFDBFE; border-radius:12px;">
                    <div style="font-size:3.5rem; margin-bottom:12px;">&#10003;</div>
                    <h3 style="color:var(--accent); margin:0 0 10px; font-family:var(--font-fancy); font-weight:400;">${translations[currentLang].form_success_title}</h3>
                    <p style="color:var(--text-light); margin:0 0 24px;">${translations[currentLang].form_success_text}</p>
                    <a href="#home" style="display:inline-block; background:var(--accent); color:#fff; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:600;">${translations[currentLang].form_success_btn}</a>
                </div>
            `;
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        alert(translations[currentLang].form_error);
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
    nav_faq: 'FAQ',
    nav_pricing: 'Preise',
    nav_booking: 'Buchen',
    nav_contact: 'Kontakt',
    book_btn: 'Jetzt Buchen',

    // Hero
    hero_eyebrow: 'Reinigungsservice in Karlsruhe',
    hero_title: 'Makellos sauber.<br>Jedes Mal.',
    hero_sub: 'Professionelle Reinigung für Zuhause und Gewerbe — versichert, gründlich, zuverlässig. Wir antworten innerhalb von 24 Stunden.',
    hero_whatsapp: 'WhatsApp',
    trust_insured: 'Vollständig versichert',
    trust_response: 'Antwort in 24 Std.',

    // Services
    services_title: 'Unsere Reinigungsleistungen',
    services_subtitle: 'Wählen Sie einen Service um Details zu sehen und das Buchungsformular vorzufüllen.',

    // Service Cards (all 9 services)
    service1_title: 'Haus- / Wohnungsreinigung',
    service1_desc1: 'Alle Räume & Wohnbereiche',
    service1_desc2: 'Staubwischen, Abwischen, Staubsaugen',
    service1_desc3: 'Böden wischen & Müll entfernen',
    service1_btn: 'Hausreinigung Buchen',

    service2_title: 'Büro & Gewerbe',
    service2_desc1: 'Nach Feierabend oder tagsüber',
    service2_desc2: 'Schreibtische, Meetingräume, Empfang',
    service2_desc3: 'Verbrauchsmaterialien & Mülldienst',
    service2_btn: 'Büroreinigung Buchen',

    service3_title: 'Tiefenreinigung',
    service3_desc1: 'Hinter/unter Geräten & Möbeln',
    service3_desc2: 'Fugen, Kalk und Detailarbeit',
    service3_desc3: 'Ideal für saisonale Auffrischung',
    service3_btn: 'Tiefenreinigung Buchen',

    service4_title: 'Ein-/Auszugsreinigung',
    service4_desc1: 'Endreinigungsstandards',
    service4_desc2: 'Innenseite Schränke, Ofen, Kühlschrank',
    service4_desc3: 'Checklisten-basierte Qualitätskontrolle',
    service4_btn: 'Umzugsservice Buchen',

    service5_title: 'Fenster & Glas',
    service5_desc1: 'Innen & zugängliche Außenscheiben',
    service5_desc2: 'Rahmen, Bänke und Schienen',
    service5_desc3: 'Streifenfreies Finish',
    service5_btn: 'Fensterreinigung Buchen',

    service6_title: 'Nach-Baureinigung',
    service6_desc1: 'Staubentfernung & Feindetails',
    service6_desc2: 'Farb-/Kleberreste entfernen',
    service6_desc3: 'Objektübergabe vorbereiten',
    service6_btn: 'Baureinigung Buchen',

    service7_title: 'Airbnb / Kurzzeitvermietung',
    service7_desc1: 'Schneller Durchlauf & Wäschewechsel',
    service7_desc2: 'Verbrauchsmaterialien auffüllen',
    service7_desc3: 'Gastgeber-Checklisten-Konformität',
    service7_btn: 'Airbnb Reinigung Buchen',

    service8_title: 'Teppich & Polster',
    service8_desc1: 'Fleckenbehandlung & Geruchsbeseitigung',
    service8_desc2: 'Heißwasserextraktion (auf Anfrage)',
    service8_desc3: 'Teppich- & Sofapflege',
    service8_btn: 'Teppich/Polster Buchen',

    service9_title: 'Hochdruckreinigung',
    service9_desc1: 'Terrassen, Einfahrten, Fassaden',
    service9_desc2: 'Graffiti & Fleckenentfernung',
    service9_desc3: 'Moos & Algenbehandlung',
    service9_btn: 'Hochdruckreinigung Buchen',

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

    // FAQ
    faq_title: 'Häufig Gestellte Fragen',
    faq_subtitle: 'Alles was Sie über unseren Service wissen müssen',
    faq1_q: 'Muss ich beim Reinigungstermin anwesend sein?',
    faq1_a: 'Nein, Sie müssen nicht anwesend sein. Viele unserer Kunden hinterlegen einen Schlüssel oder einen Zugangscode. Wir sind vollständig versichert und all unser Personal ist geprüft und vertrauenswürdig.',
    faq2_q: 'Bringen Sie Ihre eigenen Reinigungsmittel mit?',
    faq2_a: 'Ja, wir bringen alle professionellen Reinigungsgeräte und umweltfreundliche Reinigungsmittel mit. Wenn Sie spezielle Produkte bevorzugen, können Sie uns das gerne mitteilen.',
    faq3_q: 'Wie kurzfristig kann ich einen Termin buchen?',
    faq3_a: 'Normalerweise können wir Termine innerhalb von 48 Stunden arrangieren. Für Notfälle bieten wir auch einen Same-Day-Service an (gegen Aufpreis).',
    faq4_q: 'Was ist, wenn ich mit der Reinigung nicht zufrieden bin?',
    faq4_a: 'Ihre Zufriedenheit ist unsere Priorität. Wenn Sie mit irgendeinem Aspekt nicht zufrieden sind, kommen wir innerhalb von 24 Stunden kostenlos zurück und beheben das Problem.',
    faq5_q: 'Wie kann ich einen Termin stornieren?',
    faq5_a: 'Sie können bis zu 24 Stunden vor dem Termin kostenlos stornieren. Kontaktieren Sie uns einfach per E-Mail oder WhatsApp. Kurzfristigere Stornierungen können eine Gebühr von 50% des Buchungswertes nach sich ziehen.',
    faq6_q: 'Sind Sie versichert?',
    faq6_a: 'Ja, wir verfügen über eine vollständige Haftpflichtversicherung. Im unwahrscheinlichen Fall eines Schadens sind Sie vollständig abgesichert.',

    // Pricing
    pricing_title: 'Unsere Preise',
    pricing_subtitle: 'Transparente Preise für alle unsere Reinigungsleistungen',
    pricing_cat_residential: 'Privathaushalte',
    pricing_cat_commercial: 'Gewerbe & Einrichtungen',
    pricing_onetime: 'Einmalige Reinigung',
    pricing_deep: 'Grundreinigung',
    pricing_biweekly: 'Regelmäßig alle 2 Wochen',
    pricing_weekly: 'Regelmäßig jede Woche',
    pricing_glass: 'Glasreinigung',
    pricing_steps: 'Treppenreinigung',
    pricing_office: 'Büroreinigung',
    pricing_nursing: 'Pflege- & Altenheime',
    pricing_gym: 'Fitness- & Hallenreinigung',
    pricing_school: 'Schule & Kindergarten',
    pricing_tax_note: 'Alle Preise verstehen sich zzgl. 19% MwSt. Die MwSt. wird auf der Rechnung separat ausgewiesen.',
    pricing_cta: 'Jetzt Angebot Anfragen',

    // Gallery
    // Our Work


    // Booking
    booking_title: 'Buchen Sie Jetzt Ihre Reinigung',
    booking_lead: 'Senden Sie Ihre Anfrage und wir antworten von <strong>shaddyreinigung@gmail.com</strong> innerhalb von 24 Stunden.',
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
    form_sending: 'Wird gesendet...',
    placeholder_name: 'Ihr Name',
    placeholder_email: 'max@example.com',
    placeholder_phone: '+49 ...',
    placeholder_address: 'Straße, Nr.',
    placeholder_postcode: '76133 Karlsruhe',
    placeholder_notes: 'Parkinformationen, Haustier, Zugangscode usw.',
    option_select_service: 'Service auswählen',
    option_house: 'Hausreinigung',
    option_office: 'Büroreinigung',
    option_deep: 'Grundreinigung',
    option_move: 'Umzugsreinigung',
    option_window: 'Fensterreinigung',
    option_post: 'Baureinigung',
    option_airbnb: 'Airbnb / Kurzzeitvermietung',
    option_carpet: 'Teppich & Polster',
    option_pressure: 'Hochdruckreinigung',
    option_onetime: 'Einmalig',
    option_weekly: 'Wöchentlich',
    option_biweekly: 'Alle zwei Wochen',
    option_monthly: 'Monatlich',
    option_size_studio: 'Studio / 1 Zimmer',
    option_size_two: '2 Zimmer',
    option_size_three: '3 Zimmer',
    option_size_four: '4+ Zimmer',
    option_size_office_small: 'Büro: < 100 m²',
    option_size_office_med: 'Büro: 100–300 m²',
    option_size_office_large: 'Büro: 300+ m²',
    extra_oven: 'Backofen innen',
    extra_fridge: 'Kühlschrank innen',
    extra_windows: 'Fenster',
    extra_balcony: 'Balkon/Terrasse',
    extra_ironing: 'Bügeln',
    day_mon: 'Mo',
    day_tue: 'Di',
    day_wed: 'Mi',
    day_thu: 'Do',
    day_fri: 'Fr',
    day_sat: 'Sa',
    day_sun: 'So',
    form_success_title: 'Buchungsanfrage Erhalten!',
    form_success_text: 'Vielen Dank für Ihre Buchungsanfrage. Wir kontaktieren Sie unter <strong>shaddyreinigung@gmail.com</strong> innerhalb von 24 Stunden um Ihren Termin zu bestätigen.',
    form_success_btn: 'Zurück zur Startseite',
    form_error: 'Es gab ein Problem beim Absenden des Formulars. Bitte kontaktieren Sie uns direkt unter shaddyreinigung@gmail.com',
    privacy_consent: 'Ich habe die <a href="datenschutz.html" target="_blank">Datenschutzerklärung</a> zur Kenntnis genommen. Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und für Rückfragen dauerhaft gespeichert werden.',
    form_disclaimer: 'Mit dem Absenden wird Ihre Buchungsanfrage direkt an uns gesendet. Wir kontaktieren Sie von <a href="mailto:shaddyreinigung@gmail.com">shaddyreinigung@gmail.com</a> innerhalb von 24 Stunden um Ihren Termin zu bestätigen.',
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
    nav_faq: 'FAQ',
    nav_pricing: 'Pricing',
    nav_booking: 'Book',
    nav_contact: 'Contact',
    book_btn: 'Book Now',

    // Hero
    hero_eyebrow: 'Cleaning service in Karlsruhe',
    hero_title: 'Spotless clean.<br>Every time.',
    hero_sub: 'Professional cleaning for homes and businesses — insured, thorough, reliable. We reply within 24 hours.',
    hero_whatsapp: 'WhatsApp',
    trust_insured: 'Fully insured',
    trust_response: 'Reply within 24h',

    // Services
    services_title: 'Our Cleaning Services',
    services_subtitle: 'Choose a service to see details and pre-fill the booking form.',

    // Service Cards (all 9 services)
    service1_title: 'House / Apartment Cleaning',
    service1_desc1: 'All rooms & living spaces',
    service1_desc2: 'General dusting, wiping, vacuuming',
    service1_desc3: 'Floors mopped & trash removed',
    service1_btn: 'Book House Cleaning',

    service2_title: 'Office & Commercial',
    service2_desc1: 'After-hours or scheduled daytime',
    service2_desc2: 'Desks, meeting rooms, reception',
    service2_desc3: 'Consumables & bins serviced',
    service2_btn: 'Book Office Cleaning',

    service3_title: 'Deep Cleaning',
    service3_desc1: 'Behind/under appliances & furniture',
    service3_desc2: 'Grout, scale, and detail work',
    service3_desc3: 'Ideal for seasonal refresh',
    service3_btn: 'Book Deep Cleaning',

    service4_title: 'Move-In / Move-Out',
    service4_desc1: 'End-of-tenancy standards',
    service4_desc2: 'Inside cupboards, oven, fridge',
    service4_desc3: 'Checklist-based quality control',
    service4_btn: 'Book Move Service',

    service5_title: 'Window & Glass',
    service5_desc1: 'Interior & accessible exterior panes',
    service5_desc2: 'Frames, sills, and tracks',
    service5_desc3: 'Streak-free finish',
    service5_btn: 'Book Window Cleaning',

    service6_title: 'Post-Construction',
    service6_desc1: 'Dust removal & fine detail',
    service6_desc2: 'Paint/adhesive spot cleaning',
    service6_desc3: 'Site readiness handover',
    service6_btn: 'Book Post-Construction',

    service7_title: 'Airbnb / Short-Stay',
    service7_desc1: 'Fast turnaround & linen change',
    service7_desc2: 'Consumables restock',
    service7_desc3: 'Host checklist compliance',
    service7_btn: 'Book Airbnb Cleaning',

    service8_title: 'Carpet & Upholstery',
    service8_desc1: 'Spot treatment & deodorizing',
    service8_desc2: 'Hot-water extraction (on request)',
    service8_desc3: 'Rug & sofa care',
    service8_btn: 'Book Carpet/Upholstery',

    service9_title: 'Pressure Washing',
    service9_desc1: 'Patios, driveways, facades',
    service9_desc2: 'Graffiti & stain removal',
    service9_desc3: 'Moss & algae treatment',
    service9_btn: 'Book Pressure Washing',

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

    // FAQ
    faq_title: 'Frequently Asked Questions',
    faq_subtitle: 'Everything you need to know about our service',
    faq1_q: 'Do I need to be present during the cleaning appointment?',
    faq1_a: 'No, you don\'t need to be present. Many of our customers leave a key or access code. We are fully insured and all our staff are vetted and trustworthy.',
    faq2_q: 'Do you bring your own cleaning supplies?',
    faq2_a: 'Yes, we bring all professional cleaning equipment and eco-friendly cleaning products. If you prefer specific products, please let us know.',
    faq3_q: 'How quickly can I book an appointment?',
    faq3_a: 'We can usually arrange appointments within 48 hours. For emergencies, we also offer same-day service (with surcharge).',
    faq4_q: 'What if I\'m not satisfied with the cleaning?',
    faq4_a: 'Your satisfaction is our priority. If you\'re not happy with any aspect, we\'ll come back within 24 hours free of charge and fix the problem.',
    faq5_q: 'How can I cancel an appointment?',
    faq5_a: 'You can cancel free of charge up to 24 hours before the appointment. Simply contact us via email or WhatsApp. Short-notice cancellations may incur a 50% booking fee.',
    faq6_q: 'Are you insured?',
    faq6_a: 'Yes, we have comprehensive liability insurance. In the unlikely event of damage, you are fully covered.',

    // Pricing
    pricing_title: 'Our Pricing',
    pricing_subtitle: 'Transparent prices for all our cleaning services',
    pricing_cat_residential: 'Residential',
    pricing_cat_commercial: 'Commercial & Facilities',
    pricing_onetime: 'One-Time Cleaning',
    pricing_deep: 'Deep Cleaning',
    pricing_biweekly: 'Regular Every 2 Weeks',
    pricing_weekly: 'Regular Every Week',
    pricing_glass: 'Glass Cleaning',
    pricing_steps: 'Staircase Cleaning',
    pricing_office: 'Office Cleaning',
    pricing_nursing: 'Nursing & Retirement Homes',
    pricing_gym: 'Gym & Hall Cleaning',
    pricing_school: 'School & Kindergarten',
    pricing_tax_note: 'All prices are net prices, excluding 19% VAT. VAT will be shown separately on the invoice.',
    pricing_cta: 'Request a Quote',

    // Gallery
    // Our Work


    // Booking
    booking_title: 'Book Your Cleaning Now',
    booking_lead: 'Submit your request and we\'ll reply from <strong>shaddyreinigung@gmail.com</strong> within 24 hours.',
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
    form_sending: 'Sending...',
    placeholder_name: 'Your Name',
    placeholder_email: 'you@example.com',
    placeholder_phone: '+49 ...',
    placeholder_address: 'Street, No.',
    placeholder_postcode: '76133 Karlsruhe',
    placeholder_notes: 'Parking info, pet at home, access code, etc.',
    option_select_service: 'Select Service',
    option_house: 'House Cleaning',
    option_office: 'Office Cleaning',
    option_deep: 'Deep Cleaning',
    option_move: 'Move-In / Move-Out',
    option_window: 'Window Cleaning',
    option_post: 'Post-Construction',
    option_airbnb: 'Airbnb / Short‑Stay',
    option_carpet: 'Carpet & Upholstery',
    option_pressure: 'Pressure Washing',
    option_onetime: 'One‑time',
    option_weekly: 'Weekly',
    option_biweekly: 'Bi‑weekly',
    option_monthly: 'Monthly',
    option_size_studio: 'Studio / 1 Room',
    option_size_two: '2 Rooms',
    option_size_three: '3 Rooms',
    option_size_four: '4+ Rooms',
    option_size_office_small: 'Office: < 100 m²',
    option_size_office_med: 'Office: 100–300 m²',
    option_size_office_large: 'Office: 300+ m²',
    extra_oven: 'Inside Oven',
    extra_fridge: 'Inside Fridge',
    extra_windows: 'Windows',
    extra_balcony: 'Balcony/Patio',
    extra_ironing: 'Ironing',
    day_mon: 'Mon',
    day_tue: 'Tue',
    day_wed: 'Wed',
    day_thu: 'Thu',
    day_fri: 'Fri',
    day_sat: 'Sat',
    day_sun: 'Sun',
    form_success_title: 'Booking Request Received!',
    form_success_text: 'Thank you for your booking request. We\'ll contact you at <strong>shaddyreinigung@gmail.com</strong> within 24 hours to confirm your appointment.',
    form_success_btn: 'Back to Home',
    form_error: 'There was a problem submitting your form. Please email us directly at shaddyreinigung@gmail.com',
    privacy_consent: 'I have read the <a href="datenschutz.html" target="_blank">Privacy Policy</a>. I agree that my details will be stored permanently for contact purposes and follow-up questions.',
    form_disclaimer: 'By submitting, your booking request will be sent to us directly. We\'ll contact you from <a href="mailto:shaddyreinigung@gmail.com">shaddyreinigung@gmail.com</a> within 24 hours to confirm your appointment.',
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
    const translation = translations[lang][key];
    if (translation) {
      const target = el.dataset.i18nTarget;
      const hasHTML = /<[^>]+>/.test(translation);

      if (target === 'placeholder') {
        el.setAttribute('placeholder', translation);
      } else if (target === 'value') {
        el.value = translation;
      } else if (hasHTML) {
        el.innerHTML = translation;
      } else {
        el.textContent = translation;
      }
    }
  });

  // Update HTML lang attribute
  document.documentElement.lang = lang;
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

