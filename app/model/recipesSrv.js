
app.factory("recipes", function ($q, $http, user) {

    //var wasEverLoaded = {};

    function Recipe(id, name, description, ingredients, steps, imgUrl, userId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.steps = steps;
        this.imgUrl = imgUrl;
        this.userId = userId;
    }

    function getActiveUserRecipes() {
        var async = $q.defer();

        var recipes = [];

        const RecipeParse = Parse.Object.extend('Recipe');
        const query = new Parse.Query(RecipeParse);
        query.equalTo("userId", user.getActiveUser());
        query.find().then(function (results) {
            for (var i = 0; i < results.length; i++) {
                var recipe = new Recipe(results[i].get('objectId'),
                                        results[i].get('name'),
                                        results[i].get('description'),
                                        results[i].get('ingredients'),
                                        results[i].get('steps'),
                                        results[i].get('imgUrl'),
                                        results[i].get('userId'));
                recipes.push(recipe);
                async.resolve(recipes);
            }
        }, (error) => {
            console.error(error);
            async.reject(error);
        });


        // // This is a hack since we don't really have a persistant server.
        // // So I want to get all recipes only once.
        // if (wasEverLoaded[userId]) {
        //     async.resolve(recipes[userId]);
        // } else {
        //     recipes[userId] = [];
        //     var getRecipesURL = "http://my-json-server.typicode.com/nirch/recipe-book-v3/recipes?userId=" + userId;

        //     $http.get(getRecipesURL).then(function(response) {
        //         for (var i = 0; i < response.data.length; i++) {
        //             var recipe = new Recipe(response.data[i]);
        //             recipes[userId].push(recipe);
        //         }
        //         wasEverLoaded[userId] = true;
        //         async.resolve(recipes[userId]);
        //     }, function(error) {
        //         async.reject(error);
        //     });
        // }

        return async.promise;
    }


    function createRecipe(name, description, ingredients, steps, imgUrl) {
        var async = $q.defer();

        var userId = user.getActiveUser().id;

        var newRecipe = new Recipe({
            id: -1, name: name, description: description,
            ingredients: ingredients, steps: steps, imgUrl: imgUrl,
            userId: userId
        });

        // if working with real server:
        //$http.post("http://my-json-server.typicode.com/nirch/recipe-book-v3/recipes", newRecipe).then.....

        recipes[userId].push(newRecipe);
        async.resolve(newRecipe);

        return async.promise;
    }


    return {
        getActiveUserRecipes: getActiveUserRecipes,
        createRecipe: createRecipe
    }
})