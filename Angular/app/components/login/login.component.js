app = angular.module('dormeeApp');

app.component('login', {
    templateUrl: 'components/login/login.template.html',
    controller: function(env, $http, $mdToast, $state, authManager) {
        let self = this;

        self.logIn = () => {
            $http({
                method: 'POST',
                url: env.apiUrl + '/auth/login',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: self.data,
            }).then(function(successCallback) {
                if (successCallback.data.success == false) {
                    self.showToast(successCallback.data.message);
                } else {
                    self.showToast('You have been logged in !'); // check it
                    authManager.authenticate();
                    localStorage.setItem('JWT', successCallback.data.JWT);
                    $state.go('home', {}, {reload: true});
                }
            }, function(errorCallback) {
                if (errorCallback.status == 400) {
                    self.showToast(errorCallback.data); // check it
                }
            });
        };

        self.showToast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .hideDelay(3000)
                .position('top right')
            );
        };
    },
});
