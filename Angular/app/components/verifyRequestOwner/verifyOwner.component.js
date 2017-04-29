app = angular.module('dormeeApp');

app.component('verifyOwner', {
    templateUrl: 'components/verifyRequestOwner/verifyOwner.template.html',
    controller: function(env, $http, Upload, $timeout, $mdToast, $state) {
        let self = this;

        self.upload = function(file) {
            Upload.upload({
                method: 'POST',
                url: env.apiUrl + '/users/verify/owner/request/',
                data: {
                    img: file,
                },
            }).then(function successCallback(response) {
                self.showToast('request placed');
                $state.go('home');
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
    },
});
