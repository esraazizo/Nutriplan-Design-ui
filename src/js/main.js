/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */
// ----------------------------------------------
/* select elements */
let areasContainer = document.getElementById("areas-container");
let recipesGrid = document.getElementById("recipes-grid");
let recipesCount = document.getElementById("recipes-count");
let categoriesGrid = document.getElementById("categories-grid");
let searchInput = document.getElementById("search-input");
let gridViewBtn = document.getElementById("grid-view-btn");
let listViewBtn = document.getElementById("list-view-btn");
let appLoadingOverlay = document.getElementById("app-loading-overlay");
/* meal details part */
let currentMeals = [];
let homeView = document.getElementById("main-content");
let mealView = document.getElementById("meal-details");
let backBtn = document.getElementById("back-to-meals-btn");
import { getMealInfo, switchPage } from './ui/components.js';
import { getSelectedMeal } from './ui/components.js';
/* switch pages */
let navProducts = document.getElementById("nav-products")
let navFood = document.getElementById("nav-food")
let navHome = document.getElementById("nav-home")
/* display loading overlay */
function displayOverlay() {
  appLoadingOverlay.style.setProperty("display", "flex", "important");
  window.addEventListener("load", () => {
    appLoadingOverlay.classList.add("opacity-0");
    setTimeout(() => {
      appLoadingOverlay.style.setProperty("display", "none", "important");
    }, 1000);
  });
}
displayOverlay();
/* get data of all areas and display it */
/*helper card function*/
function getCard(meal) {
  return `
    <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col sm:flex-row h-full" data-meal-id="${meal.id}">
      <!-- 1. Explicit sizing constraints on the image layout wrapper -->
      <div class="relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden">
        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.thumbnail}" alt="${meal.name}" loading="lazy" />
        <div class="absolute bottom-3 left-3 flex gap-2">
          <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">${meal.category ?? 'General'}</span>
          <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">${meal.area ?? 'International'}</span>
        </div>
      </div>
      
      <!-- 2. Content text segment flex expansion -->
      <div class="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${meal.name}</h3>
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">${meal.instructions}</p>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-gray-900"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${meal.category}</span>
          <span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${meal.area}</span>
        </div>
      </div>
    </div>
  `;
}
async function displayAllArea() {
  const apiUrl = "https://nutriplan-api.vercel.app/api/meals/areas";

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.message === "success" && data.results) {
      const firstTenR = data.results.slice(0, 10);
      let temp = "";

      firstTenR.forEach((a) => {
        temp += `
          <button onclick="getMealByArea('${a.name}')"  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all">
            ${a.name}
          </button>
        `;
      });
      areasContainer.innerHTML += temp;
    }
  } catch (error) {
    console.error("Error fetching area data:", error);
  }
}
/* get meal by area name  */
window.getMealByArea = async function (clickedArea) {
  // console.log("The user clicked on:", clickedArea);
  const apiUrl = `https://nutriplan-api.vercel.app/api/meals/filter?area=${clickedArea}`;
  recipesGrid.innerHTML = '<p class="text-gray-500">Loading meals...</p>';
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.message === "success" && data.results.length > 0) {
      recipesCount.innerHTML = `Showing ${data.results.length} recipes`;
      currentMeals = data.results;
      let card = "";
      data.results.forEach((meal) => {
        card += getCard(meal);
      });
      recipesGrid.innerHTML = card;
      getSelectedMeal(data.results);
    } else {
      currentMeals = [];
      recipesCount.innerHTML = `Showing ${data.results.length} ${clickedArea} recipes`;
      recipesGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <i class="fa-solid fa-magnifying-glass text-xl text-gray-400"></i>
          </div>
          <p class="text-gray-500 text-base font-medium max-w-xs">
            No recipes found. Try a different search term.
          </p>
        </div>
  `;
    }
  } catch (error) {
    currentMeals = [];
    console.error("Error fetching filtered meals:", error);
    recipesGrid.innerHTML = '<p class="text-red-500">Failed to load meals.</p>';
  }
};
/*  get all recipes and search */
window.loadAllRecipes = async function (query = "chicken") {
  const apiUrl = `https://nutriplan-api.vercel.app/api/meals/search?q=${query}&page=1&limit=25`;
  recipesGrid.innerHTML =
    '<p class="text-gray-500 col-span-full text-center">Loading recipes...</p>';
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.message === "success" && data.results.length > 0) {
      recipesCount.innerHTML = `Showing ${data.results.length} recipes for "${query}" `;
      currentMeals = data.results;
      let card = "";
      data.results.forEach((meal) => {
        card += getCard(meal);
      });
      recipesGrid.innerHTML = card;
      getSelectedMeal(data.results);
    } else {
      currentMeals = [];
      recipesCount.innerHTML = "Showing 0 recipes";
      recipesGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <p class="text-gray-500 text-base font-medium">No recipes found. Try a different search term.</p>
        </div>
      `;
    }
  } catch (error) {
    currentMeals = [];
    console.error("Error fetching recipes:", error);
    recipesCount.innerHTML = "Showing 0 recipes";
    recipesGrid.innerHTML =
      '<p class="text-red-500 col-span-full text-center">Failed to load recipes.</p>';
  }
};
searchInput.addEventListener("input", function (e) {
  const searchValue = e.target.value;

  if (searchValue.trim() === "") {
    window.loadAllRecipes();
  } else {
    window.loadAllRecipes(searchValue);
  }
});
document.addEventListener("DOMContentLoaded", function () {
  displayAllArea();
  loadAllRecipes();
  displayAllCategories();
  getSelectedMeal();
});
/* display all category */
async function displayAllCategories() {
  const apiUrl = "https://nutriplan-api.vercel.app/api/meals/categories";

  const categoryStyles = {
    Beef: {
      icon: "fa-drumstick-bite",
      bg: "#FFF2F2",
      border: "#ffc9c9",
      hoverBorder: "#ff6467",
      iconBg: "#FF3B5B",
    },
    Chicken: {
      icon: "fa-drumstick-bite",
      bg: "#FFF9EC",
      border: "#fee685",
      hoverBorder: "#ffb900",
      iconBg: "#FF6B00",
    },
    Dessert: {
      icon: "fa-cake-candles",
      bg: "#FEF2F5",
      border: "#fccee8",
      hoverBorder: "#fb64b6",
      iconBg: "#FF1493",
    },
    Lamb: {
      icon: "fa-drumstick-bite",
      bg: "#FFFAEB",
      border: "#ffd6a7",
      hoverBorder: "#ff8904",
      iconBg: "#FF6B00",
    },
    Miscellaneous: {
      icon: "fa-bowl-food",
      bg: "#F9FAFC",
      border: "#e2e8f0",
      hoverBorder: "#90a1b9",
      iconBg: "#64748B",
    },
    Pasta: {
      icon: "fa-circle-dot",
      bg: "#FFFBEA",
      border: "oklch(94.5% .129 101.54)",
      hoverBorder: "#fdc700",
      iconBg: "#FFA500",
    },
    Pork: {
      icon: "fa-bacon",
      bg: "#FFF2F2",
      border: "#ffc9c9",
      hoverBorder: "#ff6467",
      iconBg: "#FF3B5B",
    },
    Seafood: {
      icon: "fa-fish",
      bg: "#EEF8FF",
      border: "#a2f4fd",
      hoverBorder: "#00d3f3",
      iconBg: "#1E90FF",
    },
    Side: {
      icon: "fa-bowl-rice",
      bg: "#EDFDF5",
      border: "#b9f8cf",
      hoverBorder: "#05df72",
      iconBg: "#00CD79",
    },
    Starter: {
      icon: "fa-utensils",
      bg: "#EEF8FF",
      border: "#a2f4fd",
      hoverBorder: "#00d3f3",
      iconBg: "#00CED1",
    },
    Vegan: {
      icon: "fa-leaf",
      bg: "#EDFDF5",
      border: "#b9f8cf",
      hoverBorder: "#05df72",
      iconBg: "#00CC63",
    },
    Vegetarian: {
      icon: "fa-seedling",
      bg: "#F2FEF1",
      border: "#d8fa99",
      hoverBorder: "#9ae600",
      iconBg: "#5ED732",
    },
  };
  const defaultStyle = {
    icon: "fa-utensils",
    bg: "#F9FAFB",
    border: "#F3F4F6",
    hoverBorder: "#FFDEDE",
    iconBg: "#6B7280",
  };

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.message === "success" && data.results) {
      const mealType = data.results.slice(0, 12);
      let temp = "";
      mealType.forEach((t) => {
        let style = categoryStyles[t.name] || {
          bg: "#F9FAFB",
          border: "#E5E7EB",
          iconBg: "#6B7280",
          icon: "fa-utensils",
        };

        temp += `
          <div  onclick="filterByMealType('${t.name}')"
          onmouseenter="this.style.setProperty('border', '1px solid ${style.hoverBorder}', 'important');"
          onmouseleave="this.style.setProperty('border', '1px solid ${style.border}', 'important');"
          style="background-color: ${style.bg}; border: 1px solid ${style.border}!important;"
            class="category-card rounded-xl p-3 hover:shadow-sm cursor-pointer transition-all flex items-center gap-3 group"
            data-category="${t.name}">
            <div style="background-color: ${style.iconBg};"
              class="text-white w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 shadow-sm">
              <i class="fa-solid ${style.icon} text-sm"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900">${t.name}</h3>
            </div>
          </div>
        `;
      });
      categoriesGrid.innerHTML = temp;
    }
  } catch (error) {
    console.error("Error fetching categories data:", error);
  }
}
/*load meal by name*/
window.filterByMealType = async function (t) {
  const apiUrl = `https://nutriplan-api.vercel.app/api/meals/filter?category=${t}&page=1&limit=20`;
  recipesGrid.innerHTML =
    '<p class="text-gray-500 col-span-full text-center">Loading all recipes...</p>';

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.message === "success" && data.results.length > 0) {
      recipesCount.innerHTML = `Showing ${data.results.length} ${t} recipes`;
      // Save results to global array for clicking
      currentMeals = data.results;

      let card = "";
      data.results.forEach((meal) => {
        card += getCard(meal);
      });
      recipesGrid.innerHTML = card;
      // Bind click events after elements exist in DOM
      getSelectedMeal(data.results);
    } else {
      currentMeals = [];
      recipesCount.innerHTML = "Showing 0 recipes";
      recipesGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <p class="text-gray-500 text-base font-medium">No recipes found. Try a different search term.</p>
        </div>
      `;
    }
  } catch (error) {
    currentMeals = [];
    console.error("Error fetching all recipes:", error);
    recipesCount.innerHTML = "Showing 0 recipes";
    recipesGrid.innerHTML =
      '<p class="text-red-500 col-span-full text-center">Failed to load recipes.</p>';
  }
};

/* grid & list view */
document.addEventListener("DOMContentLoaded", () => {
  listViewBtn.addEventListener("click", () => {
    recipesGrid.className =
      "w-full grid grid-cols-1 md:grid-cols-2 gap-5 is-list-view";
    // active btn list
    listViewBtn.className = "px-3 py-1.5 bg-white rounded-md shadow-sm";
    listViewBtn.querySelector("i").className = "fa-solid fa-list text-gray-700";
    gridViewBtn.className = "px-3 py-1.5";
    gridViewBtn.querySelector("i").className =
      "fa-solid fa-table-cells text-gray-500";
  });
  gridViewBtn.addEventListener("click", () => {
    recipesGrid.className =
      "w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5";
    // active btn grid
    gridViewBtn.className = "px-3 py-1.5 bg-white rounded-md shadow-sm";
    gridViewBtn.querySelector("i").className =
      "fa-solid fa-table-cells text-gray-700";
    listViewBtn.className = "px-3 py-1.5";
    listViewBtn.querySelector("i").className = "fa-solid fa-list text-gray-500";
  });
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      // history.pushState({ section: 'home' }, '', '/home');
      history.pushState({ section: 'home' }, '', '/index.html');
      switchPage(false);
    });
  }
});

// -----------------------------------------------------
/* meal details part */
window.displayMealInfo = function (meal) {
  switchPage("meal-details");
  getMealInfo(meal);
};
// window.addEventListener("popstate", (event) => {
//   const currentPath = window.location.pathname;
//   if (currentPath.includes("/meal/") && event.state?.meal) {
//     switchPage(true);
//     getMealInfo(event.state.meal);
//   } else {
//     switchPage(false);
//   }
// });
navHome.addEventListener("click", (e) => {
  e.preventDefault();       // Prevents full page reload
  switchPage("home");   // Displays #products-view section and updates URL
});

navProducts.addEventListener("click", (e) => {
  e.preventDefault();       // Prevents full page reload
  switchPage("products");   // Displays #products-view section and updates URL
});

navFood.addEventListener("click", (e) => {
  e.preventDefault();       // Prevents full page reload
  switchPage("food-log");   // Displays #products-view section and updates URL
});

// 2. Handle Browser Back/Forward Buttons
// window.addEventListener("hashchange", () => {
//   const currentRoute = window.location.hash.replace("#/", "");
//   switchPage(currentRoute || "home");
// });

window.addEventListener("hashchange", () => {
  const hash = window.location.hash.replace("#/", ""); 
  if (hash.startsWith("meal/")) {
    const mName = hash.replace("meal/", "");
    switchPage("meal-details", mName);
  } else if (hash === "products") {
    switchPage("products");
  } else if (hash === "food-log") {
    switchPage("food-log");
  } else {
    switchPage("home");
  }
});
// 3. Keep current page on initial load or refresh
window.addEventListener("DOMContentLoaded", () => {
  const initialRoute = window.location.hash.replace("#/", "");
  switchPage(initialRoute || "home");
});
