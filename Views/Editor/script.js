'use strict';

const TYPE_CLASSES = ['grass', 'road', 'water'];

let cellist = [];


//UKLADANI

const STORAGE_KEY = 'saves';

function getStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
}

function saveCurrentTrack(trackName) {
    if (!trackName) {
        alert("Please, choose a name for your track!");
        return;
    }

    const simpleCellist = cellist.map(row =>
        row.map(cell => cell.type)
    );

    const db = getStorage();

    db[trackName] = simpleCellist;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function loadTrackByName(trackName) {
    const db = getStorage();
    const savedCellist = db[trackName];

    if (!savedCellist) {
        return;
    }

    savedCellist.forEach((row, r) => {
        row.forEach((type, c) => {
            cellist[r][c].type = type;

            const div = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);

            div.className = 'cell';
            const types = ['grass', 'road', 'water'];
            div.classList.add(types[type]);
        });
    });
}

function getSavedTrackNames() {
    const db = getStorage();
    return Object.keys(db);
}


export function init() {
    const editor = document.querySelector('.editor');
    const reloadbutt = document.querySelector('.reset');
    const savebutt = document.querySelector('.save');
    const loadbutt = document.querySelector('.load');

    reloadbutt.addEventListener('click',() => {
        generate();
    })

    savebutt.addEventListener('click', () => {
        saveCurrentTrack('default');
    })

    loadbutt.addEventListener('click', () => {
        loadTrackByName('default');
    })

    generate();

    editor.style.display = 'grid';
    editor.style.gridTemplateColumns = `repeat(${cellist[0].length}, 45px)`;

    editor.addEventListener('click', (e) => {
        const clickedSquare = e.target;

        if (!clickedSquare.classList.contains('cell')) return;

        const r = clickedSquare.dataset.r;
        const c = clickedSquare.dataset.c;

        const dataObject = cellist[r][c];

        const newClass = dataObject.cycle();

        clickedSquare.className = `cell ${newClass}`;
    });



    function generate() {

        cellist = [];

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

        editor.replaceChildren();
        cellist.forEach((row, rowIndex) => {
            row.forEach((cellData, colIndex) => {
                let square = document.createElement('div');

                square.className = 'cell grass';

                square.dataset.r = rowIndex;
                square.dataset.c = colIndex;

                editor.appendChild(square);
            });
        });
    }
}