import { NekoroPage } from './app.po';

describe('nekoro App', function() {
  let page: NekoroPage;

  beforeEach(() => {
    page = new NekoroPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('neko works!');
  });
});
