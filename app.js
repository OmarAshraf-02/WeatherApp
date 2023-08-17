const input = document.querySelector("input");
const button = document.querySelector("button");
const container = document.querySelector(".container");
const search = document.querySelector(".search");
const results = document.querySelector(".results");
const boxes = document.querySelector(".Box");
const API_KEY = "97170985aab34d44bcc63018231608";
let isError = false;
let spanText = "";

const tempImg = document.createElement("img");
const humidImg = document.createElement("img");
const precImg = document.createElement("img");
const windImg = document.createElement("img");
const imgArray = [tempImg, humidImg, precImg, windImg];

input.value = "";

imgArray.forEach((img) => {
	img.className = "boxImg";
});

tempImg.src = "./images/thermometer.png";
humidImg.src = "./images/humidity.png";
precImg.src = "./images/raining.png";
windImg.src = "./images/wind.png";

button.addEventListener("click", async () => {
	if (input.value) {
		isError = false; // Reset the flag before making a new request
		const weather = await fetchWeather();
		console.log(weather);
		if (results.hasChildNodes()) {
			deleteBoxes();
		}
		input.style.border = "";
		if (!isError) {
			renderBoxes(); // Only render boxes if there's no error
		}
		setSpans(weather);
		setLocation(weather);
	} else {
		input.style.border = "1px solid red";
		input.style.borderBottom = "2px solid red";
		input.style.borderRight = "2px solid red";
		if (results.hasChildNodes()) {
			deleteBoxes();
		}
	}
});

input.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		button.click();
	}
});

fetchWeather = async () => {
	try {
		const response = await fetch(
			`https://api.weatherapi.com/v1/current.json?q=${input.value.trim()}&key=${API_KEY}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (e) {
		isError = true;
		input.value = `Could not get weather data for this location`;
		setTimeout(() => {
			input.value = "";
			if (results.hasChildNodes()) {
				deleteBoxes();
			}
		}, 1500);
	}
};

renderBoxes = () => {
	const temperatureDiv = document.createElement("div");
	const humidityDiv = document.createElement("div");
	const precipDiv = document.createElement("div");
	const windDiv = document.createElement("div");
	const divArray = [temperatureDiv, humidityDiv, precipDiv, windDiv];

	divArray.forEach((div) => {
		div.className = "Box";
	});

	temperatureDiv.id = "tempBox";
	humidityDiv.id = "humidBox";
	precipDiv.id = "precipBox";
	windDiv.id = "windBox";

	const tempSpan = document.createElement("span");
	const humiditySpan = document.createElement("span");
	const precSpan = document.createElement("span");
	const windSpan = document.createElement("span");
	const spanArray = [tempSpan, humiditySpan, precSpan, windSpan];

	spanArray.forEach((span) => {
		span.className = "resultText";
	});

	tempSpan.id = "tempSpan";
	humiditySpan.id = "humiditySpan";
	precSpan.id = "precSpan";
	windSpan.id = "windSpan";

	temperatureDiv.appendChild(tempImg);
	temperatureDiv.appendChild(tempSpan);
	humidityDiv.appendChild(humidImg);
	humidityDiv.appendChild(humiditySpan);
	precipDiv.appendChild(precImg);
	precipDiv.appendChild(precSpan);
	windDiv.appendChild(windImg);
	windDiv.appendChild(windSpan);

	divArray.forEach((div) => {
		results.appendChild(div);
		setTimeout(() => {
			div.style.opacity = "1";
		}, 100);
	});
};

deleteBoxes = () => {
	while (results.firstChild) {
		results.removeChild(results.firstChild);
	}
	const deletedH3 = document.querySelector("h3");
	container.removeChild(deletedH3);
};

setSpans = (weather) => {
	const spans = document.querySelectorAll("span");

	spans.forEach((span) => {
		switch (span.id) {
			case "tempSpan":
				spanText = `${weather.current.temp_c}°C\n
                ${weather.current.temp_f}°F\n
                Temperature`;
				break;
			case "humiditySpan":
				spanText = `${weather.current.humidity}%\n\n\n
                Humidity`;
				break;
			case "precSpan":
				spanText = `${weather.current.precip_mm}mm\n
                ${weather.current.precip_in}"\n
                Precipitation`;
				break;
			case "windSpan":
				spanText = `${weather.current.wind_kph}km/h\n
                ${weather.current.wind_mph}mph\n
                Winds`;
				break;
			default:
		}
		span.innerText = spanText;
	});
};

setLocation = (weather) => {
	if (weather) {
		const h3 = document.createElement("h3");
		h3.className = "location";

		const region = weather.location.name;
		const country = weather.location.country;

		h3.innerText = `Weather in ${region}, ${country}`;
		search.insertAdjacentElement("afterend", h3);
	}
};
