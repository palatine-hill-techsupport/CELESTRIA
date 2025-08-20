document.addEventListener("DOMContentLoaded", () => {

  // Main menu buttons
  const btnNav = document.querySelector('#btn-navtrax');
  const btnSweep = document.querySelector('#btn-sweep');
  const btnPitch = document.querySelector('#btn-pitch');
  const btnHiscores = document.querySelector('#btn-hiscores');

  // Auth buttons
  const btnUserLogin = document.querySelector('#btn-user-login');
  const btnFacilitatorLogin = document.querySelector('#btn-facilitator-login');

  // Video + UI
  const video = document.querySelector('#pitch');
  const videoUI = document.querySelector('#videoPlane');

  // Close “X”
  const btnCloseVideo = document.querySelector('#btn-close-video');
  const txtCloseVideo = document.querySelector('#txt-close-video');

  // Small press animation
  function clickPulse(el) {
    if (!el) return;
    el.setAttribute('animation__press', {
      property: 'scale',
      to: '0.95 0.95 0.95',
      dur: 80,
      dir: 'alternate',
      loop: 1
    });
  }

  // Helpers to show/hide the video + close button
  function showVideo() {
    if (!videoUI || !video) return;
    videoUI.setAttribute('visible', true);
    if (btnCloseVideo) btnCloseVideo.setAttribute('visible', true);
    if (txtCloseVideo) txtCloseVideo.setAttribute('visible', true);
    try { video.play(); } catch {}
  }

  function closeVideo() {
    if (video && !video.paused) video.pause();
    if (videoUI) videoUI.setAttribute('visible', false);
    if (btnCloseVideo) btnCloseVideo.setAttribute('visible', false);
    if (txtCloseVideo) txtCloseVideo.setAttribute('visible', false);
  }

  if (btnPitch) {
    btnPitch.addEventListener('click', () => {
      clickPulse(btnPitch);
      const showing = videoUI && videoUI.getAttribute('visible');
      if (!showing) showVideo(); else closeVideo();
    });
  }

  // Make both the red square and the “X” clickable to close
  if (btnCloseVideo) btnCloseVideo.addEventListener('click', closeVideo);
  if (txtCloseVideo) txtCloseVideo.addEventListener('click', closeVideo);

  // ESC key closes the video
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideo();
  });

  // Other buttons
  if (btnNav) {
    btnNav.addEventListener('click', () => {
      clickPulse(btnNav);
      setTimeout(() => { window.location.href = 'navtrax.html'; }, 150);
    });
  }

  if (btnSweep) {
    btnSweep.addEventListener('click', () => {
      clickPulse(btnSweep);
      setTimeout(() => { window.location.href = 'spacejunksweep.html'; }, 150);
    });
  }

  if (btnHiscores) {
    btnHiscores.addEventListener('click', () => {
      clickPulse(btnHiscores);
      setTimeout(() => { window.location.href = 'hiscores.html'; }, 150);
    });
  }

  if (btnUserLogin) {
    btnUserLogin.addEventListener('click', () => clickPulse(btnUserLogin));
  }

  if (btnFacilitatorLogin) {
    btnFacilitatorLogin.addEventListener('click', () => clickPulse(btnFacilitatorLogin));
  }

  // --- Scoreboard logic ----------------------------------------------------
  const scoreValueEl = document.getElementById("score-value");
  if (scoreValueEl) {
    let score = 0;

    function updateScore() {
      score += Math.floor(Math.random() * 50) + 1;
      if (score > 500) score = 0;
      scoreValueEl.textContent = `${score}kg`;
    }

    function scheduleNextScoreUpdate() {
      const delay = Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000;
      setTimeout(() => {
        updateScore();
        scheduleNextScoreUpdate();
      }, delay);
    }

    scheduleNextScoreUpdate();
  }

  // --- Speedometer logic ---------------------------------------------------
  const speedValueEl = document.getElementById("speed-value");
  if (speedValueEl) {
    const MAX_SPEED = 25000;
    let speed = 0;
    let dir = 1;
    let pivot = pickPivotUp();

    function pickPivotUp() {
      return Math.floor((0.35 + Math.random() * 0.60) * MAX_SPEED);
    }
    function pickPivotDown() {
      return Math.floor((0.05 + Math.random() * 0.60) * MAX_SPEED);
    }

    function updateSpeed() {
      const step = Math.floor(200 + Math.random() * 800);
      speed += dir * step;

      if (speed >= MAX_SPEED) { speed = MAX_SPEED; dir = -1; pivot = pickPivotDown(); }
      if (speed <= 0)         { speed = 0;         dir =  1; pivot = pickPivotUp(); }

      if (dir === 1 && speed >= pivot) dir = -1, pivot = pickPivotDown();
      if (dir === -1 && speed <= pivot) dir = 1, pivot = pickPivotUp();

      speedValueEl.textContent = `${speed.toLocaleString()}km/h`;
    }

    setInterval(updateSpeed, 1000);
  }

  // --- Cockpit meters animation ---
  function animateMeter(id) {
    const el = document.getElementById(id);
    if (!el) return;
    let val = Math.random() * 100;
    setInterval(() => {
      // random up/down change
      val += (Math.random() - 0.5) * 20;
      if (val > 100) val = 100;
      if (val < 0) val = 0;
      el.style.width = val + "%";
    }, 1000);
  }

  animateMeter("force-fill");
  animateMeter("velocity-fill");
  animateMeter("fuel-fill");
  animateMeter("vitals-fill");

});

// Prototype modal + lightbox + Pause menu
document.addEventListener("DOMContentLoaded", () => {
  // --- Shorthands -----------------------------------------------------------
  const $  = (s) => document.querySelector(s);
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
  const shown = (el) => !!el && getComputedStyle(el).display !== "none";
  const lock   = () => { document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden"; };
  const unlock = () => { document.documentElement.style.overflow = "";      document.body.style.overflow = "";      };
  const EMBED_SUFFIX = '?autoplay=1&rel=0&modestbranding=1';
  const embedFromId = (id) => `https://www.youtube.com/embed/${id}${EMBED_SUFFIX}`;

  // --- Prototype modal elements --------------------------------------------
  const infoBtn     = $("#infoBtn");
  const protoModal  = $("#protoModal");
  const modalClose  = $("#modalClose");
  const lightbox    = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxClose = $("#lightboxClose");

  // --- Menu modal elements --------------------------------------------------
  const menuBtn    = $("#menuBtn");
  const menuModal  = $("#menuModal");
  const menuClose  = $("#menuClose");
  const goHome     = $("#goHome");
  const fovRange   = $("#fovRange");
  const fovValue   = $("#fovValue");
  const toggleCb   = $("#toggleCb");
  const toggleCap  = $("#toggleCaptions");

  // If none of the modals exist, bail quietly
  if (!protoModal && !menuModal) return;

  let lastFocus = null;

  // --- Lightbox helpers -----------------------------------------------------
  const openLightbox = (src, alt = "") => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.style.display = "flex";
    lightbox.setAttribute("aria-hidden", "false");
  };
  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
  };

  // --- Prototype modal helpers -----------------------------------------------
  const openProto = () => {
    if (!protoModal) return;
    if (shown(menuModal)) closeMenu();
    lastFocus = document.activeElement;
    protoModal.style.display = "block";
    protoModal.setAttribute("aria-hidden", "false");
    lock();
    modalClose && modalClose.focus();
  };
  const closeProto = () => {
    if (!protoModal) return;
    closeLightbox();
    protoModal.style.display = "none";
    protoModal.setAttribute("aria-hidden", "true");
    unlock();
    // Pause any videos in the modal
    protoModal.querySelectorAll("video").forEach(v => { try { v.pause(); } catch {} });
    if (lastFocus) { try { lastFocus.focus(); } catch {} }
  };

  // --- Menu modal helpers ---------------------------------------------------
  const openMenu = () => {
    if (!menuModal) return;
    if (shown(protoModal)) closeProto();
    lastFocus = document.activeElement;
    menuModal.style.display = "block";
    menuModal.setAttribute("aria-hidden", "false");
    lock();
    menuClose && menuClose.focus();
  };
  const closeMenu = () => {
    if (!menuModal) return;
    menuModal.style.display = "none";
    menuModal.setAttribute("aria-hidden", "true");
    unlock();
    if (lastFocus) { try { lastFocus.focus(); } catch {} }
  };

  // --- Wire Prototype modal -------------------------------------------------
  on(infoBtn,   "click", openProto);
  on(modalClose,"click", closeProto);
  on(protoModal,"click", (e) => { if (e.target === protoModal) closeProto(); });
  // Thumb -> lightbox (event delegation)
  on(protoModal,"click", (e) => {
    const btn = e.target.closest(".thumb");
    if (!btn || !protoModal.contains(btn)) return;
    const img = btn.querySelector("img");
    const src = btn.dataset.src || img?.src;
    const alt = img?.alt || "Prototype image";
    if (src) openLightbox(src, alt);
  });
  on(lightboxClose, "click", closeLightbox);
  on(lightbox, "click", (e) => { if (e.target === lightbox) closeLightbox(); });

  // --- Wire Menu modal ------------------------------------------------------
  if (menuBtn) {
    // Use pointerdown first to avoid any oddities with iframes/focus
    menuBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMenu();
    });

    // Fallback click in case pointer events are not supported
    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMenu();
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close when clicking the dark backdrop
  if (menuModal) {
    menuModal.addEventListener("click", (e) => {
      if (e.target === menuModal) closeMenu();
    });
  }

  // --- Keyboard behaviour ---------------------------------------------------
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (shown(lightbox)) closeLightbox();
    else if (shown(protoModal)) closeProto();
    else if (shown(menuModal)) closeMenu();
  });

  // --- Settings wiring (persists to localStorage) ---------------------------
  const savedFov = localStorage.getItem("fov");
  if (savedFov && fovRange && fovValue) {
    fovRange.value = savedFov;
    fovValue.textContent = `${savedFov}°`;
  }
  const savedCb  = localStorage.getItem("cbMode") === "true";
  const savedCap = localStorage.getItem("captions") === "true";
  if (toggleCb)  { toggleCb.setAttribute("aria-pressed", String(savedCb));  toggleCb.textContent  = savedCb ? "ON" : "OFF"; document.body.classList.toggle("cb-mode", savedCb); }
  if (toggleCap) { toggleCap.setAttribute("aria-pressed", String(savedCap)); toggleCap.textContent = savedCap ? "ON" : "OFF"; document.body.classList.toggle("captions-on", savedCap); }

  if (fovRange && fovValue) {
    const syncFov = () => {
      fovValue.textContent = `${fovRange.value}°`;
      localStorage.setItem("fov", fovRange.value);
    };
    on(fovRange, "input",  syncFov);
    on(fovRange, "change", syncFov);
  }

  const openSettings = document.getElementById("openSettings");
  on(openSettings, "click", () => {
    openSettings.textContent = "SETTINGS ✓";
    setTimeout(() => { openSettings.textContent = "SETTINGS"; }, 900);
  });

  on(goHome, "click", () => { window.location.href = "index.html"; });

  if (toggleCb) {
    on(toggleCb, "click", () => {
      const next = toggleCb.getAttribute("aria-pressed") !== "true";
      toggleCb.setAttribute("aria-pressed", String(next));
      toggleCb.textContent = next ? "ON" : "OFF";
      document.body.classList.toggle("cb-mode", next);
      localStorage.setItem("cbMode", String(next));
    });
  }
  if (toggleCap) {
    on(toggleCap, "click", () => {
      const next = toggleCap.getAttribute("aria-pressed") !== "true";
      toggleCap.setAttribute("aria-pressed", String(next));
      toggleCap.textContent = next ? "ON" : "OFF";
      document.body.classList.toggle("captions-on", next);
      localStorage.setItem("captions", String(next));
    });
  }

  // --- Mission video modals -------------------------------------------------
  const missionCards = document.querySelectorAll('.mission-card');

  function openMissionModal(modalId, videoUrl) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Close any other modals that might be open
    if (shown(protoModal)) closeProto();
    if (shown(menuModal)) closeMenu();

    // Populate iframe src only when opening
    const iframe = modal.querySelector('.mission-video');
    if (iframe) iframe.src = videoUrl;

    lastFocus = document.activeElement;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    lock();

    const closeBtn = modal.querySelector('.mission-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeMissionModal(modal) {
    if (!modal) return;

    // Stop playback by clearing the iframe src
    const iframe = modal.querySelector('.mission-video');
    if (iframe) iframe.src = '';

    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    unlock();
    if (lastFocus) { try { lastFocus.focus(); } catch {} }
  }

  // Card click / key access (use video IDs -> build proper embed URLs)
  missionCards.forEach(card => {
    const modalId = card.getAttribute('data-modal');
    const videoId = card.getAttribute('data-video-id');
    const videoUrl = embedFromId(videoId);

    // open on whole-card click
    card.addEventListener('click', () => openMissionModal(modalId, videoUrl));

    // Enter/Space on the <h3 role="button">
    const titleBtn = card.querySelector('.mission-title[role="button"]');
    if (titleBtn) {
      titleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMissionModal(modalId, videoUrl);
        }
      });
      titleBtn.addEventListener('click', () => openMissionModal(modalId, videoUrl));
    }
  });

  // Close buttons and backdrop click
  document.querySelectorAll('.mission-modal').forEach(modal => {
    const closeBtn = modal.querySelector('.mission-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closeMissionModal(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeMissionModal(modal);
    });
  });

  // Add ESC support for mission modals
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openMission = Array.from(document.querySelectorAll('.mission-modal'))
      .find(m => getComputedStyle(m).display !== 'none');
    if (openMission) { closeMissionModal(openMission); }
  });

  // --- Mission list toggle ----------------------------------------
  const missionToggle = document.getElementById('missionToggle');
  const missionList   = document.querySelector('#mission-guide .missions-list');

  if (missionToggle && missionList) {
    missionToggle.addEventListener('click', () => {
      const isHidden = missionList.style.display === 'none';
      missionList.style.display = isHidden ? 'grid' : 'none';
      missionToggle.textContent = isHidden 
        ? '↑ Click here to hide mission list'
        : '↓ Click here to show mission list';
    });
  }

  // --- Switch model button ------------------------------------
  const switchBtn = document.getElementById("switchBtn");
  const iframe = document.querySelector("iframe");

  if (switchBtn && iframe) {
    let showingStation = false;
    const cockpitURL = "https://sketchfab.com/models/4caa8ea957694250841ed614b996c1b1/embed?autostart=1&preload=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_watermark=0&ui_watermark_link=0";

    const stationURL = "https://sketchfab.com/models/edb9c45ae45941c399cd21b5309bf138/embed?autostart=1&preload=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_watermark=0&ui_watermark_link=0";

    switchBtn.addEventListener("click", () => {
      if (showingStation) {
        iframe.src = cockpitURL;
        switchBtn.textContent = "Switch to space station model";
      } else {
        iframe.src = stationURL;
        switchBtn.textContent = "Switch to space cockpit model";
      }
      showingStation = !showingStation;
    });
  }

  // --- NavTrax teaser -> single video modal (ID -> embed URL) ---------------
  const teaser = document.getElementById('navtrax-teaser');
  if (teaser) {
    const videoId = teaser.dataset.videoId || 'x7sw8R_X-zo';
    const demoUrl = embedFromId(videoId);
    const openDemo = () => openMissionModal('navDemoModal', demoUrl);

    teaser.querySelector('.teaser-img')?.addEventListener('click', openDemo);
    teaser.querySelector('.teaser-text')?.addEventListener('click', openDemo);
  }

});

// Login popup logic
const loginPopup = document.getElementById("loginPopup");
const btnUserLogin = document.getElementById("btn-user-login");
const btnFacilitatorLogin = document.getElementById("btn-facilitator-login");
const loginSubmit = document.getElementById("loginSubmit");
const loginReset = document.getElementById("loginReset");

function openLoginPopup() {
  loginPopup.style.display = "flex";
}

function closeLoginPopup() {
  loginPopup.style.display = "none";
}

if (btnUserLogin) btnUserLogin.addEventListener("click", openLoginPopup);
if (btnFacilitatorLogin) btnFacilitatorLogin.addEventListener("click", openLoginPopup);

if (loginPopup) {
  loginPopup.addEventListener("click", (e) => {
    if (e.target === loginPopup) closeLoginPopup();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLoginPopup();
});

if (loginSubmit) loginSubmit.addEventListener("click", () => {
  // Hook: Add login authentication logic here
  alert("Login clicked!");
  closeLoginPopup();
});

if (loginReset) loginReset.addEventListener("click", () => {
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
});

// --- Background audio for non-A-Frame pages --------------------------------
(function () {
  const bgm = document.getElementById('bgm');
  if (!bgm) return;

  bgm.volume = 0.35;

  // Try to play quietly on load (muted) – most browsers will allow this.
  const tryPlay = () => bgm.play().catch(() => { /* ignored until user gesture */ });
  tryPlay();

  // On first user gesture, unmute and ensure playback
  const kick = () => {
    bgm.muted = false;
    tryPlay();
    window.removeEventListener('click', kick);
    window.removeEventListener('keydown', kick);
    window.removeEventListener('touchstart', kick, { passive: true });
  };
  window.addEventListener('click', kick);
  window.addEventListener('keydown', kick);
  window.addEventListener('touchstart', kick, { passive: true });

  // (Optional nicety) Resume after tab becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
})();


