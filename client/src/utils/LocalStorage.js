export function loadLocalState() {
  try {
    // load the saved state from storage
    const serializedState = localStorage.getItem('state');
    if (serializedState == null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

export function saveLocalState(state) {
  try {
    // fetch and serialize the state for storage
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // ignore this error
    console.log(err);
  }
}
