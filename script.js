document.addEventListener("submit", handleSubmit);

function onLoad() {
  const searchValue = document.getElementById("search-field")?.value;
  console.log("searchValue", searchValue);
}

// onLoad();

async function handleSubmit(event) {
  event.preventDefault();
  const mealsSection = document.getElementById("meals-section");
  removeAllChildNodes(mealsSection);
  showLoadingOverlay(true);
  const searchValue = document.getElementById("search-field").value;
  if (searchValue?.trim() === "") {
    return;
  } else {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`
    );
    const result = await response.json();
    console.log("RESULT", result);
    if (result.meals?.length) {
      createMealCard(result.meals);
    } else {
      showNoItemFoundMessage();
    }
    showLoadingOverlay(false);
  }
}

showNoItemFoundMessage();

function showNoItemFoundMessage() {
  const mealsSection = document.getElementById("meals-section");
  mealsSection.innerHTML =
    '<div class="no-item-found-message">Sorry! No item found.</div>';
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function viewDetails(mealId) {
  window.location.href = `details.html?id=${mealId}`;
}

// Function to create a card for each item in the API response
function createMealCard(data) {
  const cardContainer = document.getElementById("meals-section");

  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card-container");

    const imageSection = document.createElement("div");
    imageSection.classList.add("image-section");
    const image = document.createElement("img");
    image.classList.add("food-image");
    image.src = item.strMealThumb;
    imageSection.appendChild(image);
    card.appendChild(imageSection);

    const detailsSection = document.createElement("div");
    detailsSection.classList.add("details-section");
    const strArea = document.createElement("div");
    strArea.classList.add("meal-area");
    strArea.textContent = item.strArea;
    detailsSection.appendChild(strArea);

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");
    iconContainer.id = `icon-container-${item.idMeal}`;
    let favData = JSON.parse(localStorage.getItem("fav-list"));
    if (!favData?.length || !favData.includes(item.idMeal)) {
      const favIconNotFilled = document.createElement("i");
      favIconNotFilled.addEventListener("click", () => toggleFav(item.idMeal));
      favIconNotFilled.classList.add(
        "fa-regular",
        "fa-heart",
        "fav-icon",
        "not-filled"
      );
      favIconNotFilled.id = `not-filled-${item.idMeal}`;
      iconContainer.appendChild(favIconNotFilled);
    } else {
      const favIconFilled = document.createElement("i");
      favIconFilled.addEventListener("click", () => toggleFav(item.idMeal));
      favIconFilled.classList.add("fa-solid", "fa-heart", "fav-icon", "filled");
      favIconFilled.id = `filled-${item.idMeal}`;
      iconContainer.appendChild(favIconFilled);
    }
    detailsSection.appendChild(iconContainer);
    const totalItemsCount = document.createElement("div");
    totalItemsCount.classList.add("total-items-count");
    const strCategoryLabel = document.createElement("div");
    strCategoryLabel.textContent = "Food Category :";
    totalItemsCount.appendChild(strCategoryLabel);
    const totalCount = document.createElement("div");
    totalCount.classList.add("total-count");
    totalCount.textContent = item.strCategory;
    totalItemsCount.appendChild(totalCount);
    detailsSection.appendChild(totalItemsCount);

    const viewDetailsBtn = document.createElement("button");
    viewDetailsBtn.classList.add("view-details-btn");
    viewDetailsBtn.textContent = "View Details";
    detailsSection.appendChild(viewDetailsBtn);
    viewDetailsBtn.addEventListener("click", () => {
      viewDetails(item.idMeal);
    });

    card.appendChild(detailsSection);
    cardContainer.appendChild(card);
  });
}

function toggleFavIcon(id, isFav) {
  const iconContainer = document.getElementById(`icon-container-${id}`);
  removeAllChildNodes(iconContainer);
  if (!isFav) {
    const favIconNotFilled = document.createElement("i");
    favIconNotFilled.addEventListener("click", () => toggleFav(id));
    favIconNotFilled.classList.add(
      "fa-regular",
      "fa-heart",
      "fav-icon",
      "not-filled"
    );
    favIconNotFilled.id = `not-filled-${id}`;
    iconContainer.appendChild(favIconNotFilled);
  } else {
    const favIconFilled = document.createElement("i");
    favIconFilled.addEventListener("click", () => toggleFav(id));
    favIconFilled.classList.add("fa-solid", "fa-heart", "fav-icon", "filled");
    favIconFilled.id = `filled-${id}`;
    iconContainer.appendChild(favIconFilled);
  }
}

function toggleFav(id) {
  let favData = localStorage.getItem("fav-list");
  if (favData === null) {
    const favArr = [id];
    toggleFavIcon(id, true);
    localStorage.setItem("fav-list", JSON.stringify(favArr));
  } else {
    favData = JSON.parse(favData);
    toggleFavIcon(id, false);
    if (favData.includes(id)) {
      console.log("FAV DATA", favData);
      favData = favData.filter((favId) => favId !== id);
    } else {
      toggleFavIcon(id, true);
      favData.push(id);
    }
    localStorage.setItem("fav-list", JSON.stringify(favData));
  }
}

function showLoadingOverlay(show = true) {
  const overlay = document.getElementById("loading-overlay");
  if (show) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}
