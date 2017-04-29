app = angular.module('dormeeApp');

app.component('verifyList', {
    templateUrl: 'components/verifyList/verifyList.template.html',
    controller: function(env, $http, $state, $mdToast) {
        let self = this;

        self.getUsers =
            function() {
                $http({
                    method: 'GET',
                    url: env.apiUrl + '/users/verify',
                }).then(function successCallback(response) {
                    self.list = response.data;
                }, function errorCallback(response) {
                    self.showToast('an error has occured');
                });
            };

        self.accept =
            function(id) {
                $http({
                    method: 'PUT',
                    url: env.apiUrl + '/users/verify/accept/' + id,
                }).then(function successCallback(response) {
                    self.getUsers();
                    self.showToast('user accepted');
                }, function errorCallback(response) {
                    self.showToast('an error has occured');
                });
            };

        self.reject =
            function(id) {
                $http({
                    method: 'PUT',
                    url: env.apiUrl + '/users/verify/reject/' + id,
                }).then(function successCallback(response) {
                    self.getUsers();
                    self.showToast('user rejected');
                }, function errorCallback(response) {
                    self.showToast('an error has occured');
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
        self.$onInit = function() {
            self.getUsers();
        };
    },
});
