;(function($) {
  const defaults = {
    speed: 50,
    loop: false,
    callback: null,
    startDelay: 0
  };

  const parsers = {
    speed: v => parseInt(v, 10),
    loop: v => v === true || v === 'true',
    'start-delay': v => parseInt(v, 10)
  };
  const toCamel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  $.fn.typewriter = function(options = {}) {
    return this.each(function() {
      const $el = $(this);
      const cfg = { ...defaults, ...options };

      Object.entries(parsers).forEach(([key, fn]) => {
        const d = $el.data(key);
        if (d != null) {
          const val = fn(d);
          if (typeof val === 'boolean' || !isNaN(val)) {
            cfg[toCamel(key)] = val;
          }
        }
      });

      const text = $el.text();
      $el.empty();
      const $txt = $('<span>').appendTo($el);
      let pos = 0;

      const type = () => {
        if (pos < text.length) {
          $txt.append(text[pos++]);
          setTimeout(type, cfg.speed);
        } else {
          if (cfg.loop) {
            setTimeout(() => {
              pos = 0;
              $txt.empty();
              type();
            }, cfg.speed);
          }
          $el.html($el.text());
          if (typeof cfg.callback === 'function') {
            cfg.callback($el);
          }
        }
      };

      setTimeout(type, cfg.startDelay);
    });
  };
})(jQuery);
