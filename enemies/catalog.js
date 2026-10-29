(() => {
  "use strict";

  const form = document.getElementById("enemy-filters");
  const search = document.getElementById("enemy-search");
  const island = document.getElementById("enemy-island");
  const location = document.getElementById("enemy-location");
  const element = document.getElementById("enemy-element");
  const count = document.getElementById("enemy-count");
  const empty = document.getElementById("enemy-empty");
  const normalize = (text) => text.normalize("NFKC").toLocaleLowerCase("ja");
  const cards = Array.from(document.querySelectorAll(".enemy-card"), (node) => ({
    node,
    search: normalize(node.dataset.search),
    islands: JSON.parse(node.dataset.islands),
    locations: JSON.parse(node.dataset.locations),
    elements: JSON.parse(node.dataset.elements),
  }));

  function filterEnemies() {
    for (const option of location.options) {
      const unavailable = Boolean(option.value && island.value && option.dataset.island !== island.value);
      option.hidden = unavailable;
      option.disabled = unavailable;
      if (unavailable && option.value === location.value) location.value = "";
    }
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      const matches = terms.every((term) => card.search.includes(term))
        && (!island.value || card.islands.includes(island.value))
        && (!location.value || card.locations.includes(location.value))
        && (!element.value || card.elements.includes(element.value));
      card.node.hidden = !matches;
      if (matches) visible += 1;
    }
    count.textContent = `${visible} / ${cards.length} ユニット`;
    empty.hidden = visible !== 0;
  }

  search.addEventListener("input", filterEnemies);
  for (const select of [island, location, element]) select.addEventListener("change", filterEnemies);
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("reset", (event) => {
    event.preventDefault();
    for (const field of [search, island, location, element]) field.value = "";
    filterEnemies();
  });
  filterEnemies();
})();
