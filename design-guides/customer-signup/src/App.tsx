import { Theme } from './settings/types';
import { PerklySignUp } from './components/generated/PerklySignUp';

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

  return <PerklySignUp />;
}

export default App;