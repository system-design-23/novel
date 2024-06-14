import { createContext, useState } from 'react';

export const PreferencesContext = createContext(null);

const PreferencesContextProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    fontFamily: 'Merriweather',
    fontSize: 18,
    lineHeight: '2.5rem',
    backgroundColor: '#ffffff',
    color: '#000000'
  });

  const itemValue = [preferences, setPreferences];
  return <PreferencesContext.Provider value={itemValue}>{children}</PreferencesContext.Provider>;
};

export default PreferencesContextProvider;
