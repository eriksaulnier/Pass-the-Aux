import { loadLocalState } from './LocalStorage';

export default ownerId => {
  // load the saved state from local storage
  const state = loadLocalState();

  // check if the userId and ownerId match
  return state.userId === ownerId;
};
