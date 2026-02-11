'use strict';

import {getSavedTrackNames, getStorage} from "../../Modules/storage.js";


const TYPE_CLASSES = ['grass', 'road', 'water'];

let cellist = [];

let currentTrackName;


//UKLADANI

function saveCurrentTrack(trackName) {

    const simpleCellist = cellist.map(row =>
        row.map(cell => cell.type)
    );

    const db = getStorage();

    db[trackName] = simpleCellist;

    localStorage.setItem('saves', JSON.stringify(db));
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


export function init(trackName) {

    const headerbtn = document.querySelector('.editorb');

    if(headerbtn.disabled === true) {
        headerbtn.disabled = false;
    }

    document.querySelectorAll('.headerbutton').forEach((button) => {
        button.classList.remove('buttonon');
    });
    document.querySelector('.editorb').classList.add('buttonon');

    const editor = document.querySelector('.editor');
    const reloadbutt = document.querySelector('.reset');
    const savebutt = document.querySelector('.save');
    const loadbutt = document.querySelector('.load');

    if (trackName === undefined) {
        trackName = JSON.parse(localStorage.getItem('lastTrack'));
    }

    localStorage.setItem('lastTrack', JSON.stringify(trackName));

    currentTrackName = trackName;

    document.querySelector('h1').innerText = currentTrackName;

    reloadbutt.addEventListener('click',() => {
        generate();
    })

    savebutt.addEventListener('click', () => {
        saveCurrentTrack(currentTrackName);
    })

    loadbutt.addEventListener('click', () => {
        loadTrackByName(currentTrackName);
    })

    generate();

    if (getSavedTrackNames().includes(currentTrackName)) {
        loadTrackByName(currentTrackName);
    }

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

                let radius = '2rem';

                if (rowIndex === 0 && colIndex === 0) {
                    square.style.borderTopLeftRadius = radius;
                }
                if (rowIndex === cellist.length-1 && colIndex === 0) {
                    square.style.borderBottomLeftRadius = radius;
                }
                if (rowIndex === 0 && colIndex === row.length-1) {
                    square.style.borderTopRightRadius = radius;
                }
                if (rowIndex === cellist.length-1 && colIndex === row.length-1) {
                    square.style.borderBottomRightRadius = radius;
                }

                editor.appendChild(square);
            });
        });
    }
}