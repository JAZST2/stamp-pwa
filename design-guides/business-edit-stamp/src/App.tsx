import { Theme } from './settings/types';
import { EditStampCard } from './components/generated/EditStampCard';

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

  return <EditStampCard />;
}

export default App;
