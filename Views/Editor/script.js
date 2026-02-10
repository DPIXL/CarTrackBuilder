'use strict';

const TYPE_CLASSES = ['grass', 'road', 'water'];

let cellist = [];

// 2. Populate the Data Grid
for (let i = 0; i < 20; i++) {
    let row = [];
    for (let j = 0; j < 20; j++) {
        row.push({
            type: 0,
            cycle() {
                this.type = (this.type + 1) % TYPE_CLASSES.length;
                return TYPE_CLASSES[this.type];
            }
        });
    }
    cellist.push(row);
}

export function init() {
    const editor = document.querySelector('.editor');

    editor.style.display = 'grid';
    editor.style.gridTemplateColumns = `repeat(${cellist[0].length}, 45px)`;

    cellist.forEach((row, rowIndex) => {
        row.forEach((cellData, colIndex) => {
            let square = document.createElement('div');

            square.classList.add('cell', 'grass');

            square.dataset.r = rowIndex;
            square.dataset.c = colIndex;

            editor.appendChild(square);
        });
    });

    editor.addEventListener('click', (e) => {
        const clickedSquare = e.target;

        if (!clickedSquare.classList.contains('cell')) return;

        const r = clickedSquare.dataset.r;
        const c = clickedSquare.dataset.c;

        const dataObject = cellist[r][c];

        const newClass = dataObject.cycle();

        clickedSquare.className = `cell ${newClass}`;
    });
}