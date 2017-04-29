app = angular.module('dormeeApp');

app.component('register', {
    templateUrl: 'components/register/register.template.html',
    controller: function(env, $http, $state, $mdToast) {
        let self = this;

        self.showToast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .position('top right')
            ).then(function() {

            }, function() {

            });
        };

        self.register = () => {
            if (self.data.password !== self.data.password2) {
                self.showToast('passwords did not match');
            } else {
                $http({
                    method: 'POST',
                    url: env.apiUrl + '/auth/register',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: self.data,
                }).then(function(successCallback) {
                    if (successCallback.status == 200) {
                        self.showToast('Registered Successfully');
                        $state.go('login');
                    }
                }, function(errorCallback) {
                    if (errorCallback.status == 400) {
                        self.showToast(errorCallback.data.error);
                    }
                });
            }
        };
    },
});
