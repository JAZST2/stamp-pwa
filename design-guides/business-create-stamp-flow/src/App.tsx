import { Theme } from './settings/types';
import { CreateCardQrStep } from './components/generated/CreateCardQrStep';

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

  return <CreateCardQrStep />;
}

export default App;
