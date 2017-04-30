app = angular.module('dormeeApp');

app.component('viewTransactions', {
    templateUrl: 'components/viewTransactions/viewTransactions.template.html',
    controller: function(env, $http, $mdToast, $state) {
        let self = this;
        self.apiUrl = env.apiUrl;

        self.getTransactions =
            function() {
                $http({
                    method: 'GET',
                    url: env.apiUrl + '/transactions',
                }).then(function successCallback(response) {
                    console.log(response.data);
                    self.list = response.data;
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
            self.getTransactions();
        };
    },
});