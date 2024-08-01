const socket = io();
const boardElement = document.getElementById('sudoku-board');

function createBoard(board) {
    boardElement.innerHTML = '';

    for (let subgridRow = 0; subgridRow < 4; subgridRow++) {
        for (let subgridCol = 0; subgridCol < 3; subgridCol++) {
            const subgridElement = document.createElement('div');
            subgridElement.className = 'subgrid';

            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 4; col++) {
                    const cellRow = subgridRow * 3 + row;
                    const cellCol = subgridCol * 4 + col;
                    const cellElement = document.createElement('div');
                    cellElement.className = 'cell';
                    cellElement.textContent = board[cellRow][cellCol] !== 0 ? board[cellRow][cellCol] : '';
                    cellElement.contentEditable = board[cellRow][cellCol] === 0;

                    cellElement.addEventListener('blur', () => {
                        const value = cellElement.textContent.trim();
                        if (value === '' || /^[1-9]$/.test(value)) {
                            socket.emit('cellUpdate', { row: cellRow, col: cellCol, value: parseInt(value, 10) || 0 });
                        } else {
                            cellElement.textContent = board[cellRow][cellCol]; // Setze den alten Wert zurück, falls der neue ungültig ist
                        }
                    });

                    subgridElement.appendChild(cellElement);
                }
            }

            boardElement.appendChild(subgridElement);
        }
    }
}

socket.on('updateBoard', createBoard);
socket.on('initialBoard', createBoard);

socket.on('connect', () => {
    console.log('Connected to the server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});