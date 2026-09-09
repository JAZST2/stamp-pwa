import { Theme } from './settings/types';
import { BusinessPortalLogin } from './components/generated/BusinessPortalLogin';

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

  return <BusinessPortalLogin />;
}

export default App;