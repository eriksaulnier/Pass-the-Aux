export function loadState() {
    try {
        const serializedState = sessionStorage.getItem('state');
        if (serializedState == null) {
            return undefined;
        }

        return JSON.parse(serializedState);
    } catch(err) {
        return undefined;
    }
};

export function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem('state', serializedState);
    } catch(err) {
        // ignore this error
        console.log(err);
    }
}