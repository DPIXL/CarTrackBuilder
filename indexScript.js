'use strict';

function loadView(viewName) {
    fetch(`Views/${viewName}/index.html`)
        .then(res => res.text())
        .then(html => {
            document.querySelector('.content').innerHTML = html;
        });
}

loadView('MainMenu');