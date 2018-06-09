function canUseLocalStorage() {
    return typeof(Storage) !== 'undefined';
}

export function setInStorage(key: string, value: any) {
    if (canUseLocalStorage()) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export function removeFromStorage(key: string) {
    if (canUseLocalStorage()) {
        localStorage.removeItem(key);
    }
}

export function getFromStorage(key: string) {
    if (canUseLocalStorage()) {
        const value = localStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        }
        return value;
    }
    return null;
}