import { Theme } from './settings/types';
import { PerklyLogin } from './components/generated/PerklyLogin';

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

  return <PerklyLogin />;
}

export default App;
