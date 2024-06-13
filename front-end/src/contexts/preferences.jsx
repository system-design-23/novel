import { createContext, useState } from 'react';

export const PreferencesContext = createContext(null);

const PreferencesContextProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    fontFamily: 'Inter',
    fontSize: 13,
    lineHeight: '1.5rem',
    backgroundColor: '#ffffff',
    color: '#000000'
  });

  const itemValue = [preferences, setPreferences];
  return <PreferencesContext.Provider value={itemValue}>{children}</PreferencesContext.Provider>;
};

export default PreferencesContextProvider;
