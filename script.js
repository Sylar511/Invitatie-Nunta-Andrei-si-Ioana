
// RSVP form logic
document.addEventListener('DOMContentLoaded', () => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 50);
  });

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const scriptURL = 'https://script.google.com/macros/s/AKfycbweBzjk8BY_LNRk9V-2TrzEo2s1-HZ_p1tBXhQnHlT9CNP2rB6rk1YPABOYolNXWVGJgA/exec';
  const form = document.getElementById('rsvp-form');
  const responseText = document.getElementById('form-response');
  const lastname = document.getElementById('lastname');
  const firstname = document.getElementById('firstname');
  const guests = document.getElementById('guests');
  const attendance = document.getElementById('attendance');
  const guestsWrapper = document.getElementById('guests-wrapper');
  const menu = document.getElementById('menu');
  const kids = document.getElementById('kids');
  const ipField = document.getElementById('ip');

  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
      ipField.value = data.ip;
      const fullName = `${lastname.value.trim()} ${firstname.value.trim()}`.toLowerCase();
      fetch(`${scriptURL}?name=${encodeURIComponent(fullName)}`)
        .then(res => res.json())
        .then(info => {
          if (info.exists) {
            localStorage.setItem('rsvpConfirmed', 'true');
            form.style.display = 'none';
            const msg = document.createElement('p');
            msg.innerText = "Ai trimis deja confirmarea. Îți mulțumim!";
            msg.style.color = '#2e7d32';
            msg.style.fontWeight = 'bold';
            form.parentElement.appendChild(msg);
          }
        });
    });

  attendance.addEventListener('change', () => {
    if (attendance.value === "Da") {
      guestsWrapper.classList.add('visible');
    } else {
      guestsWrapper.classList.remove('visible');
      guests.value = "";
      guests.classList.remove('error');
      menu.value = "";
      kids.value = "";
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    [lastname, firstname, guests, attendance, menu, kids].forEach(el => el.classList.remove('error'));
    responseText.innerText = "";

    let valid = true;

    if (!lastname.value.trim()) { lastname.classList.add('error'); valid = false; }
    if (!firstname.value.trim()) { firstname.classList.add('error'); valid = false; }
    if (!attendance.value) { attendance.classList.add('error'); valid = false; }
    if (attendance.value === "Da") {
      if (!guests.value) { guests.classList.add('error'); valid = false; }
      if (!menu.value) { menu.classList.add('error'); valid = false; }
      if (!kids.value) { kids.classList.add('error'); valid = false; }
    }

    if (!valid) {
      responseText.innerText = "Te rugăm să completezi câmpurile obligatorii.";
      return;
    }

    const formData = new FormData(form);
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('rsvpConfirmed', 'true');
          form.reset();
          form.style.display = 'none';
          const confirmationContainer = document.createElement('div');
          confirmationContainer.classList.add('confirmation-message');
          confirmationContainer.innerHTML = `
            <div class="checkmark">
              <svg class="checkmark-animation" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path class="checkmark__check" d="M14 27l7 7 16-16"/>
              </svg>
            </div>
            <p style="color: #2e7d32; font-weight: bold; font-size: 1.1em; margin-top: 10px;">
              ${data.message}
            </p>
          `;
          form.parentElement.appendChild(confirmationContainer);
          window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
          responseText.innerText = data.message;
        }
      })
      .catch(() => {
        responseText.innerText = "Eroare la trimitere. Încearcă din nou.";
      });
  });

  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => observer.observe(section));

  const targetDate = new Date('2025-10-11T00:00:00');
  const daysSpan = document.getElementById('days');
  const hoursSpan = document.getElementById('hours');
  const minutesSpan = document.getElementById('minutes');
  const secondsSpan = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;
    if (difference <= 0) {
      daysSpan.textContent = '0';
      hoursSpan.textContent = '0';
      minutesSpan.textContent = '0';
      secondsSpan.textContent = '0';
      return;
    }
    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    daysSpan.textContent = days;
    hoursSpan.textContent = hours;
    minutesSpan.textContent = minutes;
    secondsSpan.textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
