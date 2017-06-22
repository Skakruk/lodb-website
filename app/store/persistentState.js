export function loadState() {
    var state = localStorage.getItem("state");
    try {
        if (state) {
            return JSON.parse(state);
        }
    } catch (e) {
        // Ignore errors
    }
    return undefined;
}

export function saveState(state) {
    try {
        var prevState = loadState();
        localStorage.setItem("state", JSON.stringify({
            ...prevState,
            ...state
        }));
    } catch (e) {
        console.error(e);
    }
}