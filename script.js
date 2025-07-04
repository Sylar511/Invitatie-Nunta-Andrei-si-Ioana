// RSVP form logic
document.addEventListener('DOMContentLoaded', () => {

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

  const scriptURL = 'https://script.google.com/macros/s/AKfycbzqupi_KNfZn_V4DqhUKJ9iG3ORiOrn9DOTE4XovogNXC9AuLdDgr0gRzivnPjLm8gisQ/exec';
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

  // Obține IP-ul utilizatorului
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

  // Afișează opțiuni suplimentare dacă e selectat „Da”
  attendance.addEventListener('change', () => {
    if (attendance.value === "Da") {
      guestsWrapper.style.display = "block";
    } else {
      guestsWrapper.style.display = "none";
      guests.value = "";
      menu.value = "";
      kids.value = "";
      guests.classList.remove('error');
      menu.classList.remove('error');
      kids.classList.remove('error');
    }
  });

  // Validare și trimitere formular
  form.addEventListener('submit', e => {
    e.preventDefault();

    lastname.classList.remove('error');
    firstname.classList.remove('error');
    guests.classList.remove('error');
    attendance.classList.remove('error');
    menu.classList.remove('error');
    kids.classList.remove('error');
    responseText.innerText = "";

    let valid = true;

    if (!lastname.value.trim()) {
      lastname.classList.add('error');
      valid = false;
    }
    if (!firstname.value.trim()) {
      firstname.classList.add('error');
      valid = false;
    }
    if (!attendance.value) {
      attendance.classList.add('error');
      valid = false;
    }
    if (attendance.value === "Da" && !guests.value) {
      guests.classList.add('error');
      valid = false;
    }
    if (attendance.value === "Da" && !menu.value) {
      menu.classList.add('error');
      valid = false;
    }
    if (attendance.value === "Da" && !kids.value) {
      kids.classList.add('error');
      valid = false;
    }

    if (!valid) {
      responseText.innerText = "Te rugăm să completezi câmpurile obligatorii.";
      return;
    }

    const formData = new FormData(form);
    fetch(scriptURL, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('rsvpConfirmed', 'true');
          form.reset();
          form.style.display = 'none';
          const msg = document.createElement('p');
          msg.innerText = data.message;
          msg.style.color = '#2e7d32';
          msg.style.fontWeight = 'bold';
          form.parentElement.appendChild(msg);
          window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
          responseText.innerText = data.message;
        }
      })
      .catch(() => {
        responseText.innerText = "Eroare la trimitere. Încearcă din nou.";
      });
  });

  // Animație pentru apariția secțiunilor
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => observer.observe(section));

  // Countdown
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

// Forțează poziția în top la orice încărcare (inclusiv reload, inclusiv mobil)
window.addEventListener('load', () => {
  // elimină clasa no-scroll după ce pagina este sus
  document.body.classList.remove('no-scroll');

  // asigură scrollTop resetat fără efect vizibil
  window.scrollTo(0, 0);
  document.body.scrollTop = 0; // fallback
  document.documentElement.scrollTop = 0; // fallback
});
