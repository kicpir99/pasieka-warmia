import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ReactLenis } from 'lenis/react';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <App />
    </ReactLenis>
  </StrictMode>,
);
