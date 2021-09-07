module.exports = {
	purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: "class", // or 'media' or 'class'
	theme: {
		container: {
			padding: "2rem",
			center: true,
		},
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('tailwindcss-rtl'),

	],
};
