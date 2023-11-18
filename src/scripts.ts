// import $ from 'jquery';
// import sum from './utils/sum/sum';

// console.log('Ready for coding');

// console.log('Body jQuery node:', $('body'));
// console.log('Body javascript node:', document.querySelector('body'));
// console.log('2 + 3 =', sum(2, 3));

const startGame = document.querySelector<HTMLDivElement>('.start-game'); //    Get game start menu
const memoryGame = document.querySelector<HTMLDivElement>('.memory-game');//    Get game-field
const endGame = document.querySelector<HTMLDivElement>('.end-game');//  Get end game screen
const startButton = document.querySelector<HTMLButtonElement>('.start-button');//   Get start button in start menu
const playAgainButton = document.querySelector<HTMLButtonElement>('.play-again-button');//    Get play again button
const moves = document.querySelector<HTMLParagraphElement>('.move-counter'); // movecounter html element
const gameTimer = document.querySelector<HTMLParagraphElement>('.game-timer'); // html for timer
const gameWinCount = document.querySelector<HTMLParagraphElement>('.win-counter');
const cardArray = Array.from(document.querySelectorAll<HTMLElement>('.card')) as HTMLElement[];//   Get all of the cards in an array
let matchCounter = 0;//   Initialize match counter variable
let moveCounter = 0;//    Initialize move counter variable
let timer: number; // timer variable
let gameTimeInSeconds = 0; // second counter
let currentSelectedCard = '';//    Initialize selected card variable
let winCount = 0; // initial game win count

// Image pair array, that assigns flipped card images to their respective cards

const cardImagePairs: { id: string; image: string }[] = [
  { id: '1', image: '/assets/images/LeonaCard.png' }, // data-card-id='1'
  { id: '2', image: '/assets/images/shacoCard.jpg' }, // data-card-id='2'
  { id: '3', image: '/assets/images/camilleCard.jpg' }, // data-card-id='3'
];

//    Function that randomizes the card order

const initializeGame = (array: HTMLElement[]): void => {
  // creates a new array where the array indexes are randomly shuffled
  const shuffledCardOrder = array.map((_, index) => index).sort(() => Math.random() - 0.5);
  // new shallow copy of original array
  const newArray = [...array];
  // css property order is given to newArray based on shuffled indexes of shuffledCardOrder
  shuffledCardOrder.forEach((index, shuffledIndex) => {
    newArray[index].style.order = shuffledIndex.toString();
  });
  //  clears the interval from previous game
  clearInterval(timer);
  // Start a new interval for the game timer
  timer = window.setInterval(() => {
    gameTimeInSeconds += 1;
    gameTimer.innerHTML = `Time elapsed: ${gameTimeInSeconds} seconds`;
  }, 1000);
};

//  function that displays the winning screen once the game is over, and updates win count

const displayWinner = () => {
  clearInterval(timer);
  endGame.style.display = 'flex';
  memoryGame.style.display = 'none';
  winCount += 1;
  gameWinCount.innerHTML = `Wins: ${winCount}`;
};

//  function that checks if a card has already been flipped/matched

const isClickable = (card: HTMLElement): boolean => !card.classList.contains('matched') && !card.classList.contains('flipped');

//  function that flips the cards

const flipCard = (card: HTMLElement) => {
//  constant that gets cardId property from dataset of card object
//  {cardid} curly braces are for acessing value of dataset.cardid
  const { dataset: { cardId }, classList, style } = card;
  // once click event happens card gets assigned with 'flipped' class
  classList.add('flipped');
  // once card is flipped it sets the image on the other side of the card
  // loops through cardImagePairs to find an id that matches id of a card
  style.backgroundImage = `url(${cardImagePairs.find((pair) => pair.id === cardId)?.image || ''})`;
};

// function with argument of the 2nd cards selected id
// it then loops through the array to see if there is a matching id
// if found adds 'matched'

const handleMatchingCards = (cardId: string) => {
  cardArray.forEach((card) => {
    if (card.dataset.cardId === cardId) {
      card.classList.add('matched');
    }
  });
  // when a match is found increments matchCounter, when that reaches 3 displays winning screen
  matchCounter += 1;
  if (matchCounter === 3) {
    displayWinner();
  }
};

// function that flips the cards back if a match has not been found
// if 'matched' has not been added after 2 cards have been flipped it starts timeout
// to flip the cards back after 0.5s and remove 'flipped'
const handleMismatchedCards = () => {
  setTimeout(() => {
    cardArray.forEach((card) => {
      if (!card.classList.contains('matched')) {
        const flipBack = card;
        card.classList.remove('flipped');
        flipBack.style.backgroundImage = '';
      }
    });
  }, 500);
};

// function responsible for card clicks

const handleCardClick = (card: HTMLElement) => {
  if (isClickable(card)) {
    flipCard(card);
    // statement that checks if one card is already selected or not,
    // if not assigns card id to currentSelectedCard
    // if one is already selected creates a constant for 2nd card to get its id
    // then if the ids of 2 cards are equal calls, handleMatchingCards()
    // or handleMismatchedCards()
    // in the end sets currentSelectedCard back to empty and increments moveCounter
    if (currentSelectedCard === '') {
      currentSelectedCard = card.dataset.cardId || '';
    } else {
      const secondSelectedCard = card.dataset.cardId || '';
      if (currentSelectedCard === secondSelectedCard) {
        handleMatchingCards(currentSelectedCard);
      } else {
        handleMismatchedCards();
      }
      currentSelectedCard = '';
      moveCounter += 1;
      moves.innerHTML = `Moves: ${moveCounter}`;
    }
  }
};

//  resetgame function that sets match, move, card counters back to initial value,
// removes card classes for matches and flips, shuffles the cards again with initializeGame function
// sets seconds back to 0 and updates text content

const resetGame = () => {
  cardArray.forEach((card: HTMLElement) => {
    const cardBack = card;
    card.classList.remove('flipped', 'matched');
    cardBack.style.backgroundImage = '';
  });
  initializeGame(cardArray);

  matchCounter = 0;
  currentSelectedCard = '';
  moveCounter = 0;
  moves.innerHTML = `Moves: ${moveCounter}`;
  gameTimeInSeconds = 0;
  gameTimer.innerHTML = `Time elapsed: ${gameTimeInSeconds} seconds`;
};

//    Event that switches from game start menu to game field and initializes the game

startButton.addEventListener('click', () => {
  startGame.style.display = 'none';
  memoryGame.style.display = 'flex';
  initializeGame(cardArray);
});

// Allows each card to be clicked

cardArray.forEach((card: HTMLElement) => {
  card.addEventListener('click', () => handleCardClick(card));
});

//  Play again button that changes screens and calls resetgame function

playAgainButton.addEventListener('click', () => {
  endGame.style.display = 'none';
  memoryGame.style.display = 'flex';
  resetGame();
});
