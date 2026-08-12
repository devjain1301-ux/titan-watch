/**
 * TITAN HOROLOGY - Interactive Scrollytelling, Valuation Graph & Cloud Intelligence Engine
 * High-performance HTML5 Canvas Sequence Renderer with Web Audio synthesis & Financial Charting
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

  // Price Graph Elements
  const priceGraphCanvas = document.getElementById('priceGraphCanvas');
  const chartCtx = priceGraphCanvas ? priceGraphCanvas.getContext('2d') : null;
  const chartTooltip = document.getElementById('chartTooltip');
  const tooltipDate = document.getElementById('tooltipDate');
  const tooltipVal = document.getElementById('tooltipVal');
  const tooltipDelta = document.getElementById('tooltipDelta');
  const chartModelTitle = document.getElementById('chartModelTitle');
  const chartLivePriceDisplay = document.getElementById('chartLivePriceDisplay');
  const chartRoiBadge = document.getElementById('chartRoiBadge');
  const chartSovereignBtn = document.getElementById('chartSovereignBtn');
  const chartChronoBtn = document.getElementById('chartChronoBtn');
  const timeButtons = document.querySelectorAll('.time-btn');
  const kpiMSRP = document.getElementById('kpiMSRP');
  const kpiATH = document.getElementById('kpiATH');
  const kpiLiquidity = document.getElementById('kpiLiquidity');
  const kpiForecast = document.getElementById('kpiForecast');

  // Concierge Elements
  const queryChipBtns = document.querySelectorAll('.query-chip-btn');
  const conciergeResponseText = document.getElementById('conciergeResponseText');

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
  let currentModel = 'sovereign';
  let basePrice = 24500;
  let strapAddon = 0;

  // Chart Data & State
  let activeChartModel = 'sovereign';
  let activeTimeframe = '1Y';
  let mouseChartX = null;

  const chartDataSets = {
    sovereign: {
      title: 'Titan Sovereign Everose (41mm)',
      currentPrice: '$24,500',
      roi: '+27.6% (1Y)',
      msrp: '$19,200',
      ath: '$25,800',
      liquidity: '98.4 / 100',
      forecast: '$31,200',
      timeframes: {
        '1M': [
          { date: 'Jul 12', price: 23900 },
          { date: 'Jul 19', price: 24100 },
          { date: 'Jul 26', price: 24050 },
          { date: 'Aug 02', price: 24350 },
          { date: 'Aug 09', price: 24500 },
        ],
        '6M': [
          { date: 'Feb 2026', price: 21800 },
          { date: 'Mar 2026', price: 22400 },
          { date: 'Apr 2026', price: 22900 },
          { date: 'May 2026', price: 23500 },
          { date: 'Jun 2026', price: 23800 },
          { date: 'Jul 2026', price: 24200 },
          { date: 'Aug 2026', price: 24500 },
        ],
        '1Y': [
          { date: 'Aug 2025', price: 19200 },
          { date: 'Oct 2025', price: 20100 },
          { date: 'Dec 2025', price: 21200 },
          { date: 'Feb 2026', price: 21900 },
          { date: 'Apr 2026', price: 23100 },
          { date: 'Jun 2026', price: 23950 },
          { date: 'Aug 2026', price: 24500 },
        ],
        '3Y': [
          { date: '2023 Q3', price: 16500 },
          { date: '2024 Q1', price: 17400 },
          { date: '2024 Q3', price: 18300 },
          { date: '2025 Q1', price: 18900 },
          { date: '2025 Q3', price: 20200 },
          { date: '2026 Q1', price: 22500 },
          { date: '2026 Q3', price: 24500 },
        ],
        'ALL': [
          { date: 'Genesis 2022', price: 14800 },
          { date: '2023', price: 16800 },
          { date: '2024', price: 18500 },
          { date: '2025', price: 20400 },
          { date: '2026 Present', price: 24500 },
        ]
      }
    },
    chrono: {
      title: 'Titan Stellar Emerald Chronograph (43mm)',
      currentPrice: '$1,290',
      roi: '+22.8% (1Y)',
      msrp: '$1,050',
      ath: '$1,350',
      liquidity: '96.2 / 100',
      forecast: '$1,750',
      timeframes: {
        '1M': [
          { date: 'Jul 12', price: 1240 },
          { date: 'Jul 19', price: 1255 },
          { date: 'Jul 26', price: 1260 },
          { date: 'Aug 02', price: 1280 },
          { date: 'Aug 09', price: 1290 },
        ],
        '6M': [
          { date: 'Feb 2026', price: 1120 },
          { date: 'Mar 2026', price: 1150 },
          { date: 'Apr 2026', price: 1190 },
          { date: 'May 2026', price: 1220 },
          { date: 'Jun 2026', price: 1250 },
          { date: 'Jul 2026', price: 1275 },
          { date: 'Aug 2026', price: 1290 },
        ],
        '1Y': [
          { date: 'Aug 2025', price: 1050 },
          { date: 'Oct 2025', price: 1090 },
          { date: 'Dec 2025', price: 1140 },
          { date: 'Feb 2026', price: 1180 },
          { date: 'Apr 2026', price: 1220 },
          { date: 'Jun 2026', price: 1260 },
          { date: 'Aug 2026', price: 1290 },
        ],
        '3Y': [
          { date: '2023 Q3', price: 890 },
          { date: '2024 Q1', price: 930 },
          { date: '2024 Q3', price: 980 },
          { date: '2025 Q1', price: 1020 },
          { date: '2025 Q3', price: 1090 },
          { date: '2026 Q1', price: 1190 },
          { date: '2026 Q3', price: 1290 },
        ],
        'ALL': [
          { date: 'Release 2023', price: 850 },
          { date: '2024', price: 960 },
          { date: '2025', price: 1080 },
          { date: '2026 Present', price: 1290 },
        ]
      }
    }
  };

  // Concierge Dialogue Database
  const conciergeResponses = {
    resale: '"The Titan Sovereign Everose has maintained an average secondary market premium of +27.6% across international horology auctions. With strict allocation caps of 500 numbered pieces, collectors benefit from sustained capital appreciation."',
    movement: '"The Calibre 8800 Manufacture Movement boasts a 72-hour power reserve, Co-Axial Swiss escapement, and an anti-magnetic silicon hairspring tested to resist 15,000 Gauss. Each movement is individually COSC certified."',
    chrono: '"The Stellar Emerald Chronograph features a triple-eye complication measuring 1/10th second intervals, 24-hour diurnal military time, and small seconds sweep housed in a PVD brushed titanium-steel case."',
    delivery: '"Every allocated timepiece is transported in an armored diplomatic vault case with biometric seal, accompanied by an encrypted NFC physical certificate of authenticity and 5-year global concierge warranty."'
  };

  // --- Preload All 210 Frames ---
  function getFramePath(idx) {
    const padded = String(idx).padStart(3, '0');
    return `${FRAME_BASE_PATH}${padded}${FRAME_EXT}`;
  }

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
      setupPriceChart();
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
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    drawFrame(currentFrame);
    setupPriceChart();
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

  // --- REALISTIC PRICE HISTORY CANVAS GRAPH ENGINE ---
  function setupPriceChart() {
    if (!priceGraphCanvas || !chartCtx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = priceGraphCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    priceGraphCanvas.width = Math.floor(rect.width * dpr);
    priceGraphCanvas.height = Math.floor(rect.height * dpr);

    drawPriceChart();
  }

  function drawPriceChart() {
    if (!priceGraphCanvas || !chartCtx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = priceGraphCanvas.width;
    const ch = priceGraphCanvas.height;
    const dataObj = chartDataSets[activeChartModel];
    const points = dataObj.timeframes[activeTimeframe];

    chartCtx.clearRect(0, 0, cw, ch);

    const paddingLeft = 60 * dpr;
    const paddingRight = 30 * dpr;
    const paddingTop = 30 * dpr;
    const paddingBottom = 45 * dpr;

    const plotW = cw - paddingLeft - paddingRight;
    const plotH = ch - paddingTop - paddingBottom;

    const prices = points.map(p => p.price);
    const minPrice = Math.min(...prices) * 0.96;
    const maxPrice = Math.max(...prices) * 1.04;
    const priceRange = maxPrice - minPrice;

    // Draw Horizontal Gridlines & Y-Axis Labels
    chartCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    chartCtx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    chartCtx.font = `${11 * dpr}px 'Space Grotesk', sans-serif`;
    chartCtx.textAlign = 'right';
    chartCtx.textBaseline = 'middle';
    chartCtx.lineWidth = 1 * dpr;

    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const yVal = minPrice + (priceRange * (i / gridSteps));
      const yPos = ch - paddingBottom - (plotH * (i / gridSteps));

      chartCtx.beginPath();
      chartCtx.moveTo(paddingLeft, yPos);
      chartCtx.lineTo(cw - paddingRight, yPos);
      chartCtx.stroke();

      const labelStr = activeChartModel === 'sovereign' 
        ? `$${(yVal / 1000).toFixed(1)}k` 
        : `$${Math.round(yVal)}`;
      chartCtx.fillText(labelStr, paddingLeft - (10 * dpr), yPos);
    }

    // Convert Points to Coordinates
    const coords = points.map((p, idx) => {
      const x = paddingLeft + (plotW * (idx / (points.length - 1)));
      const y = ch - paddingBottom - (plotH * ((p.price - minPrice) / priceRange));
      return { x, y, ...p };
    });

    // Draw Smooth Bézier Curve Path
    chartCtx.beginPath();
    chartCtx.moveTo(coords[0].x, coords[0].y);

    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const midX = (p0.x + p1.x) / 2;
      chartCtx.bezierCurveTo(midX, p0.y, midX, p1.y, p1.x, p1.y);
    }

    // Gradient Fill Area
    const fillGradient = chartCtx.createLinearGradient(0, paddingTop, 0, ch - paddingBottom);
    if (activeChartModel === 'sovereign') {
      fillGradient.addColorStop(0, 'rgba(212, 175, 55, 0.28)');
      fillGradient.addColorStop(1, 'rgba(212, 175, 55, 0.0)');
    } else {
      fillGradient.addColorStop(0, 'rgba(16, 185, 129, 0.32)');
      fillGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    }

    chartCtx.lineTo(coords[coords.length - 1].x, ch - paddingBottom);
    chartCtx.lineTo(coords[0].x, ch - paddingBottom);
    chartCtx.closePath();
    chartCtx.fillStyle = fillGradient;
    chartCtx.fill();

    // Draw Glowing Line
    chartCtx.beginPath();
    chartCtx.moveTo(coords[0].x, coords[0].y);
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const midX = (p0.x + p1.x) / 2;
      chartCtx.bezierCurveTo(midX, p0.y, midX, p1.y, p1.x, p1.y);
    }

    chartCtx.strokeStyle = activeChartModel === 'sovereign' ? '#e7c365' : '#34d399';
    chartCtx.lineWidth = 3 * dpr;
    chartCtx.shadowColor = activeChartModel === 'sovereign' ? 'rgba(212, 175, 55, 0.6)' : 'rgba(16, 185, 129, 0.7)';
    chartCtx.shadowBlur = 12 * dpr;
    chartCtx.stroke();
    chartCtx.shadowBlur = 0;

    // Draw Data Point Beacons & X-Axis Labels
    chartCtx.textAlign = 'center';
    chartCtx.textBaseline = 'top';
    chartCtx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    chartCtx.font = `${11 * dpr}px 'Space Grotesk', sans-serif`;

    coords.forEach((pt) => {
      // Beacon Dot
      chartCtx.beginPath();
      chartCtx.arc(pt.x, pt.y, 4 * dpr, 0, Math.PI * 2);
      chartCtx.fillStyle = '#ffffff';
      chartCtx.fill();
      chartCtx.strokeStyle = activeChartModel === 'sovereign' ? '#d4af37' : '#10b981';
      chartCtx.lineWidth = 2 * dpr;
      chartCtx.stroke();

      // X-Axis Date
      chartCtx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      chartCtx.fillText(pt.date, pt.x, ch - paddingBottom + (12 * dpr));
    });

    // Handle Interactive Mouse Crosshair
    if (mouseChartX !== null) {
      const clampedX = Math.max(paddingLeft, Math.min(cw - paddingRight, mouseChartX * dpr));
      const pct = (clampedX - paddingLeft) / plotW;
      const exactIdx = Math.max(0, Math.min(coords.length - 1, Math.round(pct * (coords.length - 1))));
      const currentPt = coords[exactIdx];

      // Draw Vertical Crosshair Line
      chartCtx.beginPath();
      chartCtx.setLineDash([4 * dpr, 4 * dpr]);
      chartCtx.moveTo(currentPt.x, paddingTop);
      chartCtx.lineTo(currentPt.x, ch - paddingBottom);
      chartCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      chartCtx.lineWidth = 1 * dpr;
      chartCtx.stroke();
      chartCtx.setLineDash([]);

      // Draw Pulsing Focus Circle
      chartCtx.beginPath();
      chartCtx.arc(currentPt.x, currentPt.y, 8 * dpr, 0, Math.PI * 2);
      chartCtx.fillStyle = activeChartModel === 'sovereign' ? 'rgba(212, 175, 55, 0.4)' : 'rgba(16, 185, 129, 0.4)';
      chartCtx.fill();
      chartCtx.strokeStyle = '#ffffff';
      chartCtx.lineWidth = 2 * dpr;
      chartCtx.stroke();

      // Update Tooltip HUD
      if (chartTooltip && tooltipDate && tooltipVal && tooltipDelta) {
        chartTooltip.style.opacity = '1';
        tooltipDate.textContent = currentPt.date;
        tooltipVal.textContent = `$${currentPt.price.toLocaleString()} USD`;
        const startP = coords[0].price;
        const gain = (((currentPt.price - startP) / startP) * 100).toFixed(1);
        tooltipDelta.textContent = `${gain >= 0 ? '+' : ''}${gain}% relative to start`;
      }
    }
  }

  // --- Chart Mouse Interactions ---
  if (priceGraphCanvas) {
    priceGraphCanvas.addEventListener('mousemove', (e) => {
      const rect = priceGraphCanvas.getBoundingClientRect();
      mouseChartX = e.clientX - rect.left;
      drawPriceChart();
    });

    priceGraphCanvas.addEventListener('mouseleave', () => {
      mouseChartX = null;
      if (chartTooltip) chartTooltip.style.opacity = '0';
      drawPriceChart();
    });
  }

  // --- Chart Model & Timeframe Buttons ---
  function updateChartMetrics() {
    const data = chartDataSets[activeChartModel];
    if (chartModelTitle) chartModelTitle.textContent = data.title;
    if (chartLivePriceDisplay) chartLivePriceDisplay.textContent = data.currentPrice;
    if (chartRoiBadge) chartRoiBadge.textContent = data.roi;
    if (kpiMSRP) kpiMSRP.textContent = data.msrp;
    if (kpiATH) kpiATH.textContent = data.ath;
    if (kpiLiquidity) kpiLiquidity.textContent = data.liquidity;
    if (kpiForecast) kpiForecast.textContent = data.forecast;
  }

  if (chartSovereignBtn && chartChronoBtn) {
    chartSovereignBtn.addEventListener('click', () => {
      chartSovereignBtn.classList.add('active');
      chartChronoBtn.classList.remove('active');
      activeChartModel = 'sovereign';
      updateChartMetrics();
      drawPriceChart();
    });

    chartChronoBtn.addEventListener('click', () => {
      chartChronoBtn.classList.add('active');
      chartSovereignBtn.classList.remove('active');
      activeChartModel = 'chrono';
      updateChartMetrics();
      drawPriceChart();
    });
  }

  timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTimeframe = btn.getAttribute('data-timeframe');
      drawPriceChart();
    });
  });

  // --- Concierge Query Buttons ---
  queryChipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      queryChipBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const queryKey = btn.getAttribute('data-query');
      if (conciergeResponseText && conciergeResponses[queryKey]) {
        conciergeResponseText.style.opacity = '0';
        setTimeout(() => {
          conciergeResponseText.textContent = conciergeResponses[queryKey];
          conciergeResponseText.style.opacity = '1';
        }, 150);
      }
    });
  });

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
