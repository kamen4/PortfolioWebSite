;(function($) {
  const defaults = {
    n: 300,
    maxN: 1000,
    r: 2,
    maxSpeed: 0.5,
    linkDist: 100,
    invertColor: false,
  };

  $.fn.particlesBg = function(options) {
    return this.each(function() {
      const $canvas = $(this);
      const cfg = $.extend({}, defaults, {
        n: parseInt($canvas.data('n')),
        r: parseFloat($canvas.data('r')),
        maxSpeed: parseFloat($canvas.data('max-speed')),
        linkDist: parseFloat($canvas.data('link-dist')),
        invertColor: $canvas.data('invert-color') === true
      }, options);

      const canvas = this;
      const ctx = canvas.getContext('2d');
      let particles = [];
      let mouse = { x: null, y: null };
      const $win = $(window);

      cfg.n = Math.min(cfg.maxN, Math.round($win.height() * $win.width() / (1920*1080/cfg.n)));

      init();

      function init() {
        resizeCanvas();
        $win.on('resize', resizeCanvas);
        if (!$.browser.mobile) {
          $win.on('mousemove', onMouseMove);
        }
        particles = generateParticles(cfg.n);
        requestAnimationFrame(animate);
      }

      function resizeCanvas() {
        canvas.width = $win.width();
        canvas.height = $win.height();
      }

      function onMouseMove(e) {
        const offset = $canvas.offset();
        mouse.x = e.pageX - offset.left;
        mouse.y = e.pageY - offset.top;
      }

      function rand(min, max) {
        return Math.random() * (max - min) + min;
      }

      function generateParticles(n) {
        const arr = [];
        for (let i = 0; i < n; i++) {
          arr.push({
            x: rand(cfg.r, canvas.width - cfg.r),
            y: rand(cfg.r, canvas.height - cfg.r),
            vx: rand(-cfg.maxSpeed, cfg.maxSpeed),
            vy: rand(-cfg.maxSpeed, cfg.maxSpeed)
          });
        }
        return arr;
      }

      function linkParticles() {
        const all = particles.concat(mouse.x !== null ? [mouse] : []);
        for (let i = 0; i < all.length; i++) {
          const p1 = all[i];
          for (let j = i + 1; j < all.length; j++) {
            const p2 = all[j];
            const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
            if (dist <= cfg.linkDist) {
              const t = 1 - dist / cfg.linkDist;
              ctx.lineWidth = (2 * cfg.r) * t;
              let c = Math.floor(255 * t);
              if (cfg.invertColor) c = 255 - c;
              ctx.strokeStyle = `rgb(${c},${c},${c})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      function updateParticles() {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x - cfg.r < 0) { p.x = cfg.r; p.vx = -p.vx; }
          else if (p.x + cfg.r > canvas.width) { p.x = canvas.width - cfg.r; p.vx = -p.vx; }
          if (p.y - cfg.r < 0) { p.y = cfg.r; p.vy = -p.vy; }
          else if (p.y + cfg.r > canvas.height) { p.y = canvas.height - cfg.r; p.vy = -p.vy; }
        }
      }

      function drawParticles() {
        const path = new Path2D();
        for (const p of particles) {
          path.moveTo(p.x + cfg.r, p.y);
          path.arc(p.x, p.y, cfg.r, 0, Math.PI * 2);
        }
        ctx.fillStyle = cfg.invertColor ? 'black' : 'white';
        ctx.fill(path);
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateParticles();
        linkParticles();
        drawParticles();
        requestAnimationFrame(animate);
      }
    });
  };
})(jQuery);