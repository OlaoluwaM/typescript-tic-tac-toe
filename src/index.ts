import './style.css';

const appElement = document.getElementById('app');
const boardElement = document.getElementById('board');
const h1Element = document.querySelector('h1');
const initialH1Text = h1Element?.innerText ?? 'Tic Tac Toe!';
const ROW_COUNT = 3;
const COL_COUNT = 3;
const MAX_PLAY_COUNT = 9;

const initialBoardState: string[][] = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

let playCount = 0;
let boardState = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

type PossibleMoves = 'X' | 'O' | '';
let currentMove: PossibleMoves = 'X';

function declareDraw() {
  if (!h1Element) throw new Error('h1 element does not exist');
  h1Element.innerText = 'Draw!';
}

function declareWinner(winner: PossibleMoves) {
  if (!h1Element) throw new Error('h1 element does not exist');
  h1Element.innerText = `Winner is player ${winner}`;

  if (!boardElement) throw new Error('board element does not exist');
  boardElement.style.pointerEvents = 'none';
}

function resetH1Text() {
  if (!h1Element) throw new Error('h1 element does not exist');
  h1Element.innerText = initialH1Text;
}

function checkIfWinnerExists(
  row: number,
  col: number,
  moveAtCell: PossibleMoves
): PossibleMoves {
  const verticalCheck = boardState.reduce((movesArr, _, currRowIndex, arr) => {
    movesArr.push(arr[currRowIndex][col]);
    return movesArr;
  }, []);

  const horizontalCheck = boardState[row];

  const diagonalCheck1 = boardState.reduce((movesArr, _, currRowIndex, arr) => {
    const currColumn = currRowIndex;

    movesArr.push(arr[currRowIndex][currColumn]);
    return movesArr;
  }, []);

  const diagonalCheck2 = boardState.reduce((movesArr, _, currRowIndex, arr) => {
    const currColumn = Math.abs(currRowIndex - (arr.length - 1));
    movesArr.push(arr[currRowIndex][currColumn]);
    return movesArr;
  }, []);

  const hasWonInSomeWay = [
    verticalCheck,
    horizontalCheck,
    diagonalCheck1,
    diagonalCheck2,
  ].some(movesArr => movesArr.every(recordedMove => recordedMove === moveAtCell));

  return hasWonInSomeWay ? moveAtCell : '';
}

function setCurrentMove() {
  switch (currentMove) {
    case 'X':
      currentMove = 'O';
      break;
    case 'O':
      currentMove = 'X';
      break;
  }

  const moveElement = document.getElementById('move-element');
  if (!moveElement) throw new Error('No move element');
  moveElement.innerText = `Next Move: ${currentMove}`;
}

function createCell(row: number, col: number, content: string = '') {
  const cell = document.createElement('button');
  cell.setAttribute('data-row', row.toString());
  cell.setAttribute('data-col', col.toString());
  cell.setAttribute('data-content', content);
  cell.classList.add('cell');

  cell.addEventListener(
    'click',
    () => {
      playCount += 1;
      cell.setAttribute('data-content', currentMove);
      boardState[row][col] = currentMove;

      if (playCount === MAX_PLAY_COUNT) declareDraw();
      if (playCount > 4 && checkIfWinnerExists(row, col, currentMove)) {
        declareWinner(currentMove);
      }
      setCurrentMove();
    },
    { once: true }
  );

  return cell;
}

function renderBoard() {
  if (!appElement) throw new Error('Cannot find app');
  if (!boardElement) throw new Error('Cannot find board');
  boardElement.innerHTML = '';

  boardElement.style.pointerEvents = '';

  for (let i = 0; i < ROW_COUNT; i++) {
    for (let j = 0; j < COL_COUNT; j++) {
      boardElement.appendChild(createCell(i, j, initialBoardState[i][j]));
    }
  }

  const oldMoveElement = document.getElementById('move-element');

  if (oldMoveElement) oldMoveElement.remove();
  const moveElement = document.createElement('p');

  moveElement.id = 'move-element';
  moveElement.innerText = `Next Move: ${currentMove}`;
  moveElement.classList.add('current-move');

  appElement.insertBefore(moveElement, document.getElementById('reset'));
}

function init() {
  const resetButton = document.getElementById('reset');
  if (!resetButton) throw new Error('No Reset button');

  resetButton.addEventListener('click', () => {
    boardState = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    currentMove = 'X';
    renderBoard();
    playCount = 0;
    resetH1Text();
  });

  renderBoard();
}

init();
