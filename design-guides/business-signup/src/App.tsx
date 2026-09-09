import { Theme } from './settings/types';
import { BusinessRegistration } from './components/generated/BusinessRegistration';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return <BusinessRegistration />;
}

export default App;