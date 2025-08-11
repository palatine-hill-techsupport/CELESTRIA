document.addEventListener("DOMContentLoaded", () => {
  const btnNav = document.querySelector('#btn-navtrax');
  const btnSweep = document.querySelector('#btn-sweep');
  const btnPitch = document.querySelector('#btn-pitch');
  const btnHiscores = document.querySelector('#btn-hiscores');
  const btnUserLogin = document.querySelector('#btn-user-login');
  const btnFacilitatorLogin = document.querySelector('#btn-facilitator-login');

  const video = document.querySelector('#pitch');
  const videoUI = document.querySelector('#videoPlane');

  function clickPulse(el) {
    el.setAttribute('animation__press', {
      property: 'scale',
      to: '0.95 0.95 0.95',
      dur: 80,
      dir: 'alternate',
      loop: 1
    });
  }

  // Main menu actions
  btnNav.addEventListener('click', () => {
    clickPulse(btnNav);
    // NavTrax action
  });

  btnSweep.addEventListener('click', () => {
    clickPulse(btnSweep);
    // Space Junk Sweep action
  });

  btnPitch.addEventListener('click', () => {
    clickPulse(btnPitch);
    const showing = videoUI.getAttribute('visible');
    if (!showing) {
      videoUI.setAttribute('visible', true);
      video.play();
    } else {
      if (!video.paused) video.pause();
      videoUI.setAttribute('visible', false);
    }
  });

  btnHiscores.addEventListener('click', () => {
    clickPulse(btnHiscores);
    // Hiscores action
  });

  // Auth buttons
  btnUserLogin.addEventListener('click', () => {
    clickPulse(btnUserLogin);
    // User login action
  });

  btnFacilitatorLogin.addEventListener('click', () => {
    clickPulse(btnFacilitatorLogin);
    // Facilitator login action
  });
});
