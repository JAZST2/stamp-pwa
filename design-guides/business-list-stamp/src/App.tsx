import { Theme } from './settings/types';
import { BusinessCardsList } from './components/generated/BusinessCardsList';

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

  return <BusinessCardsList />;
}

export default App;
