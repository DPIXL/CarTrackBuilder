'use strict';

async function loadView(viewName) {
    await fetch(`Views/${viewName}/index.html`)
        .then(res => res.text())
        .then(html => {
            document.querySelector('.content').innerHTML = html;
        });

    const module = await import(`./Views/${viewName}/script.js`);
    if (module.init) {
        module.init();
    }
}

loadView('Editor');

