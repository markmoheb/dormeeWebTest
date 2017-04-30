app = angular.module('dormeeApp');

app.component('userDashboard', {
    templateUrl: 'components/userDashboard/userDashboard.template.html',
    controller: function(env, $http) {
        let self = this;
        self.getUser = function() {
            $http({
                method: 'GET',
                url: env.apiUrl + '/users/profile',
            }).then(function successCallback(response) {
                self.user = response.data;
            }, function errorCallback(response) {
                self.showToast('an error has occured');
            });
        };
        self.$onInit = function() {
            self.getUser();
        };
    },
});
