import { Theme } from './settings/types';
import { ScanJoinScreen } from './components/generated/ScanJoinScreen';

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

  return <ScanJoinScreen />;
}

export default App;
