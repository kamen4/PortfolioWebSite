const prefersDarkColorScheme = () => window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
	setParticles();
});

const setParticles = () => $('#particles').particlesBg({ invertColor: !prefersDarkColorScheme() });

setParticles();