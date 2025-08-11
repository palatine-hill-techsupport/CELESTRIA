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

  // Other buttons (stubs for now)
  if (btnNav) btnNav.addEventListener('click', () => clickPulse(btnNav));
  if (btnSweep) btnSweep.addEventListener('click', () => clickPulse(btnSweep));
  if (btnHiscores) btnHiscores.addEventListener('click', () => clickPulse(btnHiscores));
  if (btnUserLogin) btnUserLogin.addEventListener('click', () => clickPulse(btnUserLogin));
  if (btnFacilitatorLogin) btnFacilitatorLogin.addEventListener('click', () => clickPulse(btnFacilitatorLogin));
});
