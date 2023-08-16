const input = document.querySelector("input");
const button = document.querySelector("button");
const API_KEY = "97170985aab34d44bcc63018231608";

button.addEventListener("click", async () => {
	const weather = await fetchWeather();
	console.log(weather.current.temp_c);
});

fetchWeather = async () => {
	try {
		const response = await fetch(
			`http://api.weatherapi.com/v1/current.json?q=${input.value}&key=${API_KEY}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (e) {
		input.value = `Could not get weather data: ${e}`;
	}
};

renderBoxes = () => {
	const temperatureDiv = document.createElement("div");
	const humidityDiv = document.createElement("div");
	const precipDiv = document.createElement("div");
	const windDiv = document.createElement("div");
};
