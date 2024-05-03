const urlParams = new URLSearchParams(window.location.search);
const mealId = urlParams.get("id");
console.log("mealId", mealId);

async function fetchMealDetails(mealId) {
  showLoadingOverlay(true);
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  const data = await response.json();
  if (!data?.meals?.length) {
    showNoItemFoundMessage();
    return;
  }
  // Call the function to create and append the HTML structure
  createMealDetails(data.meals[0]);
  showLoadingOverlay(false);
}

function showLoadingOverlay(show = true) {
  const overlay = document.getElementById("loading-overlay");
  if (show) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

function createMealDetails(data) {
  // Create the main container div
  const mealDetailsSection = document.createElement("div");
  mealDetailsSection.classList.add("meal-details-section");

  // Create the meal image section
  const mealImageSection = document.createElement("div");
  mealImageSection.classList.add("meal-image-section");
  const mealImage = document.createElement("img");
  mealImage.classList.add("meal-image");
  mealImage.src = data.strMealThumb;
  mealImageSection.appendChild(mealImage);
  mealDetailsSection.appendChild(mealImageSection);

  // Create the meal details section
  const mealDetails = document.createElement("div");
  mealDetails.classList.add("meal-details");

  // Create the meal name section
  const mealName = document.createElement("div");
  mealName.classList.add("meal-name");
  mealName.textContent = data.strMeal;
  const youtubeLink = document.createElement("a");
  youtubeLink.target = "_blank";
  youtubeLink.href = data.strYoutube;
  youtubeLink.innerHTML = '<i class="fa-brands fa-youtube youtube-icon"></i>';
  mealName.appendChild(youtubeLink);
  const recipeLink = document.createElement("a");
  recipeLink.href = data.strSource;
  recipeLink.target = "_blank";
  recipeLink.innerHTML = '<i class="fa-solid fa-paperclip clip-icon"></i>';
  mealName.appendChild(recipeLink);
  mealDetails.appendChild(mealName);

  // Create the meal area section
  const mealArea = document.createElement("div");
  mealArea.classList.add("meal-area");
  mealArea.textContent = `${data.strArea} Meal`;
  mealDetails.appendChild(mealArea);

  // Create the meal instructions section
  const mealInstructions = document.createElement("div");
  mealInstructions.classList.add("meal-instructions");
  mealInstructions.textContent = data.strInstructions;
  mealDetails.appendChild(mealInstructions);

  // Create the meal category section
  const mealCategorySection = document.createElement("div");
  mealCategorySection.classList.add("meal-category-section");
  const mealCategoryTitle = document.createElement("div");
  mealCategoryTitle.classList.add("meal-category-title");
  mealCategoryTitle.textContent = "Category:";
  mealCategorySection.appendChild(mealCategoryTitle);
  const mealCategory = document.createElement("div");
  mealCategory.textContent = data.strCategory;
  mealCategorySection.appendChild(mealCategory);
  mealDetails.appendChild(mealCategorySection);

  mealDetailsSection.appendChild(mealDetails);

  // Append the main container div to the body
  document.body.appendChild(mealDetailsSection);
}

function showNoItemFoundMessage() {
  document.body.innerHTML =
    '<div class="no-item-found-message">Sorry! No item found.</div>';
}

fetchMealDetails(mealId);
