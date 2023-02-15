import { wordArray } from "./modules/wordArray.js";

////////////////////////////////////////////////////////
//----------------DOM ELEMENT SELECTORS----------------

const rulesOpenBtn = document.getElementById("openRules");
const rulesPage = document.querySelector(".rules");
const rulesCloseBtb = document.getElementById("closeRules");
const rulesOpenBtnGame = document.querySelector(".icon__rules--lg");

const gameOpenBtn = document.getElementById("playNow");
const gamePage = document.querySelector(".game");

const submitGuessBtn = document.getElementById("submitGuess");
const newGameBtn = document.getElementById("playAgain");
const guessInput = document.querySelector(".game__input");

//const allLetters = document.querySelectorAll(".letter");
const lettersBack = document.querySelectorAll(".letter__back");
const lettersFront = document.querySelectorAll(".letter__front");
const allAlphabetLetters = document.querySelectorAll(".alphabet-letter");
const answerFronts = document.querySelectorAll(".answer-front");
const answerBacks = document.querySelectorAll(".answer-back");

const winPopups = document.querySelectorAll(".popup__win");
const winPopupsSm = document.querySelector(".popup__win--sm");
const losePopups = document.querySelectorAll(".popup__lose");
const losePopupsSm = document.querySelector(".popup__lose--sm");

////////////////////////////////////////////////////////
//--------------------- CLASS APP--------------------

class App {
  constructor() {
    //----------------- CLASS CONSTRUCTOR PROPERTIES ------------------

    this.guess = "";
    this.counter = 1;
    this.rowNumber = 1;
    this.playing = true;
    this.word = "";
    this.setWord = this.generateWord();

    //-------------- CLASS CONSTRUCTOR EVENT HANDLERS ---------------

    gameOpenBtn.addEventListener("click", function (e) {
      e.preventDefault();
      gamePage.classList.add("game--active");
    });

    rulesOpenBtn.addEventListener("click", function () {
      rulesPage.classList.add("rules--active");
    });

    rulesOpenBtnGame.addEventListener("click", function () {
      rulesPage.classList.add("rules--active");
    });

    rulesCloseBtb.addEventListener("click", function () {
      rulesPage.classList.remove("rules--active");
    });

    document.addEventListener("keydown", this.submitGuess.bind(this));

    submitGuessBtn.addEventListener("click", this.submitGuess.bind(this));

    newGameBtn.addEventListener("click", this.init.bind(this));
  }

  //----------------- USER INTERFACE ------------------

  //----------------- GETTERS AND SETTERS ------------------

  get setWord() {
    return this.word;
  }
  set setWord(word) {
    this.word = [...word.toUpperCase()];
  }

  get setGuess() {
    return this.guess;
  }
  set setGuess(guess) {
    this.guess = [...guess.toUpperCase()];
  }

  get setPlaying() {
    return this.playing;
  }
  set setPlaying(state) {
    this.playing = state;
  }

  get setCounter() {
    return this.counter;
  }
  set setCounter(counter) {
    this.counter = counter;
  }

  get setRow() {
    return this.rowNumber;
  }
  set setRow(row) {
    this.rowNumber = row;
  }

  //----------------- SELECT WORD FROM ARRAY METHOD ------------------

  generateWord() {
    const randoNumber = Math.trunc(Math.random() * wordArray.length + 1);
    return wordArray[randoNumber];
  }

  //----------------- INITIAL STATE METHOD   ------------------

  init() {
    this.setWord = this.generateWord();
    guessInput.removeAttribute("disabled");
    guessInput.value = "";
    this.setPlaying = true;
    this.setRow = 1;
    this.setCounter = 1;
    this.clearGuesses();
    this.clearAnswerRow();
    this.clearCheckedLetters();
    this.popUpsLoseDisappear();
    this.popUpsWinDisappear();
    guessInput.removeAttribute("disabled", "");
    guessInput.focus();
  }

  //----------------- SUBMIT A GUESS METHOD ------------------

  submitGuess(e) {
    if (e.key === "Enter" || e.target === submitGuessBtn) {
      if (this.playing) {
        if (guessInput.value.trim().length !== 5) {
          return alert("Your guess must be five letters long.");
        }

        this.setGuess = guessInput.value;

        if (this.guess.join("") == this.word.join("") && this.counter < 7) {
          this.printGuess(this.rowNumber, this.guess, this.word);
          this.revealAnswer(this.word);
          this.checkUsedLetters(this.word, this.guess);
          this.popUpsWinAppear();
          this.setPlaying = false;
          guessInput.setAttribute("disabled", "");
        }
        if (this.guess.join("") !== this.word.join("") && this.counter === 6) {
          this.printGuess(this.rowNumber, this.guess, this.word);
          this.revealAnswer(this.word);
          this.checkUsedLetters(this.word, this.guess);
          this.popUpsLoseAppear();
          this.setPlaying = false;
          guessInput.setAttribute("disabled", "");
        } else {
          this.printGuess(this.rowNumber, this.guess, this.word);
          this.checkUsedLetters(this.word, this.guess);
          this.setCounter = this.counter + 1;
          this.setRow = this.rowNumber + 1;
          guessInput.value = "";
        }
      }
    }
  }

  //----------------- DISPLAY A GUESS METHOD ------------------

  printGuess(rowNum, guess, word) {
    const letterFronts = document.querySelectorAll(`.row-${rowNum}-front`);
    const letterBacks = document.querySelectorAll(`.row-${rowNum}-back`);
    const [...guessCopy] = guess.slice();
    const [...wordCopy] = word.slice();

    letterFronts.forEach((letter, i) => {
      letter.classList.add("front--rotate");
    });

    /*
  

    letterBacks.forEach((letter, i) => {
      if (wordCopy.includes(guess[i])) {
        console.log(guessCopy, wordCopy);
        letter.classList.add("letter--included");
        guessCopy.splice(i, 1, "");
        console.log(guessCopy, wordCopy);
        if (wordCopy.indexOf(guess[i]) !== -1) {
          console.log(guessCopy, wordCopy);
          wordCopy.splice(wordCopy.indexOf(guess[i]), 1, "");
          console.log(guessCopy, wordCopy);
        }
      }
    });


*/

    letterBacks.forEach((letter, i) => {
      letter.classList.add("back--rotate");
      letter.textContent = guess[i];

      if (word[i] == guess[i]) {
        letter.classList.add("letter--correct");
        guessCopy.splice(i, 1, "");
        wordCopy.splice(i, 1, "");
      }
    });

    letterBacks.forEach((letter, i) => {
      if (wordCopy.includes(guessCopy[i])) {
        wordCopy.splice(wordCopy.indexOf(guessCopy[i]), 1, "");
        guessCopy.splice(i, 1, "");
        letter.classList.add("letter--included");
      }
    });

    letterBacks.forEach((letter, i) => {
      if (!wordCopy.includes(guessCopy[i])) {
        letter.classList.add("letter--incorrect");
      }
    });
  }

  //----------------- CLEAR GUESSES METHOD ------------------

  clearGuesses() {
    lettersBack.forEach((letter, i) => {
      letter.classList.remove("back--rotate");
      letter.classList.remove("letter--included");
      letter.classList.remove("letter--correct");
      letter.classList.remove("letter--incorrect");
      letter.textContent = "";
    });

    lettersFront.forEach((letter, i) => {
      letter.classList.remove("front--rotate");
      letter.textContent = "";
    });
  }

  //----------------- CHECK USED LETTERS METHOD   ------------------

  checkUsedLetters(word, guess) {
    guess.forEach((letter, i) => {
      if (!word.includes(letter)) {
        document
          .querySelector(`.alphabet-letter[data-letter="${letter}"]`)
          .classList.add("alphabet-incorrect");
      }
      if (word.includes(letter) && word[i] != letter) {
        document
          .querySelector(`.alphabet-letter[data-letter="${letter}"]`)
          .classList.add("alphabet-included");
      }
      if (word[i] == letter) {
        document
          .querySelector(`.alphabet-letter[data-letter="${letter}"]`)
          .classList.add("alphabet-correct");
      }
    });
  }

  //----------------- CLEAR USED LETTERS METHOD  ------------------

  clearCheckedLetters() {
    allAlphabetLetters.forEach((letter) => {
      letter.classList.remove("alphabet-incorrect");
      letter.classList.remove("alphabet-included");
      letter.classList.remove("alphabet-correct");
    });
  }

  //----------------- POPUP METHODS ------------------

  popUpsLoseAppear() {
    losePopups.forEach((popup) => {
      popup.classList.add("popup-visible");
    });

    losePopupsSm.classList.add("popup-sm-visible");
  }

  popUpsLoseDisappear() {
    losePopups.forEach((popup) => {
      popup.classList.remove("popup-visible");
    });

    losePopupsSm.classList.remove("popup-sm-visible");
  }

  popUpsWinAppear() {
    winPopups.forEach((popup) => {
      popup.classList.add("popup-visible");
    });

    winPopupsSm.classList.add("popup-sm-visible");
  }

  popUpsWinDisappear() {
    winPopups.forEach((popup) => {
      popup.classList.remove("popup-visible");
    });

    winPopupsSm.classList.remove("popup-sm-visible");
  }

  //----------------- REVEAL AND CLEAR ANSWER METHODS ------------------

  revealAnswer(word) {
    answerBacks.forEach((cell, i) => {
      cell.textContent = word[i];
      cell.classList.add("answer-back--rotate");
    });

    answerFronts.forEach((cell, i) => {
      cell.classList.add("answer-front--rotate");
    });
  }

  clearAnswerRow() {
    answerBacks.forEach((cell, i) => {
      cell.textContent = "";
      cell.classList.remove("answer-back--rotate");
    });

    answerFronts.forEach((cell, i) => {
      cell.classList.remove("answer-front--rotate");
    });
  }
}

const app = new App();
