document.addEventListener('DOMContentLoaded', function() {
    const ingredientsContainer = document.getElementById('ingredients-container');
    const instructionsContainer = document.getElementById('instructions-container');

    function addIngredientRow() {
        const row = document.createElement('div');
        row.className = 'dynamic-row';

        const qtyInput = document.createElement('input');
        qtyInput.type = 'text';
        qtyInput.className = 'ing-quantity';
        qtyInput.placeholder = 'Quantité (ex: 2 c.s.)';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'ing-name';
        nameInput.placeholder = 'Ingrédient';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-row';
        removeBtn.textContent = '✕';
        removeBtn.addEventListener('click', () => row.remove());

        row.appendChild(qtyInput);
        row.appendChild(nameInput);
        row.appendChild(removeBtn);
        ingredientsContainer.appendChild(row);
    }

    function addInstructionRow() {
        const row = document.createElement('div');
        row.className = 'dynamic-row';

        const textarea = document.createElement('textarea');
        textarea.className = 'instr-step';
        textarea.rows = 2;
        textarea.placeholder = "Décrivez l'étape";

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-row';
        removeBtn.textContent = '✕';
        removeBtn.addEventListener('click', () => row.remove());

        row.appendChild(textarea);
        row.appendChild(removeBtn);
        instructionsContainer.appendChild(row);
    }

    document.getElementById('add-ingredient').addEventListener('click', addIngredientRow);
    document.getElementById('add-instruction').addEventListener('click', addInstructionRow);

    // Une ligne de départ pour ne pas partir d'un formulaire vide
    addIngredientRow();
    addInstructionRow();

    document.getElementById('recipe-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const image = document.getElementById('image').value.trim();
        const prepTime = document.getElementById('prepTime').value.trim();
        const cookTime = document.getElementById('cookTime').value.trim();
        const totalTime = parseInt(document.getElementById('totalTime').value, 10) || 0;
        const servings = parseInt(document.getElementById('servings').value, 10) || 2;

        const ingredientRows = document.querySelectorAll('#ingredients-container .dynamic-row');
        const ingredients = [];
        ingredientRows.forEach(function(row) {
            const quantity = row.querySelector('.ing-quantity').value.trim();
            const name = row.querySelector('.ing-name').value.trim();
            if (name !== '') {
                ingredients.push({ quantity: quantity, name: name });
            }
        });

        const instructionRows = document.querySelectorAll('#instructions-container .dynamic-row');
        const instructions = [];
        instructionRows.forEach(function(row) {
            const step = row.querySelector('.instr-step').value.trim();
            if (step !== '') {
                instructions.push(step);
            }
        });

        if (!title || !image || ingredients.length === 0 || instructions.length === 0) {
            alert("Merci de remplir au moins le titre, l'image, un ingrédient et une étape.");
            return;
        }

        const recipe = {
            id: 'custom-' + Date.now(),
            title: title,
            description: description,
            image: image,
            prepTime: prepTime,
            cookTime: cookTime,
            totalTime: totalTime,
            servings: servings,
            ingredients: ingredients,
            instructions: instructions,
            nutrition: {
                kcal: document.getElementById('n-kcal').value.trim() || '-',
                lip: document.getElementById('n-lip').value.trim() || '-',
                glu: document.getElementById('n-glu').value.trim() || '-',
                pro: document.getElementById('n-pro').value.trim() || '-'
            }
        };

        const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
        customRecipes.push(recipe);
        localStorage.setItem('customRecipes', JSON.stringify(customRecipes));

        window.location.href = 'index.html';
    });
});
