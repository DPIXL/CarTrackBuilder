'use strict';

const headerbuttons = document.querySelectorAll('.headerbutton');

const editorbutt = document.querySelector('.editorb');

async function loadView(viewName, trackName) {
    if (viewName === 'Editor') {
        document.querySelector('body').classList.add('blur');
    } else {
        document.querySelector('body').classList.remove('blur');
    }
    await fetch(`Views/${viewName}/index.html`)
        .then(res => res.text())
        .then(html => {
            document.querySelector('.content').innerHTML = html;
        });

    if (JSON.parse(localStorage.getItem('lastTrack')) === null) {
        editorbutt.disabled = true;
    } else {
        editorbutt.disabled = false;
    }

    const module = await import(`./Views/${viewName}/script.js`);
    if (module.init) {
        module.init(trackName);
    }
}

loadView('MainMenu');