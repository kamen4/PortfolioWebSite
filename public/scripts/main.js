(function ($) {
  const $doc = $(document);
  const $html = $("html");
  const $name = $("#name");
  const $placeholder = $("#placeholder");
  const $themeToggle = $("#theme-toggle");
  const $particles = $("#particles");
  const STRINGS_URL = "data/pages.json";

  let isDarkTheme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  let particlesCancel = { token: false };

  function applyTheme(dark) {
    $html.css("color-scheme", dark ? "dark" : "light");
    updateParticles(dark);
    $themeToggle.prop("checked", dark);
  }

  function updateParticles(dark) {
    particlesCancel.token = true;
    particlesCancel = { token: false };
    $particles.particlesBg({ invertColor: !dark }, particlesCancel);
  }

  function initTheme() {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", (e) => applyTheme(e.matches));
    $themeToggle.on("change", () => applyTheme($themeToggle.is(":checked")));
    applyTheme(isDarkTheme);
  }

  function showPlaceholderAndBind() {
    $placeholder.fadeIn(200, function () {
      $doc.on("keydown.firstClick click.firstClick", revealContent);
    });
  }

  function hidePlaceholder() {
    $placeholder.fadeOut(200);
  }

  function revealContent() {
    $doc.off("keydown.firstClick click.firstClick");
    hidePlaceholder();
    $name.css({ margin: "10px auto", "font-size": "clamp(1rem, 3vw, 2rem)" });
    setTimeout(() => {
      $(".theme-toggle").css({ opacity: 1 });
      $("#nav-grid").show();
      $("#nav-grid")
        .find(".nav-block")
        .each(function (index, element) {
          setTimeout(function () {
            $(element).animate({ opacity: 1 }, 400);
          }, index * 150);
        });
    }, 500);
  }

  function loadStrings() {
    $.getJSON(STRINGS_URL)
      .done((json) => {
        console.info(json);
      })
      .fail((_, status, err) =>
        console.error("Strings load error:", status, err)
      );
  }

  $(function () {
    initTheme();
    $name.typewriter({
      speed: 80,
      startDelay: 300,
      callback: showPlaceholderAndBind,
    });
  });
})(jQuery);
