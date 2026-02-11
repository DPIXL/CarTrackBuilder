'use strict';

import {getSavedTrackNames} from "../../Modules/storage.js";

export function init() {

    document.querySelectorAll('.headerbutton').forEach((button) => {
        button.classList.remove('buttonon');
    });
    document.querySelector('.mainmenub').classList.add('buttonon');

    const loadmapsel = document.querySelector('.loadmapselect');

    const newmap = document.querySelector('.newmap');
    const loadmap = document.querySelector('.loadmap');

    let availablemaps = getSavedTrackNames();

    availablemaps.forEach((item) => {
        let newoption = document.createElement('option');
        newoption.text = item;
        newoption.value = item;
        loadmapsel.options.add(newoption);
    });

    newmap.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const trackName = formData.get('newname');

        loadView('Editor', trackName);
    });

    loadmap.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const trackName = formData.get('selectedtrack');

        loadView('Editor', trackName);
    });
}