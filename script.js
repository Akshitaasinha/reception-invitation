document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Google Calendar URL Generator
  const calBtn = document.getElementById('calendar-btn');
  if (calBtn) {
    const title = encodeURIComponent('Akshuna & Darrpan — Wedding Reception');
    const details = encodeURIComponent('Join us for an evening of music, dining, and celebration at Dwarka Lawn, Nagpur.');
    const location = encodeURIComponent('Dwarka Lawn, Wardha Road, Khapri, Nagpur, Maharashtra');
    // 2026-12-20 from 18:30 to 23:30 IST (13:00 to 18:00 UTC)
    const dates = '20261220T130000Z/20261220T180000Z';
    calBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }

  // 2. Interactive Envelope Gatefold Unfolding
  const sealContainer = document.getElementById('wax-seal-container');
  const bgMusic = document.getElementById('bg-music');
  let isOpened = false;

  sealContainer.addEventListener('click', () => {
    if (isOpened) return;
    isOpened = true;

    // Start background music
    if (bgMusic) {
      bgMusic.volume = 0.55;
      bgMusic.play().catch(e => console.log('Audio autoplay prevented'));
    }

    const tl = gsap.timeline();

    // Fade out text prompt
    tl.to('#wax-seal-container', {
      scale: 0.8,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in'
    })
    // 3.0s smooth gatefold opening
    .to('.flap-top', {
      rotateX: 110,
      opacity: 0,
      duration: 3.0,
      ease: 'sine.inOut'
    }, '-=0.1')
    .to('.flap-bottom', {
      rotateX: -110,
      opacity: 0,
      duration: 3.0,
      ease: 'sine.inOut'
    }, '<')
    .to('.flap-left', {
      rotateY: -110,
      opacity: 0,
      duration: 3.0,
      ease: 'sine.inOut'
    }, '<')
    .to('.flap-right', {
      rotateY: 110,
      opacity: 0,
      duration: 3.0,
      ease: 'sine.inOut'
    }, '<')
    // Remove overlay
    .to('#envelope-overlay', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        document.getElementById('envelope-overlay').style.display = 'none';
      }
    }, '-=0.5')
    // Reveal scroll indicator
    .to('#scroll-guide', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.2');
  });

  // 3. Auto-Hide Scroll Guide upon Scrolling
  window.addEventListener('scroll', () => {
    const scrollGuide = document.getElementById('scroll-guide');
    if (scrollGuide && window.scrollY > 40) {
      scrollGuide.style.opacity = '0';
    }
  }, { passive: true });

  // 4. Responsive 3D Circular Scratch Card Interaction
  const canvas = document.getElementById('scratch-canvas');
  const container = document.getElementById('scratch-container');

  if (canvas && container) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let isDrawing = false;
    let isRevealed = false;
    let width = container.offsetWidth;
    let height = container.offsetHeight;

    function resizeAndPaintCanvas() {
      width = container.offsetWidth;
      height = container.offsetHeight;

      // Double resolution for high-density smartphone screens
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.scale(2, 2);

      drawGoldFoil();
    }

    function drawGoldFoil() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
      ctx.clip();

      const grad = ctx.createRadialGradient(
        width * 0.35, height * 0.35, 15,
        width / 2, height / 2, width / 2
      );
      grad.addColorStop(0, '#fff4bf');
      grad.addColorStop(0.35, '#e0b84c');
      grad.addColorStop(0.7, '#b68d2c');
      grad.addColorStop(1, '#664d14');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Concentric mandala rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, width * 0.41, 0, Math.PI * 2);
      ctx.arc(width / 2, height / 2, width * 0.36, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, width * 0.31, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center foil typography
      const scaleFactor = width / 290;
      ctx.fillStyle = '#4a370e';
      ctx.font = `bold ${Math.round(32 * scaleFactor)}px "Cinzel", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ॐ', width / 2, height / 2 - (18 * scaleFactor));

      ctx.font = `bold ${Math.round(10.5 * scaleFactor)}px "Cinzel", serif`;
      ctx.fillText('SCRATCH WITH LOVE', width / 2, height / 2 + (22 * scaleFactor));

      ctx.fillStyle = '#6e541b';
      ctx.font = `italic ${Math.round(9.5 * scaleFactor)}px "Playfair Display", serif`;
      ctx.fillText('Rub gently to reveal', width / 2, height / 2 + (40 * scaleFactor));

      ctx.restore();
    }

    resizeAndPaintCanvas();

    function clampVal(val, min, max) {
      return Math.min(Math.max(val, min), max);
    }

    function scratch(e) {
      if (!isDrawing || isRevealed) return;
      if (e.cancelable) e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, clampVal(width * 0.08, 18, 24), 0, Math.PI * 2);
      ctx.fill();

      checkScratchPercentage();
    }

    function checkScratchPercentage() {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentPixels = 0;
      const totalSampled = data.length / 32;

      for (let i = 3; i < data.length; i += 32) {
        if (data[i] === 0) transparentPixels++;
      }

      const percent = (transparentPixels / totalSampled) * 100;

      if (percent > 42 && !isRevealed) {
        isRevealed = true;
        gsap.to(canvas, {
          opacity: 0,
          scale: 1.04,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            canvas.style.display = 'none';
          }
        });
      }
    }

    // Touch Events
    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      scratch(e);
    }, { passive: false });
    window.addEventListener('touchend', () => { isDrawing = false; });
    canvas.addEventListener('touchmove', scratch, { passive: false });

    // Mouse Events
    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      scratch(e);
    });
    window.addEventListener('mouseup', () => { isDrawing = false; });
    canvas.addEventListener('mousemove', scratch);

    window.addEventListener('resize', () => {
      if (!isRevealed) {
        resizeAndPaintCanvas();
      }
    });
  }

  // =========================================================
  // 🌸 5. 3D FALLING PETALS & INTERACTIVE TOUCH SPARKLES
  // =========================================================
  const pCanvas = document.getElementById('petals-canvas');
  if (pCanvas) {
    const pCtx = pCanvas.getContext('2d');
    let pWidth = (pCanvas.width = window.innerWidth);
    let pHeight = (pCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      pWidth = pCanvas.width = window.innerWidth;
      pHeight = pCanvas.height = window.innerHeight;
    });

    // Petal Class (3D Tumbling & Tilting Jasmine / Rose Petals)
    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * pWidth;
        this.y = init ? Math.random() * pHeight : -20;
        this.size = Math.random() * 8 + 7;
        this.speedY = Math.random() * 0.8 + 0.6;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.tilt = Math.random() * Math.PI;
        this.tiltSpeed = Math.random() * 0.03 + 0.01;
        this.isBlush = Math.random() > 0.65;
        this.opacity = Math.random() * 0.45 + 0.45;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.tilt) * 0.6 + this.speedX;
        this.rotation += this.rotSpeed;
        this.tilt += this.tiltSpeed;

        if (this.y > pHeight + 20 || this.x < -30 || this.x > pWidth + 30) {
          this.reset(false);
        }
      }

      draw() {
        pCtx.save();
        pCtx.translate(this.x, this.y);
        pCtx.rotate(this.rotation);
        pCtx.scale(Math.cos(this.tilt), 1);

        pCtx.beginPath();
        pCtx.moveTo(0, 0);
        pCtx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
        pCtx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);

        pCtx.fillStyle = this.isBlush
          ? `rgba(255, 230, 235, ${this.opacity})`
          : `rgba(255, 252, 242, ${this.opacity})`;
        pCtx.shadowColor = 'rgba(255, 215, 107, 0.4)';
        pCtx.shadowBlur = 4;
        pCtx.fill();
        pCtx.restore();
      }
    }

    const petalsArray = Array.from({ length: 26 }, () => new Petal());

    // Interactive Touch / Mouse Sparkles Array
    const touchSparkles = [];

    class SparkleDust {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3.5 + 1.5;
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3 - 0.8;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.015;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
      }

      draw() {
        pCtx.save();
        pCtx.globalAlpha = Math.max(0, this.alpha);
        pCtx.fillStyle = '#ffe685';
        pCtx.shadowColor = '#ffffff';
        pCtx.shadowBlur = 8;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
      }
    }

    function addTouchSparkles(clientX, clientY) {
      for (let i = 0; i < 4; i++) {
        touchSparkles.push(new SparkleDust(clientX, clientY));
      }
    }

    window.addEventListener('mousemove', (e) => {
      addTouchSparkles(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        addTouchSparkles(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    function animateParticles() {
      pCtx.clearRect(0, 0, pWidth, pHeight);

      // Render Falling Petals
      for (let i = 0; i < petalsArray.length; i++) {
        petalsArray[i].update();
        petalsArray[i].draw();
      }

      // Render Interactive Stardust
      for (let i = touchSparkles.length - 1; i >= 0; i--) {
        touchSparkles[i].update();
        touchSparkles[i].draw();
        if (touchSparkles[i].alpha <= 0) {
          touchSparkles.splice(i, 1);
        }
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }
});