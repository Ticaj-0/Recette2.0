document.addEventListener("DOMContentLoaded", function () {

    var recipesGrid = document.querySelector(".recipes-grid");
    var sortCriteria = document.getElementById("sort-criteria");
    var searchInput = document.getElementById("search-input");


    /*
    ==========================
    ETOILES
    ==========================
    */

    function updateStars(ratingElement, value) {

        var stars = ratingElement.querySelectorAll(".star");

        for (var i = 0; i < stars.length; i++) {

            var starValue = parseInt(
                stars[i].getAttribute("data-value")
            );

            if (starValue <= value) {
                stars[i].classList.add("filled");
            } else {
                stars[i].classList.remove("filled");
            }
        }
    }



    function updateRecipeRating(recipe, value) {

        recipe.setAttribute("data-rating", value);

        updateStars(
            recipe.querySelector(".rating"),
            value
        );


        localStorage.setItem(
            "rating-" + recipe.getAttribute("data-id"),
            value
        );

    }





    function setupStars() {

        var ratings = document.querySelectorAll(".rating");


        for (var i = 0; i < ratings.length; i++) {

            (function(rating){

                var recipe =
                    rating.closest(".recipe-card");


                if (!recipe) return;


                var stars =
                    rating.querySelectorAll(".star");


                var saved =
                    localStorage.getItem(
                        "rating-" +
                        recipe.getAttribute("data-id")
                    );


                if (saved === null) {
                    saved = recipe.getAttribute("data-rating") || 0;
                }


                recipe.setAttribute(
                    "data-rating",
                    saved
                );


                updateStars(
                    rating,
                    parseInt(saved)
                );



                for (var j = 0; j < stars.length; j++) {


                    stars[j].onclick = function(){


                        var value =
                            this.getAttribute(
                                "data-value"
                            );


                        var current =
                            recipe.getAttribute(
                                "data-rating"
                            );


                        if(value == current){
                            value = 0;
                        }


                        updateRecipeRating(
                            recipe,
                            value
                        );


                        sortRecipes(
                            sortCriteria.value
                        );

                    };



                    stars[j].onmouseover = function(){

                        updateStars(
                            rating,
                            this.getAttribute(
                                "data-value"
                            )
                        );

                    };



                    stars[j].onmouseout = function(){

                        updateStars(
                            rating,
                            recipe.getAttribute(
                                "data-rating"
                            )
                        );

                    };


                }


            })(ratings[i]);

        }

    }





    /*
    ==========================
    TRI
    ==========================
    */


    function sortRecipes(criteria){

        var recipes =
            Array.prototype.slice.call(
                recipesGrid.children
            );


        recipes.sort(function(a,b){


            if(criteria == "default"){
                return 0;
            }


            var aValue =
                parseInt(
                    a.getAttribute(
                        "data-" + criteria
                    )
                ) || 0;


            var bValue =
                parseInt(
                    b.getAttribute(
                        "data-" + criteria
                    )
                ) || 0;



            if(criteria == "rating"){
                return bValue - aValue;
            }


            return aValue - bValue;


        });



        for(var i=0;i<recipes.length;i++){

            recipesGrid.appendChild(
                recipes[i]
            );

        }

    }



    if(sortCriteria){

        sortCriteria.onchange=function(){

            sortRecipes(
                sortCriteria.value
            );

        };

    }





    /*
    ==========================
    RECHERCHE
    ==========================
    */


    if(searchInput){

        searchInput.oninput=function(){

            var term =
                searchInput.value.toLowerCase();


            var recipes =
                document.querySelectorAll(
                    ".recipe-card"
                );


            for(var i=0;i<recipes.length;i++){


                var title =
                    recipes[i]
                    .querySelector("h2")
                    .textContent
                    .toLowerCase();


                var description =
                    recipes[i]
                    .querySelector("p")
                    .textContent
                    .toLowerCase();



                if(
                    title.indexOf(term) !== -1 ||
                    description.indexOf(term) !== -1
                ){

                    recipes[i].style.display="";

                }else{

                    recipes[i].style.display="none";

                }

            }

        };

    }





    /*
    ==========================
    AJOUT RECETTES
    ==========================
    */


    var addButton =
        document.getElementById(
            "add-recipe-btn"
        );


    var form =
        document.getElementById(
            "recipe-form"
        );



    if(addButton && form){


        addButton.onclick=function(){

            form.style.display="block";

        };

    }




    var cancelButton =
        document.getElementById(
            "cancel-recipe"
        );


    if(cancelButton){

        cancelButton.onclick=function(){

            form.style.display="none";

        };

    }




    var saveButton =
        document.getElementById(
            "save-recipe"
        );



    if(saveButton){


        saveButton.onclick=function(){


            var recipe = {

                id: new Date().getTime(),

                title:
                document.getElementById(
                    "new-title"
                ).value,


                image:
                document.getElementById(
                    "new-image"
                ).value,


                time:
                document.getElementById(
                    "new-time"
                ).value,


                description:
                document.getElementById(
                    "new-description"
                ).value,


                rating:0

            };



            var saved =
                JSON.parse(
                    localStorage.getItem(
                        "recipes"
                    )
                ) || [];



            saved.push(recipe);



            localStorage.setItem(
                "recipes",
                JSON.stringify(saved)
            );



            location.reload();

        };

    }






    /*
    ==========================
    CHARGEMENT RECETTES AJOUTEES
    ==========================
    */


    function loadSavedRecipes(){


        var saved =
            JSON.parse(
                localStorage.getItem(
                    "recipes"
                )
            ) || [];



        for(var i=0;i<saved.length;i++){


            var recipe=saved[i];


            var card =
                document.createElement(
                    "div"
                );


            card.className =
                "recipe-card";


            card.setAttribute(
                "data-id",
                recipe.id
            );


            card.setAttribute(
                "data-rating",
                recipe.rating
            );


            card.setAttribute(
                "data-time",
                recipe.time
            );



            card.innerHTML =
            '<a href="Recette_1/index.html?id=' +               recipe.id + '">' +

            '<img src="' + recipe.image + '">' +

            '<div class="card-content">' +

            '<h2>' + recipe.title + '</h2>' +

            '<p><strong>Ingrédients:</strong> ' +
            recipe.description +
            '</p>' +

            '<div class="rating">' +

            '<span class="star" data-value="1">☆</span>' +
            '<span class="star" data-value="2">☆</span>' +
            '<span class="star" data-value="3">☆</span>' +
            '<span class="star" data-value="4">☆</span>' +
            '<span class="star" data-value="5">☆</span>' +

            '<span class="rating-text">🕓 ' +
            recipe.time +
            'min.</span>' +

            '</div></div></a>';



            recipesGrid.appendChild(card);

        }

    }





    loadSavedRecipes();

    setupStars();

    sortRecipes("default");


});
