export function loadSessionState() {
  try {
    // load the saved state from storage
    const serializedState = sessionStorage.getItem('state');
    if (serializedState == null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

export function saveSessionState(state) {
  try {
    // fetch and serialize the state for storage
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem('state', serializedState);
  } catch (err) {
    // ignore this error
    console.log(err);
  }
}
