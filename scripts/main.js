var isDarkTheme;

const prefersDarkColorScheme = () => window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
	isDarkTheme = prefersDarkColorScheme();
	initThemeToggle()
	setParticles();
});

const initThemeToggle = () => {
	var $toggle = $("#theme-toggle"); 
	isDarkTheme = prefersDarkColorScheme();
	$toggle.prop('checked', isDarkTheme);
	$toggle.change(() => {
		isDarkTheme = $toggle.is(':checked');
		$("html").css("color-scheme", isDarkTheme ? "dark" : "light")
		setParticles();
	});
};

const setParticles = () => $('#particles').particlesBg({ invertColor: !isDarkTheme });

initThemeToggle();
setParticles();