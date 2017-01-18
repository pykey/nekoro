import { browser, element, by } from 'protractor';

export class NekoroPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('neko-root h1')).getText();
  }
}
