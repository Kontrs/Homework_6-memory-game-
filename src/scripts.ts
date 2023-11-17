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
const cardArray = Array.from(document.querySelectorAll<HTMLElement>('.card')) as HTMLElement[];//   Get all of the cards in an array
let matchCounter = 0;//   Initialize match counter variable
let moveCounter = 0;//    Initialize move counter variable
let currentSelectedCard = '';//    Initialize selected card variable

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
};

//  function that displays the winning screen once the game is over

const displayWinner = () => {
  endGame.style.display = 'flex';
  memoryGame.style.display = 'none';
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
// if 'matched' has not beed added after 2 cards have been flipped it starts timeout
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

const handleCardClick = (card: HTMLElement) => {
  if (isClickable(card)) {
    flipCard(card);
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
    }
  }
};

//  resetgame function that sets match, move, card counters back to initial value,
// removes card classes for matches and flips, shuffles the cards again with initializeGame function

const resetGame = () => {
  matchCounter = 0;
  moveCounter = 0;
  currentSelectedCard = '';

  cardArray.forEach((card) => {
    const cardBack = card;
    card.classList.remove('flipped', 'matched');
    cardBack.style.backgroundImage = '';
  });
  initializeGame(cardArray);
};

//    Event that switches from game start menu to game field and initializes the game

startButton.addEventListener('click', () => {
  startGame.style.display = 'none';
  memoryGame.style.display = 'flex';
  initializeGame(cardArray);
});

// Allows each card to be clicked

cardArray.forEach((card) => {
  card.addEventListener('click', () => handleCardClick(card));
});

//  Play again button that changes screens and calls resetgame function

playAgainButton.addEventListener('click', () => {
  endGame.style.display = 'none';
  memoryGame.style.display = 'flex';
  resetGame();
});
