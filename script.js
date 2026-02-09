//////// GAME SETUP & ANSWERS
const GAMES = [
  [
    {
      words: new Set(["BARK", "LEAF", "ROOT", "STEM"]),
      level: 1,
      answer: "PARTS OF A TREE",
    },
    {
      words: new Set(["TRUNK", "BOOT", "HOOD", "GRILL"]),
      level: 2,
      answer: "CAR EXTERIOR COMPONENTS",
    },
    {
      words: new Set(["BRANCH", "CLUB", "SECT", "WING"]),
      level: 3,
      answer: "ORGANIZATIONAL SUBDIVISIONS",
    },
    {
      words: new Set(["NEW", "WAX", "WANE", "FULL"]),
      level: 4,
      answer: "PHASES OF THE MOON",
    },
  ],
  [
    {
      words: new Set(["GUM", "MOCHI", "JERKY", "BOBA"]),
      level: 1,
      answer: "CHEWY FOODS",
    },
    {
      words: new Set(["TOILET", "CHEEKS", "CARDS", "LYMPH"]),
      level: 2,
      answer: "THINGS THAT FLUSH",
    },
    {
      words: new Set(["FINGER", "DAMN", "HOOT", "AWARD"]),
      level: 3,
      answer: "THINGS YOU CAN GIVE",
    },
    {
      words: new Set(["DIGIT", "TROUBLE", "CHIN", "BED"]),
      level: 4,
      answer: "DOUBLE _ _ _ _",
    },
  ],
  [
    {
      words: new Set(["COWBOY", "CRYING", "POOP", "MONKEY"]),
      level: 1,
      answer: "TYPES OF EMOJIS",
    },
    {
      words: new Set(["HIV", "HELPERS", "FIRST", "HEARING"]),
      level: 2,
      answer: "RELATED TO AIDS / AIDES",
    },
    {
      words: new Set(["MOIST", "HOT", "EXCITED", "AROUSED"]),
      level: 3,
      answer: "CHEERY WHEN SHE SEES DUSTIN",
    },
    {
      words: new Set(["TOGA", "PIRATES", "LAGRET", "CUNNING"]),
      level: 4,
      answer: "EXERCISES WITH ONE LETTER CHANGED",
    },
  ],
  [
    {
      words: new Set(["PORRIDGE", "CENDOL", "ROJAK", "RAW OYSTERS"]),
      level: 1,
      answer: "DISGUSTING FOODS",
    },
    {
      words: new Set(["OPERA", "LOCH NESS", "MISSILE", "GHOST"]),
      level: 2,
      answer: "DESCRIBABLE WITH 'OOOOOOO'",
    },
    {
      words: new Set(["BOJACK", "BLOWJOB", "BOOST JUICE", "BLACK JACK"]),
      level: 3,
      answer: "ACRONYM IS 'BJ'",
    },
    {
      words: new Set(["COLOR", "REALIZE", "CENTER", "FLAVOR"]),
      level: 4,
      answer: "AMERICAN SPELLING",
    },
  ],
  [
    {
      words: new Set(["HAPPY", "VALENTINES", "DAY", "HAHA"]),
      level: 1,
      answer: "(1) SECOND LETTER IS 'A'",
    },
    {
      words: new Set(["HOP", "YOU", "ENJOYED", "LOL"]),
      level: 2,
      answer: "(2) 'O' IN THE WORD'S CENTRE",
    },
    {
      words: new Set(["SEE", "YOO", "REEL", "SOON"]),
      level: 3,
      answer: "(3) DOUBLED VOWELS",
    },
    {
      words: new Set(["LOVE", "YOUR", "BOYFIE", "DUSTIN"]),
      level: 4,
      answer: "(4) IF YOU REPLACE ALL LETTERS WITH 'A', YOU GET SCREAMING",
    },
  ],
];

//////// Get elements
const boards = document.getElementById("boards");
const gameBoard = document.getElementById("game-board");
const answerBoard = document.getElementById("answer-board");
const deselectAllButton = document.getElementById("deselect");
const shuffleButton = document.getElementById("shuffle");
const submitButton = document.getElementById("submit");
const mistakesRemainingContainer =
  document.getElementById("mistakes-remaining");
const nextGameContainer = document.getElementById("next-game-container");
const nextGameButton = document.getElementById("success-button");

//////// Initialise game state
let CURRENT_GAME_IDX = 0;
let SELECTED_TILES = new Set([]);

let CORRECT_ANSWERS = 0;
let MISTAKES_REMAINING = 4;

let CONGRATS_CONFETTI_MULT = 1;

//////// Helper functions
// Onclick handler that selects game tiles and changes element styling
function selectGameTile(element) {
  const tileWord = element.innerText;
  let tileAction = 0;

  if (SELECTED_TILES.has(tileWord)) {
    SELECTED_TILES.delete(tileWord);
    tileAction = -1;
  } else if (!SELECTED_TILES.has(tileWord) && SELECTED_TILES.size < 4) {
    SELECTED_TILES.add(tileWord);
    tileAction = 1;
  }

  if (tileAction === 1) {
    element.classList.add("selected");
  } else if (tileAction === -1) {
    element.classList.remove("selected");
  }
}

// Handler to deselect all selected tiles, including styling
function deselectAll() {
  SELECTED_TILES.clear();
  const selectedTileElements = document.querySelectorAll(".game-tile.selected");
  for (tile of selectedTileElements) {
    tile.classList.remove("selected");
  }
}

// Function to shuffle the board. Called on game start, and whenever shuffle is clicked.
function shuffleBoard() {
  // 1. Get all current tile elements from the board
  const tiles = Array.from(gameBoard.children);

  // 2. Fisher-Yates Shuffle Algorithm
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // 3. Re-append them to the board
  // Since they already exist in the DOM, appendChild simply moves them
  tiles.forEach((tile) => gameBoard.appendChild(tile));
}

// Function to submit and check answers
function submitAnswer() {
  if (SELECTED_TILES.size !== 4) {
    return;
  }

  const diffs = GAMES[CURRENT_GAME_IDX].map((c) => {
    return {
      ...c,
      diff: c.words.difference(SELECTED_TILES).size,
    };
  });

  const solved = diffs.filter((_) => _.diff === 0);
  // CORRECT
  if (solved.length > 0) {
    const solvedTiles = document.querySelectorAll(".game-tile.selected");
    const referenceTileHeight = solvedTiles[0].offsetHeight;
    SELECTED_TILES.clear();
    for (tile of solvedTiles) {
      tile.remove();
    }

    const answerContainer = document.createElement("div");
    answerContainer.setAttribute(
      "class",
      `answer-container level-${solved[0].level}`,
    );
    answerContainer.style.height = `${referenceTileHeight}px`;

    const answerCategory = document.createElement("div");
    answerCategory.setAttribute("class", "answer-category");
    const answerWords = document.createElement("div");
    answerCategory.innerHTML = solved[0].answer;
    answerWords.innerHTML = Array.from(solved[0].words).join(", ");

    answerContainer.appendChild(answerCategory);
    answerContainer.appendChild(answerWords);
    answerBoard.appendChild(answerContainer);

    const newAnswerPosition = answerContainer.getBoundingClientRect();
    const confettiX = newAnswerPosition.left + newAnswerPosition.width / 2;
    const confettiY = newAnswerPosition.top + newAnswerPosition.height / 2;
    confetti({
      position: { x: confettiX, y: confettiY }, // Origin position
      count: 100, // Number of particles
      size: 1, // Size of the particles
      velocity: 100, // Initial particle velocity
      fade: true, // Particles fall off the screen, or fade out
    });

    CORRECT_ANSWERS += 1;
    if (CORRECT_ANSWERS === 4) {
      nextGameContainer.classList.remove("hide");
      CURRENT_GAME_IDX += 1;
    }
    return;
  }

  // INCORRECT (with hint if guess is one away)
  // Quick animation
  submitButton.classList.add("error");
  setTimeout(() => {
    submitButton.classList.remove("error");
  }, 150);

  // If one away, show a notification!
  const oneAway = diffs.filter((_) => _.diff === 1);
  if (oneAway.length > 0) {
    Toastify({
      text: "One away...",
      duration: 1500,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      style: {
        background: "black",
      },
    }).showToast();
  }

  MISTAKES_REMAINING -= 1;
  const mistakeCounters = document.querySelectorAll(".mistake-counter");
  if (mistakeCounters.length > 1) {
    mistakeCounters[mistakeCounters.length - 1].remove();
  } else {
    mistakesRemainingContainer.innerText = `bruh${".".repeat(Math.abs(MISTAKES_REMAINING))}`;
  }
}

// Function to create a confetti interval
function confettiSpawner(confettiX, confettiY, interval) {
  setInterval(() => {
    const jitterX = confettiX + (Math.random() - 0.5) * confettiX;
    const jitterY = confettiY + (0.5 - Math.random() * confettiY);

    confetti({
      position: { x: jitterX, y: jitterY }, // Origin position
      count: 100 * CONGRATS_CONFETTI_MULT, // Number of particles
      size: Math.random() * 5, // Size of the particles
      velocity: 100 + Math.random() * 500, // Initial particle velocity
      fade: true, // Particles fall off the screen, or fade out
    });

    CONGRATS_CONFETTI_MULT += 0.25;
  }, interval);
}

// Function to rebuid the game with a given category set
function setGame(gameCategories) {
  // Reset everything, just in case:
  SELECTED_TILES = new Set([]);
  MISTAKES_REMAINING = 4;
  CORRECT_ANSWERS = 0;
  gameBoard.innerHTML = "";
  answerBoard.innerHTML = "";
  mistakesRemainingContainer.innerHTML = "";
  nextGameButton.innerHTML = "";

  // If there are no more games, then we show endgame state.
  if (!gameCategories) {
    const body = document.querySelector("body");
    body.style.backgroundColor = "#FFB6E7";
    const congratsText = document.createElement("div");
    congratsText.classList.add("congrats-text");
    const congratsImage = document.createElement("img");
    congratsImage.classList.add("congrats-image");

    congratsImage.setAttribute("src", "hvd.gif");
    congratsText.innerHTML = `
      Congratulations, you have solved my Valentine's day puzzle! You may redeem your prize from the game master~
      <br />
      <br />
      Until then, this page will generate more and more confetti until it crashes.
      <br />
      <br />
      I love you 😘
      `;

    body.innerHTML = "";
    body.appendChild(congratsImage);
    body.appendChild(congratsText);

    const congratsImagePosition = congratsImage.getBoundingClientRect();
    const confettiX =
      congratsImagePosition.left + congratsImagePosition.width / 2;
    const confettiY =
      congratsImagePosition.top + congratsImagePosition.height / 2;

    setInterval(() => {
      confettiSpawner(confettiX, confettiY, 1000 + Math.random() * 2000);
    }, 2000);
    return;
  }

  // Set up next game button
  const text = "NEXT LEVEL >>>";
  text.split("").forEach((letter, index) => {
    const l = document.createElement("span");
    l.innerText = letter === " " ? "\u00A0" : letter; // Handle spaces
    l.style.setProperty("--i", index); // For animation offset
    nextGameButton.appendChild(l);
  });
  nextGameButton.addEventListener("click", () =>
    setGame(GAMES[CURRENT_GAME_IDX]),
  );
  nextGameContainer.classList.add("hide");

  // deduce all words from categories arg
  const allWords = gameCategories.reduce(
    (acc, cur) => acc.union(cur.words),
    new Set([]),
  );

  // Populate board with word tiles
  for (const word of allWords) {
    const wordTile = document.createElement("div");
    wordTile.innerText = word;
    wordTile.setAttribute("class", "game-tile");
    wordTile.addEventListener("click", () => selectGameTile(wordTile));
    gameBoard.appendChild(wordTile);
    shuffleBoard();
  }

  // Populate Mistakes Remaining
  for (let i = 0; i < MISTAKES_REMAINING; i++) {
    const mistakeCounter = document.createElement("div");
    mistakeCounter.innerText = "o";
    mistakeCounter.setAttribute("class", "mistake-counter");
    mistakesRemainingContainer.appendChild(mistakeCounter);
  }

  const currentWidth = boards.offsetWidth; // Gets the width in pixels
  boards.style.width = `${currentWidth}px`;
}

//////// Init first game
setGame(GAMES[CURRENT_GAME_IDX]);

//////// Add other event listeners
deselectAllButton.addEventListener("click", () => deselectAll());
shuffleButton.addEventListener("click", () => shuffleBoard());
submitButton.addEventListener("click", () => submitAnswer());
