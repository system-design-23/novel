import { createContext, useEffect, useState, useRef, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { debounce } from '../utils/utils';
import { getPreference, updateCurrentPreference } from '../apis/settings';

export const PreferencesContext = createContext(null);
const defaultPreference = {
  fontFamily: 'Merriweather',
  fontSize: 18,
  lineHeight: '2.5rem',
  backgroundColor: '#ffffff',
  color: '#000000'
};

const PreferencesContextProvider = ({ children }) => {
  const { user } = useAuth();
  const isSavingPreference = useRef(false);
  const [preferences, setPreferences] = useState(defaultPreference);

  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        const userPreferences = JSON.parse(localStorage.getItem(`${user.username}_preferences`));
        if (userPreferences) {
          setPreferences(userPreferences);
        } else {
          try {
            const preferences = await getPreference();
            if (preferences) {
              setPreferences(preferences);
              localStorage.setItem(`${user.username}_preferences`, JSON.stringify(preferences));
            } else {
              setPreferences(defaultPreference);
            }
          } catch (error) {
            console.error('Failed to load preferences', error);
            setPreferences(defaultPreference);
          }
        }
      } else {
        setPreferences(defaultPreference);
      }
    };

    loadPreferences();
  }, [user]);

  const debouncedSavePreferences = useCallback(
    debounce(async (prefs) => {
      if (isSavingPreference.current) {
        return;
      }
      isSavingPreference.current = true;
      try {
        if (user) {
          localStorage.setItem(`${user.username}_preferences`, JSON.stringify(prefs));
          await updateCurrentPreference(prefs);
        }
      } catch (error) {
        console.error('Failed to save preferences', error);
      } finally {
        isSavingPreference.current = false;
      }
    }, 1000),
    [user]
  );

  useEffect(() => {
    if (user) {
      debouncedSavePreferences(preferences);
    }
  }, [preferences, user, debouncedSavePreferences]);

  const itemValue = [preferences, setPreferences];
  return <PreferencesContext.Provider value={itemValue}>{children}</PreferencesContext.Provider>;
};

export default PreferencesContextProvider;
