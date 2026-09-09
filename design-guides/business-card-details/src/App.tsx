import { Theme } from './settings/types';
import { BusinessCardDetail } from './components/generated/BusinessCardDetail';

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

  return <BusinessCardDetail />;
}

export default App;
