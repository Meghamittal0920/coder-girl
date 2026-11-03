import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// No StrictMode: several WebGL/GSAP effects lose their contexts when double-mounted in dev.
createRoot(document.getElementById('root')!).render(<App />);
