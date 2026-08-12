/**
 * TITAN HOROLOGY - Interactive Scrollytelling, Chronograph Showcase & Bespoke Studio Engine
 * High-performance HTML5 Canvas Sequence Renderer with Web Audio synthesis
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TOTAL_FRAMES = 210;
  const FRAME_BASE_PATH = 'frames/ezgif-frame-';
  const FRAME_EXT = '.jpg';
  
  // --- DOM Elements ---
  const preloader = document.getElementById('preloader');
  const preloadBar = document.getElementById('preloadBar');
  const preloadStatus = document.getElementById('preloadStatus');
  const navbar = document.getElementById('navbar');
  const canvas = document.getElementById('watchCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const genesisSection = document.getElementById('genesis');
  const hudFrameNumber = document.getElementById('hudFrameNumber');
  const timelineScrubber = document.getElementById('timelineScrubber');
  const frameCounter = document.getElementById('frameCounter');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const rewindBtn = document.getElementById('rewindBtn');
  const hotspotsLayer = document.getElementById('hotspotsLayer');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const soundIconOn = document.getElementById('soundIconOn');
  const soundIconOff = document.getElementById('soundIconOff');

  // Story phases
  const storyCards = [
    document.getElementById('storyPhase1'),
    document.getElementById('storyPhase2'),
    document.getElementById('storyPhase3'),
    document.getElementById('storyPhase4'),
  ];

  // Chronograph Showcase Elements
  const chronoTiltCard = document.getElementById('chronoTiltCard');
  const chronoGlare = document.getElementById('chronoGlare');
  const stopwatchTime = document.getElementById('stopwatchTime');
  const stopwatchStatus = document.getElementById('stopwatchStatus');
  const chronoStartBtn = document.getElementById('chronoStartBtn');
  const chronoLapBtn = document.getElementById('chronoLapBtn');
  const chronoResetBtn = document.getElementById('chronoResetBtn');
  const reserveChronoBtn = document.getElementById('reserveChronoBtn');

  // Bespoke studio elements
  const studioWatchImg = document.getElementById('studioWatchImg');
  const studioModeBadge = document.getElementById('studioModeBadge');
  const engravingInput = document.getElementById('engravingInput');
  const engravingLiveBadge = document.getElementById('engravingLiveBadge');
  const configPrice = document.getElementById('configPrice');
  const selectedModelName = document.getElementById('selectedModelName');
  const selectedStrapName = document.getElementById('selectedStrapName');
  const modelSovereignBtn = document.getElementById('modelSovereignBtn');
  const modelChronoBtn = document.getElementById('modelChronoBtn');
  const lumeDayBtn = document.getElementById('lumeDayBtn');
  const lumeNightBtn = document.getElementById('lumeNightBtn');
  const strapButtons = document.querySelectorAll('[data-strap]');

  // Modal elements
  const reserveModal = document.getElementById('reserveModal');
  const openReserveBtn = document.getElementById('openReserveBtn');
  const orderCustomBtn = document.getElementById('orderCustomBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const doneModalBtn = document.getElementById('doneModalBtn');
  const reserveForm = document.getElementById('reserveForm');
  const modalFormScreen = document.getElementById('modalFormScreen');
  const modalSuccessScreen = document.getElementById('modalSuccessScreen');
  const certSerial = document.getElementById('certSerial');
  const certOwner = document.getElementById('certOwner');

  // --- State Variables ---
  const images = new Array(TOTAL_FRAMES + 1);
  let currentFrame = 1;
  let targetFrame = 1;
  let isPlaying = false;
  let playInterval = null;
  let isDragging = false;
  let startX = 0;
  let startFrame = 1;
  let audioEnabled = false;
  let audioCtx = null;
  
  // Bespoke State
  let currentModel = 'sovereign'; // 'sovereign' | 'chrono'
  let basePrice = 24500;
  let strapAddon = 0;

  // Stopwatch State
  let swRunning = false;
  let swStartTime = 0;
  let swElapsed = 0;
  let swInterval = null;

  // --- Frame Path Helper ---
  function getFramePath(idx) {
    const padded = String(idx).padStart(3, '0');
    return `${FRAME_BASE_PATH}${padded}${FRAME_EXT}`;
  }

  // --- Preload All 210 Frames ---
  function preloadImages() {
    let completed = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      
      img.onload = () => {
        images[i] = img;
        completed++;
        const pct = Math.round((completed / TOTAL_FRAMES) * 100);
        if (preloadBar) preloadBar.style.width = `${pct}%`;
        if (preloadStatus) preloadStatus.textContent = `Synthesizing Frames (${pct}%)`;

        if (i === 1) {
          setupResize();
          drawFrame(1);
        }

        if (completed === TOTAL_FRAMES) {
          onLoadingComplete();
        }
      };

      img.onerror = () => {
        completed++;
        if (completed === TOTAL_FRAMES) {
          onLoadingComplete();
        }
      };
    }
  }

  function onLoadingComplete() {
    setTimeout(() => {
      if (preloader) preloader.classList.add('loaded');
      setupResize();
      drawFrame(currentFrame);
    }, 300);
  }

  // --- High Performance Canvas Draw ---
  function drawFrame(frameIdx) {
    const clampedIdx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIdx)));
    const img = images[clampedIdx];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.min(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, nx, ny, nw, nh);

    updateHUD(clampedIdx);
  }

  function updateHUD(frameIdx) {
    const padded = String(frameIdx).padStart(3, '0');
    if (hudFrameNumber) hudFrameNumber.textContent = padded;
    if (frameCounter) frameCounter.textContent = `${padded} / ${TOTAL_FRAMES}`;
    if (timelineScrubber && document.activeElement !== timelineScrubber) {
      timelineScrubber.value = frameIdx;
    }

    updateStoryCards(frameIdx);

    if (hotspotsLayer) {
      if (frameIdx >= 180) {
        hotspotsLayer.classList.add('visible');
      } else {
        hotspotsLayer.classList.remove('visible');
      }
    }
  }

  function updateStoryCards(frameIdx) {
    storyCards.forEach((c) => {
      if (!c) return;
      c.classList.remove('active');
    });

    if (frameIdx <= 45 && storyCards[0]) {
      storyCards[0].classList.add('active');
    } else if (frameIdx <= 110 && storyCards[1]) {
      storyCards[1].classList.add('active');
    } else if (frameIdx <= 175 && storyCards[2]) {
      storyCards[2].classList.add('active');
    } else if (storyCards[3]) {
      storyCards[3].classList.add('active');
    }
  }

  // --- Render Loop with Smooth Lerp ---
  function renderLoop() {
    if (Math.abs(targetFrame - currentFrame) > 0.02) {
      const prevInt = Math.round(currentFrame);
      currentFrame += (targetFrame - currentFrame) * 0.25;
      const nextInt = Math.round(currentFrame);
      
      drawFrame(currentFrame);

      if (prevInt !== nextInt && audioEnabled) {
        playTickSound(nextInt);
      }
    }
    requestAnimationFrame(renderLoop);
  }

  // --- Setup Canvas for Retina & Screen Dimensions ---
  function setupResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    drawFrame(currentFrame);
  }

  // --- Scroll Engine (Scrollytelling) ---
  function handleScroll() {
    if (isPlaying) return;

    if (navbar) {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (!genesisSection) return;
    const rect = genesisSection.getBoundingClientRect();
    const totalHeight = genesisSection.offsetHeight - window.innerHeight;

    if (totalHeight <= 0) return;

    const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));
    const calculatedFrame = 1 + progress * (TOTAL_FRAMES - 1);
    targetFrame = calculatedFrame;
  }

  // --- Timeline Scrubber ---
  if (timelineScrubber) {
    timelineScrubber.addEventListener('input', (e) => {
      stopAutoPlay();
      targetFrame = parseInt(e.target.value, 10);
      currentFrame = targetFrame;
      drawFrame(targetFrame);
    });
  }

  // --- Canvas Drag to Scrub ---
  if (canvas) {
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startFrame = targetFrame;
      stopAutoPlay();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const frameDelta = (deltaX / window.innerWidth) * TOTAL_FRAMES * 1.5;
      targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, startFrame + frameDelta));
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Support
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startFrame = targetFrame;
        stopAutoPlay();
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - startX;
      const frameDelta = (deltaX / window.innerWidth) * TOTAL_FRAMES * 1.5;
      targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, startFrame + frameDelta));
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // --- Cinematic Auto Play / Pause ---
  function startAutoPlay() {
    isPlaying = true;
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'inline';
    if (playPauseBtn) playPauseBtn.classList.add('playing');

    if (targetFrame >= TOTAL_FRAMES) {
      targetFrame = 1;
      currentFrame = 1;
    }

    playInterval = setInterval(() => {
      if (targetFrame < TOTAL_FRAMES) {
        targetFrame += 1;
      } else {
        stopAutoPlay();
      }
    }, 1000 / 30);
  }

  function stopAutoPlay() {
    isPlaying = false;
    if (playInterval) {
      clearInterval(playInterval);
      playInterval = null;
    }
    if (playIcon) playIcon.style.display = 'inline';
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (playPauseBtn) playPauseBtn.classList.remove('playing');
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });
  }

  if (rewindBtn) {
    rewindBtn.addEventListener('click', () => {
      stopAutoPlay();
      targetFrame = 1;
      currentFrame = 1;
      drawFrame(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3D Interactive Perspective Tilt on Chronograph Card ---
  if (chronoTiltCard) {
    chronoTiltCard.addEventListener('mousemove', (e) => {
      const rect = chronoTiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      chronoTiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (chronoGlare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        chronoGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22) 0%, transparent 60%)`;
      }
    });

    chronoTiltCard.addEventListener('mouseleave', () => {
      chronoTiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (chronoGlare) {
        chronoGlare.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 60%)';
      }
    });
  }

  // --- Interactive Chrono Stopwatch Simulator ---
  function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
  }

  if (chronoStartBtn) {
    chronoStartBtn.addEventListener('click', () => {
      initAudio();
      if (!swRunning) {
        swRunning = true;
        swStartTime = Date.now() - swElapsed;
        chronoStartBtn.textContent = 'Pause Chrono';
        chronoStartBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
        if (stopwatchStatus) stopwatchStatus.textContent = '⏱️ Running';

        swInterval = setInterval(() => {
          swElapsed = Date.now() - swStartTime;
          if (stopwatchTime) stopwatchTime.textContent = formatTime(swElapsed);
        }, 30);
      } else {
        swRunning = false;
        clearInterval(swInterval);
        chronoStartBtn.textContent = 'Resume Chrono';
        chronoStartBtn.style.background = 'var(--emerald-gradient)';
        if (stopwatchStatus) stopwatchStatus.textContent = '⏸️ Paused';
      }
    });
  }

  if (chronoLapBtn) {
    chronoLapBtn.addEventListener('click', () => {
      if (swRunning && stopwatchStatus) {
        stopwatchStatus.textContent = `📍 Lap Recorded: ${formatTime(swElapsed)}`;
        if (audioEnabled) playChimeSound();
      }
    });
  }

  if (chronoResetBtn) {
    chronoResetBtn.addEventListener('click', () => {
      swRunning = false;
      clearInterval(swInterval);
      swElapsed = 0;
      if (stopwatchTime) stopwatchTime.textContent = '00:00.00';
      if (stopwatchStatus) stopwatchStatus.textContent = 'Ready';
      if (chronoStartBtn) {
        chronoStartBtn.textContent = 'Start Chrono';
        chronoStartBtn.style.background = 'var(--emerald-gradient)';
      }
    });
  }

  if (reserveChronoBtn) {
    reserveChronoBtn.addEventListener('click', () => {
      const modalSubtitle = document.getElementById('modalReserveSubtitle');
      if (modalSubtitle) modalSubtitle.textContent = 'Secure your allocation for the Titan Stellar Emerald Chronograph ($1,290).';
      openModal();
    });
  }

  // --- Web Audio Synthesizer ---
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTickSound(frame) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = 300 + (frame / TOTAL_FRAMES) * 800;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);

      if (frame === TOTAL_FRAMES) {
        playChimeSound();
      }
    } catch (e) {}
  }

  function playChimeSound() {
    if (!audioCtx) return;
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, audioCtx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + 2.0);
      });
    } catch (e) {}
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        audioToggleBtn.classList.add('active');
        if (soundIconOn) soundIconOn.style.display = 'inline';
        if (soundIconOff) soundIconOff.style.display = 'none';
        playChimeSound();
      } else {
        audioToggleBtn.classList.remove('active');
        if (soundIconOn) soundIconOn.style.display = 'none';
        if (soundIconOff) soundIconOff.style.display = 'inline';
      }
    });
  }

  // --- Bespoke Studio & Model Switcher Logic ---
  if (modelSovereignBtn && modelChronoBtn) {
    modelSovereignBtn.addEventListener('click', () => {
      modelSovereignBtn.classList.add('active');
      modelChronoBtn.classList.remove('active');
      currentModel = 'sovereign';
      basePrice = 24500;
      if (selectedModelName) selectedModelName.textContent = 'Sovereign 18K Gold';
      if (studioWatchImg) {
        studioWatchImg.src = 'frames/ezgif-frame-210.jpg';
        studioWatchImg.style.maxHeight = '85%';
      }
      updateTotalPrice();
    });

    modelChronoBtn.addEventListener('click', () => {
      modelChronoBtn.classList.add('active');
      modelSovereignBtn.classList.remove('active');
      currentModel = 'chrono';
      basePrice = 1290;
      if (selectedModelName) selectedModelName.textContent = 'Stellar Emerald Chrono';
      if (studioWatchImg) {
        studioWatchImg.src = 'assets/titan-emerald-chronograph.jpg';
        studioWatchImg.style.maxHeight = '92%';
      }
      updateTotalPrice();
    });
  }

  strapButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      strapButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const type = btn.getAttribute('data-strap');
      strapAddon = parseInt(btn.getAttribute('data-price'), 10);
      
      if (selectedStrapName) {
        if (type === 'gold') selectedStrapName.textContent = '18K Solid Rose Gold';
        if (type === 'leather') selectedStrapName.textContent = 'Tuscan Cognac Alligator';
        if (type === 'rubber') selectedStrapName.textContent = 'Deep Emerald Vulcanized Silicone';
      }

      updateTotalPrice();
    });
  });

  function updateTotalPrice() {
    if (!configPrice) return;
    const total = basePrice + strapAddon;
    configPrice.textContent = `$${total.toLocaleString()} USD`;
  }

  if (lumeDayBtn && lumeNightBtn) {
    lumeDayBtn.addEventListener('click', () => {
      lumeDayBtn.classList.add('active');
      lumeNightBtn.classList.remove('active');
      if (studioWatchImg) studioWatchImg.classList.remove('night-mode');
      if (studioModeBadge) {
        studioModeBadge.textContent = 'Daylight Specular';
        studioModeBadge.style.borderColor = 'var(--border-gold)';
        studioModeBadge.style.color = 'var(--gold-300)';
      }
    });

    lumeNightBtn.addEventListener('click', () => {
      lumeNightBtn.classList.add('active');
      lumeDayBtn.classList.remove('active');
      if (studioWatchImg) studioWatchImg.classList.add('night-mode');
      if (studioModeBadge) {
        studioModeBadge.textContent = '✨ Super-LumiNova Active';
        studioModeBadge.style.borderColor = 'var(--emerald-400)';
        studioModeBadge.style.color = 'var(--emerald-400)';
      }
    });
  }

  if (engravingInput && engravingLiveBadge) {
    engravingInput.addEventListener('input', (e) => {
      const text = e.target.value.trim().toUpperCase() || 'TITAN-001';
      engravingLiveBadge.textContent = `MONOGRAM: ${text}`;
    });
  }

  // --- VIP Concierge Modal Handlers ---
  function openModal() {
    if (reserveModal) reserveModal.classList.add('open');
    if (modalFormScreen) modalFormScreen.style.display = 'block';
    if (modalSuccessScreen) modalSuccessScreen.classList.remove('active');
  }

  function closeModal() {
    if (reserveModal) reserveModal.classList.remove('open');
  }

  if (openReserveBtn) openReserveBtn.addEventListener('click', openModal);
  if (orderCustomBtn) orderCustomBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (doneModalBtn) doneModalBtn.addEventListener('click', closeModal);

  if (reserveModal) {
    reserveModal.addEventListener('click', (e) => {
      if (e.target === reserveModal) closeModal();
    });
  }

  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('vipName');
      const name = nameInput ? nameInput.value : 'Collector';
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const prefix = currentModel === 'chrono' ? 'TT-CHRONO' : 'TT-SOVEREIGN';
      
      if (certSerial) certSerial.textContent = `${prefix}-2026-${randomCode}`;
      if (certOwner) certOwner.textContent = `Provenance Issued to: ${name}`;

      if (modalFormScreen) modalFormScreen.style.display = 'none';
      if (modalSuccessScreen) modalSuccessScreen.classList.add('active');

      if (audioEnabled) {
        playChimeSound();
      }
    });
  }

  // --- Event Listeners Initialization ---
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', setupResize);

  // Initialize
  preloadImages();
  renderLoop();

})();
