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
  const video = document.querySelector('#pitch');          // <video> in assets
  const videoUI = document.querySelector('#videoPlane');   // <a-video> in scene

  // Close “X”
  const btnCloseVideo = document.querySelector('#btn-close-video'); // red square
  const txtCloseVideo = document.querySelector('#txt-close-video'); // "X" text

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

  // Wire up “Presentation” as a toggle
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

  // (Optional) ESC key closes the video
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

});

// Prototype modal + lightbox
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const infoBtn     = document.getElementById("infoBtn");
  const protoModal  = document.getElementById("protoModal");
  const modalClose  = document.getElementById("modalClose");

  const lightbox    = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  // Bail out on pages that don't have the modal
  if (!infoBtn || !protoModal || !modalClose) return;

  let lastFocus = null; // to restore focus after closing

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

  // --- Modal helpers --------------------------------------------------------
  const openModal = () => {
    lastFocus = document.activeElement;
    protoModal.style.display = "block";
    protoModal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    modalClose.focus();
  };

  const closeModal = () => {
    closeLightbox(); // ensure image overlay is also closed
    protoModal.style.display = "none";
    protoModal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    // Pause any videos in the modal
    protoModal.querySelectorAll("video").forEach(v => { try { v.pause(); } catch {} });
    // Restore focus to where the user was
    if (lastFocus) { try { lastFocus.focus(); } catch {} }
  };

  // --- Wiring: open/close modal --------------------------------------------
  infoBtn.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);
  // Click outside the panel to close
  protoModal.addEventListener("click", (e) => {
    if (e.target === protoModal) closeModal();
  });

  // --- Wiring: thumbnail -> lightbox (event delegation) --------------------
  protoModal.addEventListener("click", (e) => {
    const btn = e.target.closest(".thumb");
    if (!btn || !protoModal.contains(btn)) return;
    const img = btn.querySelector("img");
    const src = btn.dataset.src || img?.src;
    const alt = img?.alt || "Prototype image";
    if (src) openLightbox(src, alt);
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    // Click backdrop to close
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // --- Keyboard: Esc closes lightbox first, then modal ---------------------
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && lightbox.style.display === "flex") closeLightbox();
      else if (protoModal.style.display === "block") closeModal();
    }
  });
});
