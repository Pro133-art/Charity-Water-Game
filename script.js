const pollutionBar = document.getElementById("pollutionBar");
const pollutionBarContainer = document.getElementById("pollutionBarContainer");
const waterReservoir = document.getElementById("waterReservoir");
const waterReservoirContainer = document.getElementById("waterReservoirContainer");
const timer = document.getElementById("timer");
const points = document.getElementById("points");
const shovelButton = document.getElementById("shovelButton");
const extractorButton = document.getElementById("extractorButton");
const holes = Array.from(document.querySelectorAll(".hole"));

const MAX_LEVEL = 100;
const MIN_LEVEL = 0;
const totalSeconds = 60;

const state = {
	pollution: 100,
	water: 100,
	points: 0,
	secondsRemaining: totalSeconds,
	selectedTool: "shovel",
	activeHoleIndex: 0,
	intervalId: null,
};

function clamp(value) {
	return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, value));
}

function setSelectedTool(tool) {
	state.selectedTool = tool;
	shovelButton.classList.toggle("active", tool === "shovel");
	extractorButton.classList.toggle("active", tool === "extractor");
}

function renderBars() {
	pollutionBar.style.width = `${state.pollution}%`;
	waterReservoir.style.height = `${state.water}%`;
	pollutionBarContainer.setAttribute("aria-valuenow", String(Math.round(state.pollution)));
	pollutionBarContainer.setAttribute("aria-valuetext", `${Math.round(state.pollution)} percent polluted`);
	waterReservoirContainer.setAttribute("aria-label", `Water reservoir ${Math.round(state.water)} percent full`);
}

function renderScoreboard() {
	const elapsed = totalSeconds - state.secondsRemaining;
	const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
	const seconds = String(elapsed % 60).padStart(2, "0");
	timer.textContent = `Timer: ${minutes}:${seconds}`;
	points.textContent = `Points: ${state.points}`;
}

function renderHoles() {
	holes.forEach((hole, index) => {
		hole.classList.remove("digging", "clean", "muggy");

		if (index === state.activeHoleIndex) {
			hole.classList.add(state.selectedTool === "shovel" ? "digging" : "clean");
			return;
		}

		if (index < state.activeHoleIndex) {
			hole.classList.add("clean");
			return;
		}

		hole.classList.add("muggy");
	});
}

function render() {
	renderBars();
	renderScoreboard();
	renderHoles();
}

function applyTool(tool) {
	setSelectedTool(tool);

	if (tool === "shovel") {
		state.pollution = clamp(state.pollution - 8);
		state.water = clamp(state.water - 4);
		state.points += 12;
	} else {
		state.pollution = clamp(state.pollution - 4);
		state.water = clamp(state.water - 9);
		state.points += 16;
	}

	state.activeHoleIndex = (state.activeHoleIndex + 1) % holes.length;
	render();
}

function tick() {
	if (state.secondsRemaining <= 0) {
		window.clearInterval(state.intervalId);
		state.intervalId = null;
		return;
	}

	state.secondsRemaining -= 1;
	state.pollution = clamp(state.pollution - 0.35);
	state.water = clamp(state.water - 0.45);
	render();
}

shovelButton.addEventListener("click", () => {
	applyTool("shovel");
});

extractorButton.addEventListener("click", () => {
	applyTool("extractor");
});

setSelectedTool(state.selectedTool);
render();
state.intervalId = window.setInterval(tick, 1000);
