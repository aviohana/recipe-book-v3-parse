
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

        return async.promise;
    }


    function createRecipe(name, description, ingredients, steps, imgUrl) {
        var async = $q.defer();


        const RecipeParse = Parse.Object.extend('Recipe');
        const myNewObject = new RecipeParse();

        myNewObject.set('name', name);
        myNewObject.set('description', description);
        myNewObject.set('ingredients', ingredients);
        myNewObject.set('steps', steps);
        myNewObject.set('imgUrl', "https://lh3.googleusercontent.com/LtmDMUc_7YPiS5lq42pa3Ghhno0kDmXGJpvojNxSWkfbHbR4f8vaPcaYrjoQPJUetUan7Vmb48AJFrYwjR-4vg8IUQDeCwF016ibRjwl=w600-l68");
        //myNewObject.set('image', new Parse.File("resume.txt", { base64: btoa("My file content") }));
        myNewObject.set('userId', user.getActiveUser());

        myNewObject.save().then(
            function(result) {
                console.log(result);
                async.resolve();
            },
            function(error) {
                console.error(error);
                async.reject(error);
            }
        );


        return async.promise;
    }


    return {
        getActiveUserRecipes: getActiveUserRecipes,
        createRecipe: createRecipe
    }
})