// =========== Loading Spinner Design ============
/*
<div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
</div>
*/

// =========== Empty State Design ============
/*
<div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
    </div>
    <p class="text-gray-500 text-lg">No recipes found</p>
    <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
</div>
*/
// -------------meal view part------------------------------------
let homeView = document.getElementById("main-content");
let productsView = document.getElementById("products-section");
let foodlogView  = document.getElementById("foodlog-section");
let mealView = document.getElementById("meal-details");
/**
 * Switches current active section and updates browser history URL
 * @param {string} viewName - "home" | "products" | "food-log" | "meal-details"
 * @param {string} [mName] - Optional dynamic slug (e.g. "baked-salmon")
 */
// ----------------------------------------------------------------
let backBtn = document.getElementById("back-to-meals-btn");
// ---------------------------------------
let heroImage = document.getElementById("detail-hero-image");
let heroTitle = document.getElementById("detail-title");
let tagContainer = document.getElementById("tag-container");
let ingredientsList = document.getElementById("ingredients-list");
let countIngredients = document.getElementById("count-ingredients");
let instructionsList = document.getElementById("instructions-list");
let videoCard = document.getElementById("video-card");
let videoWrapper = document.getElementById("video-wrapper");
let videoSrc = document.getElementById("video-src");
// ---------------------------------------
let heroServings = document.getElementById("hero-servings");
let heroCalories = document.getElementById("hero-calories");
let totalCalPerSvc = document.getElementById("total-cal-per-svc");
let totalCal = document.getElementById("total-cal");
let nutritionStatistics = document.getElementById("nutrition-statistics");
let cholesterolPer = document.getElementById("cholesterol-per");
let sodiumPer = document.getElementById("sodium-per");
let otherFacts = document.getElementById("other-facts");
/* redirect to meal details */
export function generateUrl(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}
export function getSelectedMeal(currentMeals) {
  const cards = document.querySelectorAll(".recipe-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const mealId = card.getAttribute("data-meal-id");
      const selectedMeal = currentMeals.find((m) => m.id === mealId);
      if (selectedMeal) {
        localStorage.setItem("selectedMeal", JSON.stringify(selectedMeal));
        console.log("meal id is :", mealId);
        // console.log("meal details :", selectedMeal);
        displayMealInfo(selectedMeal);

        const mName = selectedMeal.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9 -]/g, "") 
          .replace(/\s+/g, "-");     
        switchPage("meal-details", mName);

      }
    });
  });
}
export function switchPage(viewName, mName = "") {
  if (homeView) homeView.classList.add("hidden");
  if (productsView) productsView.classList.add("hidden");
  if (foodlogView ) foodlogView .classList.add("hidden");
  if (mealView) mealView.classList.add("hidden");
  switch (viewName) {
    case "products":
      if (productsView) productsView.classList.remove("hidden");
      window.location.hash = "#/products";
      break;
    case "food-log":
      if (foodlogView ) foodlogView .classList.remove("hidden");
      window.location.hash = "#/food-log";
      break;
    case "meal-details":
      if (mealView) mealView.classList.remove("hidden");
      window.location.hash = mName ? `#/meal/${mName}` : "#/meal";
      break;
    case "home":
    default:
      if (homeView) homeView.classList.remove("hidden");
      window.location.hash = "#/home";
      break;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
export function getMealInfo(meal) {
  heroImage.src =
    meal.thumbnail ||
    "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg";
  heroImage.alt = meal.name || "meal image";
  heroTitle.innerHTML = meal.name || "meal";
  let videoId =
    meal.youtube && meal.youtube.trim() !== ""
      ? meal.youtube.match(
          /(?:shorts\/|youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
        )?.[1]
      : null;
  if (videoId) {
    // YouTube video exists
    videoSrc.src = `https://www.youtube.com/embed/${videoId}`;
    videoCard.classList.remove("hidden");
  } else if (meal.source && meal.source.trim() !== "") {
    // No YouTube video, but external source URL exists
    videoCard.classList.remove("hidden");
    videoWrapper.innerHTML = `
    <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-50 border border-gray-200 rounded-xl">
      <p class="text-gray-600 mb-4 font-medium">No video tutorial available for this meal.</p>
      <a href="${meal.source}" target="_blank" rel="noopener noreferrer" 
         class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm">
         <span>View Original Recipe Source</span>
         <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
      </a>
    </div>
  `;
  } else {
    videoCard.classList.add("hidden");
  }
  let temp = "";
  if (Array.isArray(meal.tags) && meal.tags.length > 0) {
    for (let i = 0; i < meal.tags.length; i++) {
      const currentTag = meal.tags[i];
      temp += `
          <span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${currentTag}</span>
        `;
    }
  }
  tagContainer.innerHTML = `
      <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.category ?? "General"}</span>
      <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.area ?? "International"}</span>
      ${temp}
    `;

  ingredientsList.innerHTML = meal.ingredients
    .map(
      (item) => `
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
    <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
    <span class="text-gray-700">
      <span class="font-medium text-gray-900">${item.measure}</span> ${item.ingredient}
    </span>
    </div>`,
    )
    .join("");
  countIngredients.innerHTML = ` ${meal.ingredients.length} items`;
  instructionsList.innerHTML = meal.instructions
    .map(
      (text, index) =>
        `<div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
        ${index + 1}
      </div>
      <p class="text-gray-700 leading-relaxed pt-2"> ${text} </p>
    </div>`,
    )
    .join("");

  let recipeName = meal.name || "Recipe";
  let ingredients = meal.ingredients.map((item) =>
    `${item.measure || ""} ${item.ingredient || ""}`.trim(),
  );

  getNutritionData(recipeName, ingredients);
}
async function getNutritionData(mealName, ingredientsList) {
  const apiKey = "EyeG9N4N21WBPaXNQMiiiuyx87vur4z4JGsQ2yt3";
  const url = `https://nutriplan-api.vercel.app/api/nutrition/analyze?x-api-key=${apiKey}`;
  const payload = {
    recipeName: mealName,
    ingredients: ingredientsList,
  };
  // console.log("Sending Payload:", payload);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": "EyeG9N4N21WBPaXNQMiiiuyx87vur4z4JGsQ2yt3",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const result = await response.json();
    if (result.success) {
      console.log("Nutrition Data Received:", result.data);
      // Pass result.data to your UI update function here:
      updateNutritionUI(result.data);
      return result.data;
    }
  } catch (error) {
    console.error("Failed to fetch nutrition data:", error);
  }
}
export function updateNutritionUI(apidata) {
  if (!apidata) return;
  heroServings.innerHTML = `${apidata.servings} servings`;
  let servings = apidata.servings || 1;
  let totalCalories = apidata.totals?.calories || 0;
  let caloriesPerServing = Math.round(totalCalories / servings);
  heroCalories.innerHTML = `${caloriesPerServing} cal/serving`;
  totalCalPerSvc.innerHTML = caloriesPerServing;
  totalCal.innerHTML = `Total: ${apidata.totals.calories} cal`;

  nutritionStatistics.innerHTML = `
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
      <span class="text-gray-700">Protein</span>
    </div>
    <span class="font-bold text-gray-900">${apidata.perServing.protein}g</span>
  </div>
  <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div class="bg-emerald-500 h-2 rounded-full" style="width: ${apidata.perServing.protein}%"></div>
  </div>

  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-blue-500"></div>
      <span class="text-gray-700">Carbs</span>
    </div>
    <span class="font-bold text-gray-900">${apidata.perServing.carbs}g</span>
  </div>
  <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div class="bg-blue-500 h-2 rounded-full" style="width: ${apidata.perServing.carbs}%"></div>
  </div>

  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-purple-500"></div>
      <span class="text-gray-700">Fat</span>
    </div>
    <span class="font-bold text-gray-900">${apidata.perServing.fat}g</span>
  </div>
  <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div class="bg-purple-500 h-2 rounded-full" style="width: ${apidata.perServing.fat}%"></div>
  </div>

  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-orange-500"></div>
      <span class="text-gray-700">Fiber</span>
    </div>
    <span class="font-bold text-gray-900">${apidata.perServing.fiber}g</span>
  </div>
  <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div class="bg-orange-500 h-2 rounded-full" style="width: ${apidata.perServing.fiber}%"></div>
  </div>

  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-pink-500"></div>
      <span class="text-gray-700">Sugar</span>
    </div>
    <span class="font-bold text-gray-900">${apidata.perServing.sugar}g</span>
  </div>
  <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div class="bg-pink-500 h-2 rounded-full" style="width: ${apidata.perServing.sugar}%"></div>
  </div>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-red-500"></div>
      <span class="text-gray-700">Saturated Fat</span>
    </div>
    <span class="font-bold text-gray-900">${apidata.perServing.saturatedFat}g</span>
  </div>
  <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
    <div class="bg-red-500 h-2 rounded-full" style="width: ${apidata.perServing.saturatedFat}%"></div>
  </div>
  `;

  otherFacts.innerHTML = `<h3 class="text-sm font-semibold text-gray-900 mb-3">
    Other
  </h3>
  <div class="grid grid-cols-2 gap-4 text-sm">
    <div class="">
      <span class="text-gray-600">Cholesterol </span>
      <p class="font-medium"> ${apidata.perServing.cholesterol} mg </p>
    </div>
    <div class="">
      <span class="text-gray-600"> Sodium</span>
      <p class="font-medium"> ${apidata.perServing.sodium} mg </p>
    </div>
  </div>`;
}
