export function getStorage() {
    const raw = localStorage.getItem('saves');
    return raw ? JSON.parse(raw) : {};
}

export function getSavedTrackNames() {
    const db = getStorage();
    return Object.keys(db);
}