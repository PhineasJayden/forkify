import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _btnClear = document.querySelector('.bookmarks__btn');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';
  _message = ' ';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  hideButton() {
    this._btnClear.classList.add('hidden');
  }

  showButton() {
    this._btnClear.classList.remove('hidden');
  }

  addHandlerDelete(handler) {
    this._btnClear.addEventListener('click', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join(' ');
  }
}

export default new BookmarksView();
