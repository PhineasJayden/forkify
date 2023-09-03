import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //0 Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1) loading recipe
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (err) {
    searchView.renderError();
  }
};
const controlPagination = function (page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  try {
    //update the recipe servings (in state)
    model.updateServings(newServings);

    //update the recipe view
    recipeView.update(model.state.recipe);
  } catch (err) {
    recipeView.renderError("Something wen't wrong");
  }
};

const controlAddBookmark = function () {
  //add or remove a bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
    bookmarksView.showButton();
  } else {
    model.deleteBookmark(model.state.recipe.id);
    if (model.state.bookmarks.length === 0) bookmarksView.hideButton();
  }
  //update recipe view
  recipeView.update(model.state.recipe);
  //render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
  if (model.state.bookmarks.length !== 0) bookmarksView.showButton();
};

const controlDeleteBookmarks = function () {
  model.clearBookmarks();
  console.log('clear');
  bookmarksView.render(model.state.bookmarks);
  bookmarksView.hideButton();
  console.log(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    setTimeout(function () {
      location.reload();
    }, 1500);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const welcome = function () {
  console.log('Welcome to the Application');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  bookmarksView.addHandlerDelete(controlDeleteBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandleraddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
