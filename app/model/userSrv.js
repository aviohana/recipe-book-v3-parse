
app.factory("user", function ($q, $http) {

    var activeUser = null;
    // new User( {
    //     "id": 1,
    //     "fname": "Nir",
    //     "lname": "Channes",
    //     "email": "nir@nir.com",
    //     "pwd": "123"
    // });

    // function User(plainUser) {
    //     this.id = plainUser.id;
    //     this.fname = plainUser.fname;
    //     this.lname = plainUser.lname;
    //     this.email = plainUser.email;
    //     this.pwd = plainUser.pwd;
    // }

    function login(email, pwd) {
        var async = $q.defer();

        // Pass the username and password to logIn function
        Parse.User.logIn(email, pwd).then(function(user) {
            // Do stuff after successful login
            console.log(user);
            activeUser = user;
            async.resolve(activeUser);
        }).catch(function(error) {
            console.error(error);
            async.reject("invalid email or password")
        })

        return async.promise;
    }

    function isLoggedIn() {
        return activeUser ? true : false;
    }

    function logout() {
        activeUser = null;
    }

    function getActiveUser() {
        return activeUser;
    }

    return {
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout,
        getActiveUser: getActiveUser
    }
})