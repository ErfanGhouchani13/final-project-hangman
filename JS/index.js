import { CanvasDrawer } from './CanvasDrawer.js';
import { HintManager } from './HintManager.js';

//Initial References
const letterContainer = document.querySelector("#letter-container");
const userInputSection = document.querySelector("#user-input");
const newGameContainer = document.querySelector("#new-game-container");
const newGameButton = document.querySelector("#new-game-button");
const canvas = document.querySelector("#canvas");
const resultText = document.querySelector("#result-text");
const generatedWord = document.querySelector("#generated-word");
const lives = document.querySelector("#lives");

const drawer = new CanvasDrawer(canvas);

const PATH = "./Audios/";

const loadAudio = (filename) => {
    const audio = new Audio(PATH + filename);
    audio.load();
    return audio;
};

const win = loadAudio("win.mp3");
const lost = loadAudio("lost.mp3");
const soundTrack = loadAudio("soundtrack.mp3");
const type = loadAudio("type.wav");

const ASCII_A = 65;
const ASCII_Z = 90;
const LIVES = 6;

// Initialize variables
let category;
let word;
let hint;
//count
let winCount = 0;
let count = 0;

// Global variable to store the HangmanWord object
let hangmanWord;

for (let i = 0; i < LIVES; i++) {
    let heart = document.createElement("img");
    heart.src = "imgs/heart.svg";
    lives.append(heart);
}

// HangmanWord class to store the word, category, and hint
class HangmanWord {
    constructor(word, category, hint) {
        this.word = word;
        this.category = category;
        this.hint = hint;
    }

    getWord() {
        return this.word;
    }

    getCategory() {
        return this.category;
    }

    getHint() {
        return this.hint;
    }
}


// Fetching Random Word
const fetchAndInitialize = () => {
    const uniqueUrl = `https://www.wordgamedb.com/api/v1/words/random?nocache=${new Date().getTime()}`;
    fetch(uniqueUrl)
        .then((response) => response.json())
        .then((data) => {
            hangmanWord = new HangmanWord(data.word, data.category, data.hint);
            initializer();
        })
        .catch((error) => {
            console.error('Error fetching the data:', error);
        });
};

//Block all the Buttons
const blocker = () => {
    let optionsButtons = document.querySelectorAll(".options");
    let letterButtons = document.querySelectorAll(".letters");

    //disable all options
    optionsButtons.forEach((button) => {
        button.disabled = true;
    });

    //disable all letters
    letterButtons.forEach((button) => {
        button.disabled.true;
    });

    newGameContainer.classList.remove("hide");
};

//Word Generator
const generateWord = () => {

    //initially hide letters, clear previous word
    userInputSection.innerText = "";

    //choose random word
    word = hangmanWord.getWord().toUpperCase();

    //replace every letter with span containing dash
    let displayItem = word.replace(/./g, '<span class="dashes">_</span>');

    //Display each element as span
    userInputSection.innerHTML = displayItem;
};

//Initial Function (Called when page loads/user presses new game)
const initializer = () => {

    winCount = 0;
    count = 0;

    // Display the word and hint
    let categoryH2 = document.createElement("h2");
    let hintH2 = document.createElement("h2");

    // Assuming hangmanWord is an object that provides the word and hint
    word = hangmanWord.getWord();
    hint = hangmanWord.getHint();
    category = hangmanWord.getCategory();

    categoryH2.innerText = `Category: ${category}`;
    hintH2.innerText = `Hint: ${hint}`;

    generatedWord.append(categoryH2);
    generatedWord.append(hintH2);

    // Initially erase all content and hide letters and new game button
    userInputSection.innerHTML = "";
    newGameContainer.classList.add("hide");
    letterContainer.innerHTML = "";

    // Generate word visualization (e.g., underscores or dashes)
    generateWord();

    let charArray = word.split("");
    let dashes = document.getElementsByClassName("dashes");

    const hintManager = new HintManager("hintButton", "hintPopup", word);

    // Unified input handler
    const handleInput = (inputValue) => {
        if (charArray.includes(inputValue)) {
            charArray.forEach((char, index) => {
                if (char === inputValue) {
                    dashes[index].innerText = char;
                    winCount += 1;
                    if (winCount === charArray.length) {
                        win.play();
                        resultText.innerHTML = `<h2 class='win-msg'>You Win!!</h2><p>The word was <span>${word}</span></p>`;
                        blocker();
                        categoryH2.remove();
                        hintH2.remove();
                    }
                }
            });
        } else {
            count += 1;
            drawMan(count);
            lives.children[count - 1].style.display = "none";
            if (count === LIVES) {
                lost.play();
                resultText.innerHTML = `<h2 class='lose-msg'>You Lose!!</h2><p>The word was <span>${word}</span></p>`;
                blocker();
                categoryH2.remove();
                hintH2.remove();
            }
        }
    };

    // For creating letter buttons and attaching keyboard listeners
    for (let i = ASCII_A; i < ASCII_Z; i++) {
        let button = document.createElement("button");
        button.classList.add("letters");
        let letter = String.fromCharCode(i);
        button.innerText = letter;
        button.id = `key-${letter}`;

        // Attach event listener for click
        button.addEventListener("click", () => {
            if (!button.disabled) {
                handleInput(button.innerText);
                button.disabled = true;
            }
        });
        letterContainer.append(button);
    }

    // Event listener for keyboard input
    document.addEventListener('keydown', (event) => {
        type.play();
        const key = event.key.toUpperCase();
        if (key >= 'A' && key <= 'Z') {
            const button = document.getElementById(`key-${key}`);
            if (button && !button.disabled) {
                handleInput(button.innerText);
                button.disabled = true;
            }
        }
    });

    // Draw the initial frame
    drawer.initialDrawing();

};

//draw the man
const drawMan = (count) => {
    switch (count) {
        case 1:
            drawer.drawHead();
            break;
        case 2:
            drawer.drawBody();
            break;
        case 3:
            drawer.drawLeftArm();
            break;
        case 4:
            drawer.drawRightArm();
            break;
        case 5:
            drawer.drawLeftLeg();
            break;
        case 6:
            drawer.drawRightLeg();
            break;
        default:
            break;
    }
};

fetchAndInitialize();

//New Game
newGameButton.addEventListener("click", fetchAndInitialize);
newGameButton.addEventListener("click", () => {
    location.reload();
});
