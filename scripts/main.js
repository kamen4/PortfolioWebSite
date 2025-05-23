$(function() {
    const CFG = {
        N: 300,
        R: 2,
        MAX_SPEED: 0.5,
        LINK_DIST: 100,
        INVERT_PARTICLE_COLOR: false,
        INVERT_LINE_COLOR: false
    };

    const $win    = $(window);
    const $canvas = $('#main');
    const canvas  = $canvas[0];
    const ctx     = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    CFG.N = Math.round($win.height() * $win.width() / (1920*1080/CFG.N));

    init();

    function init() {
        resizeCanvas();
        $win.on('resize', resizeCanvas);
        $win.on('mousemove', onMouseMove);
        particles = generateParticles(CFG.N);
        requestAnimationFrame(animate);
    }

    function resizeCanvas() {
        canvas.width  = $win.width();
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
                x:  rand(CFG.R, canvas.width  - CFG.R),
                y:  rand(CFG.R, canvas.height - CFG.R),
                vx: rand(-CFG.MAX_SPEED, CFG.MAX_SPEED),
                vy: rand(-CFG.MAX_SPEED, CFG.MAX_SPEED)
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
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.hypot(dx, dy);
                if (dist <= CFG.LINK_DIST) {
                    const t = 1 - dist / CFG.LINK_DIST;
                    ctx.lineWidth = (2 * CFG.R) * t;
                    let c = Math.floor(255 * t);
                    if (CFG.INVERT_LINE_COLOR) c = 255 - c;
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
        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x - CFG.R < 0) { p.x = CFG.R;  p.vx = -p.vx; }
            else if (p.x + CFG.R > canvas.width) { p.x = canvas.width - CFG.R;  p.vx = -p.vx; }
            if (p.y - CFG.R < 0) { p.y = CFG.R;  p.vy = -p.vy; }
            else if (p.y + CFG.R > canvas.height) { p.y = canvas.height - CFG.R; p.vy = -p.vy; }
        }
    }

    function drawParticles() {
        const path = new Path2D();
        for (let p of particles) {
            path.moveTo(p.x + CFG.R, p.y);
            path.arc(p.x, p.y, CFG.R, 0, Math.PI * 2);
        }
        ctx.fillStyle = CFG.INVERT_PARTICLE_COLOR ? 'black' : 'white';
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
