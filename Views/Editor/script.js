'use strict';

import {getSavedTrackNames, getStorage, getSessionStorage} from "../../Modules/storage.js";


const TYPE_CLASSES = ['grass', 'road', 'water'];

let cellist = [];

let currentTrackName;

let autoSaveTimer;


//UKLADANI

function triggerAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        saveToSession();
    }, 1000);
}

function saveToSession() {
    const simpleCellist = cellist.map(row =>
        row.map(cell => cell.type)
    );

    const db = getStorage();

    db[currentTrackName] = simpleCellist;

    sessionStorage.setItem('saves', JSON.stringify(db));
}

function loadFromSession() {
    const db = getSessionStorage();
    const savedCellist = db[currentTrackName];

    if (!savedCellist) {
        return;
    }

    loadGridFromData(savedCellist);
}

function saveCurrentTrack(trackName) {

    const simpleCellist = cellist.map(row =>
        row.map(cell => cell.type)
    );

    const db = getStorage();

    db[trackName] = simpleCellist;

    localStorage.setItem('saves', JSON.stringify(db));
}

function loadGridFromData(data) {
    data.forEach((row, r) => {
        row.forEach((type, c) => {
            cellist[r][c].type = type;

            const div = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);

            div.className = 'cell';
            const types = ['grass', 'road', 'water'];
            div.classList.add(types[type]);
        });
    });
}

function loadTrackByName(trackName) {
    const db = getStorage();
    const savedCellist = db[trackName];

    if (!savedCellist) {
        return;
    }

    loadGridFromData(savedCellist);
}

function saveToFile() {
    const fileName = `CarTrackBuilder_${currentTrackName}.json`;

    const simpleGrid = cellist.map(row =>
        row.map(cell => cell.type)
    );

    const jsonString = JSON.stringify(simpleGrid, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    const savetofilebtn = document.querySelector('.savetofile');
    const loadfromfilebtn = document.querySelector('.loadfromfile');
    const hidinput = document.querySelector('#fileInput');

    const menub = document.querySelector('.mainmenub');

    menub.addEventListener('click', () => {
        saveToSession();
    })


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

    savetofilebtn.addEventListener('click', () => {
        saveToFile();
    });

    loadfromfilebtn.addEventListener('click', () => {
       hidinput.click();
    });

    hidinput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            try {

                const jsonString = event.target.result;
                const loadedData = JSON.parse(jsonString);

                if (!Array.isArray(loadedData) || loadedData.length !== 20 || loadedData[0].length !== 20) {
                    alert("Error: Invalid track file format!");
                    return;
                }

                loadGridFromData(loadedData);

            } catch (err) {
                console.error(err);
                alert("File loading failed. Check if it's the correct file.");
            }
        };

        reader.readAsText(file);

        e.target.value = '';
    });

    generate();

    if (currentTrackName in getSessionStorage()) {
        loadFromSession();
    } else if (getSavedTrackNames().includes(currentTrackName)) {
        loadTrackByName(currentTrackName);
    }

    editor.style.display = 'grid';
    editor.style.gridTemplateColumns = `repeat(${cellist[0].length}, 1fr)`;
    editor.style.gridTemplateRows = `repeat(${cellist[0].length}, 1fr)`;

    editor.addEventListener('click', (e) => {
        const clickedSquare = e.target;

        if (!clickedSquare.classList.contains('cell')) return;

        const r = clickedSquare.dataset.r;
        const c = clickedSquare.dataset.c;

        const dataObject = cellist[r][c];

        const newClass = dataObject.cycle();

        clickedSquare.className = `cell ${newClass}`;

        //autosave
        triggerAutoSave();
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