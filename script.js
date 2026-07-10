document.addEventListener('DOMContentLoaded', function() {
    // --- Bouton "Ajouter une recette" ---
    const addRecipeBtn = document.getElementById('add-recipe-btn');
    if (addRecipeBtn) {
        addRecipeBtn.addEventListener('click', function() {
            window.location.href = 'ajouter-recette.html';
        });
    }

    const recipesGrid = document.querySelector('.recipes-grid');

    // Charge les recettes ajoutées par l'utilisateur depuis le localStorage
    function loadCustomRecipes() {
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');

        customRecipes.forEach(function(recipe) {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.setAttribute('data-id', recipe.id);
            card.setAttribute('data-rating', '0');
            card.setAttribute('data-time', recipe.totalTime || 0);

            const ingredientNames = recipe.ingredients.map(function(ing) {
                return ing.name;
            });
            const ingredientsPreview = ingredientNames.join(', ');

            const link = document.createElement('a');
            link.href = 'recette.html?id=' + recipe.id;

            const img = document.createElement('img');
            img.src = recipe.image;
            img.alt = recipe.title;

            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';

            const h2 = document.createElement('h2');
            h2.textContent = recipe.title;

            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Ingrédients: ';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(ingredientsPreview));

            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'rating';
            ratingDiv.setAttribute('data-rating', '0');
            ratingDiv.innerHTML =
                '<span class="star" data-value="1">☆</span>' +
                '<span class="star" data-value="2">☆</span>' +
                '<span class="star" data-value="3">☆</span>' +
                '<span class="star" data-value="4">☆</span>' +
                '<span class="star" data-value="5">☆</span>' +
                '<span class="rating-text">🕓️ ' + (recipe.totalTime || 0) + 'min.</span>';

            cardContent.appendChild(h2);
            cardContent.appendChild(p);
            cardContent.appendChild(ratingDiv);

            link.appendChild(img);
            link.appendChild(cardContent);

            card.appendChild(link);
            recipesGrid.appendChild(card);
        });
    }

    loadCustomRecipes();

    const recipes = Array.from(recipesGrid.children);
    const originalOrder = recipes.map(recipe => recipe);
    const sortCriteria = document.getElementById('sort-criteria');
    const searchInput = document.getElementById('search-input');

    const updateStars = (ratingElement, value) => {
        const stars = ratingElement.querySelectorAll('.star');
        stars.forEach(star => {
            star.classList.toggle('filled', parseInt(star.getAttribute('data-value'), 10) <= parseInt(value, 10));
        });
    };

    const updateRecipeRating = (recipe, ratingValue) => {
        recipe.setAttribute('data-rating', ratingValue);
        updateStars(recipe.querySelector('.rating'), ratingValue);
        localStorage.setItem(`rating-${recipe.getAttribute('data-id')}`, ratingValue);
    };

    const sortRecipes = (criteria) => {
        const sortedRecipes = criteria === 'default'
            ? [...originalOrder]
            : [...recipesGrid.children].sort((a, b) => {
                const aValue = parseInt(a.getAttribute(`data-${criteria}`), 10) || 0;
                const bValue = parseInt(b.getAttribute(`data-${criteria}`), 10) || 0;
                return criteria === 'rating' ? bValue - aValue : aValue - bValue;
            });
        recipesGrid.innerHTML = '';
        sortedRecipes.forEach(recipe => recipesGrid.appendChild(recipe));
    };

    const filterRecipes = (term) => {
        recipes.forEach(recipe => {
            const title = recipe.querySelector('h2').textContent.toLowerCase();
            const description = recipe.querySelector('p').textContent.toLowerCase();
            recipe.style.display = (title.includes(term) || description.includes(term)) ? '' : 'none';
        });
    };

    const setupStars = () => {
        document.querySelectorAll('.rating').forEach(rating => {
            const stars = rating.querySelectorAll('.star');
            stars.forEach(star => {
                const recipe = rating.closest('.recipe-card');
                const savedRating = localStorage.getItem(`rating-${recipe.getAttribute('data-id')}`) || rating.getAttribute('data-rating');
                recipe.setAttribute('data-rating', savedRating);
                updateStars(rating, savedRating);
                star.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const value = star.getAttribute('data-value');
                    const currentRating = recipe.getAttribute('data-rating');
                    updateRecipeRating(recipe, value === currentRating ? '0' : value);
                    sortRecipes(sortCriteria.value);
                });
                star.addEventListener('mouseover', () => {
                    updateStars(rating, star.getAttribute('data-value'));
                });
                star.addEventListener('mouseout', () => {
                    updateStars(rating, recipe.getAttribute('data-rating'));
                });
            });
        });
    };

    sortCriteria.addEventListener('change', () => sortRecipes(sortCriteria.value));
    searchInput.addEventListener('input', () => filterRecipes(searchInput.value.toLowerCase()));
    setupStars();
    sortRecipes('default');

    // Rafraîchit juste l'affichage des étoiles depuis le localStorage,
    // sans recharger toute la page (beaucoup plus rapide).
    function refreshRatings() {
        document.querySelectorAll('.recipe-card').forEach((card) => {
            const cardId = card.getAttribute('data-id');
            const savedRating = localStorage.getItem(`rating-${cardId}`) || '0';
            card.setAttribute('data-rating', savedRating);
            const ratingDiv = card.querySelector('.rating');
            if (ratingDiv) {
                updateStars(ratingDiv, savedRating);
            }
        });
        sortRecipes(sortCriteria.value);
    }

    // Quand on revient sur la page (via bouton précédent ou changement d'onglet),
    // on rafraîchit juste les données au lieu de tout recharger.
    window.addEventListener('pageshow', () => {
        refreshRatings();
    });
