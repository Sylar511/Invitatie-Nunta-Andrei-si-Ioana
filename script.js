// RSVP form logic
document.addEventListener('DOMContentLoaded', () => {
  // Setează restaurarea scroll-ului manual (încă din DOMContentLoaded)
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

  // Reset scroll sus pe orice dispozitiv (mobil și desktop)
window.addEventListener('load', () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;        // fallback
    document.documentElement.scrollTop = 0; // fallback
  }, 50); // delay mic ca să nu interfereze cu layout-ul final
});

// Prevenim păstrarea poziției la refresh (unele browsere o fac oricum)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
  /*
  // Fade out header on scroll
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    header.style.opacity = (scrollTop > lastScrollTop && scrollTop > 100) ? '0' : '1';
    lastScrollTop = Math.max(scrollTop, 0);
  });*/

  const scriptURL = 'https://script.google.com/macros/s/AKfycbweBzjk8BY_LNRk9V-2TrzEo2s1-HZ_p1tBXhQnHlT9CNP2rB6rk1YPABOYolNXWVGJgA/exec';
  const form = document.getElementById('rsvp-form');
  const responseText = document.getElementById('form-response');
  const lastname = document.getElementById('lastname');
  const firstname = document.getElementById('firstname');
  const guests = document.getElementById('guests');
  const attendance = document.getElementById('attendance');
  const guestsWrapper = document.getElementById('guests-wrapper');
  const menuWrapper = document.getElementById('menu-wrapper');
  const kidsWrapper = document.getElementById('kids-wrapper');
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

  // Afișează selectorul de persoane dacă este selectat "Da"
  attendance.addEventListener('change', () => {
  if (attendance.value === "Da") {
    guestsWrapper.classList.add('visible');
  } else {
    guestsWrapper.classList.remove('visible');
    guests.value = "";
    guests.classList.remove('error');
    document.getElementById('menu').value = "";
    document.getElementById('kids').value = "";
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

  // Scroll animation observer
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => observer.observe(section));

  // Countdown timer
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

// Fix pentru scroll pe mobil la prima încărcare
setTimeout(() => {
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}, 100);

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

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
