import { Theme } from './settings/types';
import { PerklyRewards } from './components/generated/PerklyRewards';

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

  return <PerklyRewards />;
}

export default App;
