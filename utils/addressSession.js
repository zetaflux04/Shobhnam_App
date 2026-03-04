let addressSavedInSession = false;

export const getAddressSaved = () => addressSavedInSession;

export const setAddressSaved = () => {
  addressSavedInSession = true;
};
