const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const searchForm = document.querySelector("form");
const searchResults = document.querySelector(".search-result");
const trendingContainer = document.querySelector(".trending-articles");
const container = document.querySelector(".container");
let searchQuery = "";
const appID = "f0504f7c";
const appKey = "35d639b88b1c312f629fc6693495ab21";

// open menu
menuToggle.addEventListener("click", (event) => {
  navLinks.classList.toggle("open");
  event.stopPropagation();
});

// close menu
document.addEventListener("click", (event) => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    navLinks.classList.remove("open");
  }
});

// search bar
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchQuery = e.target.querySelector("input").value;
  fetchRecipes();
});

// fetch recipes based on search inquiry
async function fetchRecipes() {
  const encodedQuery = encodeURIComponent(searchQuery);

  const baseURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodedQuery}&app_id=${appID}&app_key=${appKey}&to=10`;

  try {
    const response = await fetch(baseURL);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    generateHTML(data.hits);
    console.log(data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}

// Function to display the search results
function generateHTML(results) {
  let generatedHTML = "";
  results.map((result) => {
    generatedHTML += `
    <article class="card-article">
                <img src="${
                  result.recipe.image
                }" alt="photo of viand" class="card-img">
                <div class="card-data">
                  <span class="card-description">Calories: ${result.recipe.calories.toFixed(
                    0
                  )} , Cuisine: ${result.recipe.cuisineType}</span>
                  <h2 class="card-title">${result.recipe.label}</h2>
                  <a href="${
                    result.recipe.url
                  }" class="card-button" target="_blank">View Recipe</a>
                </div>
              </article>
    `;
  });
  searchResults.innerHTML = generatedHTML;
}

// function to fetch random recipes for trending section
async function fetchTrendingRecipes() {
  const baseURL = `https://api.edamam.com/api/recipes/v2?type=public&q=random&app_id=${appID}&app_key=${appKey}`;

  try {
    const response = await fetch(baseURL);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();

    const randomRecipes = getRandomRecipes(data.hits, 6);
    generateTrendingHTML(randomRecipes);
  } catch (error) {
    console.error("Error fetching trending recipes:", error);
  }
}

// Function to select a random set of recipes
function getRandomRecipes(recipes, count) {
  const shuffled = recipes.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateTrendingHTML(results) {
  let trendingHTML = "";
  results.forEach((result) => {
    trendingHTML += `
      <div class="article">
        <img class="article-img" src="${result.recipe.image}" alt="Photo of ${result.recipe.label}">
        <div class="recipe-container">
          <a class="recipe" href="${result.recipe.url}" target="_blank">${result.recipe.label}</a>
        </div>
      </div>
    `;
  });
  trendingContainer.innerHTML = trendingHTML;
}

fetchTrendingRecipes();
