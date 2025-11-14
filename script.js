// Navbar toggle
const hamburger=document.getElementById('hamburger');
const navLinks=document.getElementById('navLinks');
hamburger.addEventListener('click',()=>navLinks.classList.toggle('open'));

// Slides
const slides=[
  {image:"https://images.pexels.com/photos/4099264/pexels-photo-4099264.jpeg",title:"Sparkling Homes. Happy Clients.",sub:"Premium house & apartment cleaning with trusted professionals."},
  {image:"https://images.pexels.com/photos/4176302/pexels-photo-4176302.jpeg",title:"Office Cleaning You Can Count On.",sub:"Quiet, efficient, after-hours service to keep workspaces pristine."},
  {image:"https://images.pexels.com/photos/4097996/pexels-photo-4097996.jpeg",title:"Windows & Deep Cleaning Experts.",sub:"Streak-free glass and thorough deep cleans — top to bottom."}
];
let i=0,timer;const hero=document.querySelector('.hero-slideshow'),bgs=hero.querySelectorAll('.slide-bg'),titleEl=hero.querySelector('.slide-title'),subEl=hero.querySelector('.slide-sub'),dots=document.querySelector('.hero-dots');
slides.forEach((_,n)=>{const d=document.createElement('button');d.addEventListener('click',()=>go(n,true));dots.appendChild(d)});
function show(n){i=(n+slides.length)%slides.length;bgs.forEach((b,j)=>{b.style.backgroundImage=`url("${slides[j].image}")`;b.classList.toggle('is-active',j===i)});titleEl.textContent=slides[i].title;subEl.textContent=slides[i].sub;[...dots.children].forEach((d,j)=>d.setAttribute('aria-selected',j===i))}
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
