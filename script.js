(function () {
  const deck = window.DECK_DATA;

  if (!deck || !Array.isArray(deck.cards) || deck.cards.length === 0) {
    document.body.innerHTML = "<p style='padding:24px;font-family:sans-serif'>Kart verisi bulunamadı.</p>";
    return;
  }

  const state = {
    index: 0,
    flipped: false,
  };

  const els = {
    cardWrap: document.getElementById("card-wrap"),
    frontTitle: document.getElementById("front-title"),
    backTitle: document.getElementById("back-title"),
    image: document.getElementById("card-image"),
    text: document.getElementById("card-text"),
    progressValue: document.getElementById("progress-value"),
    prevButton: document.getElementById("prev-button"),
    nextButton: document.getElementById("next-button"),
    prevBottomButton: document.getElementById("prev-bottom-button"),
    nextBottomButton: document.getElementById("next-bottom-button"),
    flipButton: document.getElementById("flip-button"),
  };

  function imageSrc(filename) {
    return `./assets/images/${filename}`;
  }

  function render() {
    const card = deck.cards[state.index];
    els.frontTitle.textContent = card.title;
    els.backTitle.textContent = card.title;
    els.image.src = imageSrc(card.image);
    els.image.alt = card.title;
    els.progressValue.textContent = `${state.index + 1} / ${deck.cards.length}`;
    els.text.innerHTML = card.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");

    els.cardWrap.classList.toggle("is-flipped", state.flipped);
    els.cardWrap.setAttribute("aria-label", state.flipped ? "Kartın arka yüzü" : "Kartın ön yüzü");

    const atStart = state.index === 0;
    const atEnd = state.index === deck.cards.length - 1;
    els.prevButton.disabled = atStart;
    els.prevBottomButton.disabled = atStart;
    els.nextButton.disabled = atEnd;
    els.nextBottomButton.disabled = atEnd;
    els.flipButton.textContent = state.flipped ? "Ön Yüz" : "Çevir";
  }

  function flipCard() {
    state.flipped = !state.flipped;
    render();
  }

  function go(delta) {
    const nextIndex = state.index + delta;
    if (nextIndex < 0 || nextIndex >= deck.cards.length) {
      return;
    }
    state.index = nextIndex;
    state.flipped = false;
    render();
  }

  function bindButton(button, handler) {
    button.addEventListener("click", handler);
  }

  bindButton(els.prevButton, () => go(-1));
  bindButton(els.nextButton, () => go(1));
  bindButton(els.prevBottomButton, () => go(-1));
  bindButton(els.nextBottomButton, () => go(1));
  bindButton(els.flipButton, flipCard);
  els.cardWrap.addEventListener("click", flipCard);

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      go(1);
    } else if (event.key === "ArrowLeft") {
      go(-1);
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      flipCard();
    }
  });

  render();
})();
