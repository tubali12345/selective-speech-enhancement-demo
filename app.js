const displayNames = {
  AmbientNoise: "Ambient noise",
  ForegroundInterference: "Foreground interference",
  EarlyReflections: "Early reflections",
  LateReverberation: "Late reverberation",
  Coloration: "Coloration",
};

function degradationName(degradation) {
  return displayNames[degradation] || degradation;
}

function joinNames(degradations) {
  const names = degradations.map(degradationName);
  if (names.length < 2) return names[0] || "none";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

function makeAudio(source, label) {
  const audio = document.createElement("audio");
  audio.controls = true;
  audio.preload = "metadata";
  audio.setAttribute("aria-label", label);
  const file = document.createElement("source");
  file.src = source;
  file.type = "audio/wav";
  audio.append(file);
  audio.append("Your browser does not support WAV playback.");
  return audio;
}

function statePill(degradation, state) {
  const item = document.createElement("li");
  item.className = `state ${state}`;
  const name = document.createElement("span");
  name.textContent = degradationName(degradation);
  const label = document.createElement("span");
  label.className = "state-label";
  label.textContent = state;
  item.append(name, label);
  return item;
}

function renderScene(sceneData, sceneIndex) {
  const group = document.createElement("section");
  group.className = "scene-group";
  group.setAttribute("aria-labelledby", `scene-${sceneIndex + 1}-title`);

  const scene = document.createElement("div");
  scene.className = "scene";
  const left = document.createElement("div");
  const kicker = document.createElement("p");
  kicker.className = "section-kicker";
  kicker.textContent = "Held-out listening example";
  const heading = document.createElement("h2");
  heading.id = `scene-${sceneIndex + 1}-title`;
  heading.textContent = sceneData.title;
  const description = document.createElement("p");
  description.className = "scene-description";
  description.textContent = sceneData.description;
  const degradations = document.createElement("ul");
  degradations.className = "degradation-list";
  for (const degradation of sceneData.present) {
    const item = document.createElement("li");
    item.className = "degradation";
    item.textContent = degradationName(degradation);
    degradations.append(item);
  }
  left.append(kicker, heading, description, degradations);

  const player = document.createElement("div");
  player.className = "player-panel";
  const playerLabel = document.createElement("span");
  playerLabel.className = "player-label";
  playerLabel.textContent = "Listen to the degraded input";
  player.append(playerLabel, makeAudio(sceneData.input, `Degraded input: ${sceneData.title}`));

  const grid = document.createElement("div");
  grid.className = "scene-grid";
  grid.append(left, player);
  scene.append(grid);

  const comparisonHeading = document.createElement("div");
  comparisonHeading.className = "section-heading";
  const headingText = document.createElement("div");
  const comparisonKicker = document.createElement("p");
  comparisonKicker.className = "section-kicker";
  comparisonKicker.textContent = "Partial and full requests";
  const comparisonTitle = document.createElement("h2");
  comparisonTitle.textContent = "Listening comparisons";
  headingText.append(comparisonKicker, comparisonTitle);
  const count = document.createElement("p");
  count.className = "count";
  count.textContent = `${sceneData.requests.length} matched targets`;
  comparisonHeading.append(headingText, count);

  const examples = document.createElement("div");
  examples.className = "examples";
  sceneData.requests.forEach((example, index) => examples.append(renderExample(example, index)));
  group.append(scene, comparisonHeading, examples);
  return group;
}

function renderExample(example, index) {
  const card = document.createElement("article");
  card.className = "example-card";

  const header = document.createElement("div");
  header.className = "example-header";
  const number = document.createElement("span");
  number.className = "example-number";
  number.textContent = String(index + 1).padStart(2, "0");

  const headerText = document.createElement("div");
  const requestLabel = document.createElement("p");
  requestLabel.className = "request-label";
  requestLabel.textContent = example.full ? "Full-repair request" : "Partial-repair request";
  const title = document.createElement("h3");
  title.textContent = example.full
    ? "Remove all present degradations"
    : `Remove ${joinNames(example.remove)}`;
  const states = document.createElement("ul");
  states.className = "state-list";
  example.remove.forEach((degradation) => states.append(statePill(degradation, "removed")));
  example.retain.forEach((degradation) => states.append(statePill(degradation, "retained")));
  headerText.append(requestLabel, title, states);
  header.append(number, headerText);

  const comparison = document.createElement("div");
  comparison.className = "audio-comparison";

  const outputPanel = document.createElement("div");
  outputPanel.className = "comparison-player";
  const outputTitle = document.createElement("h3");
  outputTitle.textContent = "Selective model output";
  const outputDescription = document.createElement("p");
  outputDescription.textContent = example.full
    ? "The model is instructed to remove every present degradation."
    : `The model is instructed to remove ${joinNames(example.remove)}.`;
  outputPanel.append(
    outputTitle,
    outputDescription,
    makeAudio(example.output, `Selective output: remove ${joinNames(example.remove)}`),
  );

  const targetPanel = document.createElement("div");
  targetPanel.className = "comparison-player";
  const targetTitle = document.createElement("h3");
  targetTitle.textContent = example.full ? "Clean speech target" : "Exact partial target";
  const targetDescription = document.createElement("p");
  targetDescription.textContent = example.full
    ? "The corresponding clean utterance with all degradations omitted."
    : `The same utterance rendered with retained ${joinNames(example.retain)} only.`;
  targetPanel.append(
    targetTitle,
    targetDescription,
    makeAudio(
      example.target,
      example.full
        ? "Clean speech target"
        : `Exact partial target: retain ${joinNames(example.retain)}`,
    ),
  );

  comparison.append(outputPanel, targetPanel);
  card.append(header, comparison);
  return card;
}

async function initialize() {
  const response = await fetch("samples.json");
  if (!response.ok) throw new Error(`Could not load samples.json (${response.status})`);
  const data = await response.json();
  const scenes = document.querySelector("#scenes");
  data.scenes.forEach((scene, index) => scenes.append(renderScene(scene, index)));

  document.addEventListener("play", (event) => {
    if (!(event.target instanceof HTMLAudioElement)) return;
    document.querySelectorAll("audio").forEach((audio) => {
      if (audio !== event.target) audio.pause();
    });
  }, true);
}

initialize().catch((error) => {
  const scenes = document.querySelector("#scenes");
  scenes.innerHTML = `<p class="notice">The examples could not be loaded: ${error.message}</p>`;
});
