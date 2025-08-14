import inlineCss from '../../dist/all/index.css?inline';
import { initAppWithShadow } from '@extension/shared';
import App from '@src/all/App';

initAppWithShadow({ id: 'kiosk-keyboard-root', app: <App />, inlineCss });
