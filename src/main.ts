import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import { mountPhonePreview } from './phone-preview';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
if (window.self === window.top) {
  mountPhonePreview();
} else {
  defineCustomElements(window);
  platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
}
