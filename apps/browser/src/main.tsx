import { App } from '@/app';
import { DirectionProvider } from '@radix-ui/react-direction';
import { StrictMode } from 'react';
import { I18nProvider } from 'react-aria-components';
import ReactDOM from 'react-dom/client';
import './index.css';

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <I18nProvider locale="en">
        <DirectionProvider dir="rtl">
          <App />
        </DirectionProvider>
      </I18nProvider>
    </StrictMode>,
  );
}
