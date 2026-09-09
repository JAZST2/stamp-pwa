import { Theme } from './settings/types';
import { CreateStampCard } from './components/generated/CreateStampCard';

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

  return <CreateStampCard />;
}

export default App;
