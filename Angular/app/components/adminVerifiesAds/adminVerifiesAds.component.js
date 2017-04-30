app = angular.module('dormeeApp');

app.component('adminVerifiesAds', {
    templateUrl: 'components/adminVerifiesAds/adminVerifiesAds.template.html',
    controller: function(env, $http, $mdToast) {
        let self = this;

        self.unverifiedApartments = function() {
            $http({
                method: 'GET',
                url: env.apiUrl + '/rentables/unverifiedApartments',
            }).then(function successCallback(response) {
                self.apartments = response.data;
            }, function errorCallback(response) {
                self.showToast('an error has occured');
            });
        };

        self.unverifiedRooms = function() {
            $http({
                method: 'GET',
                url: env.apiUrl + '/rentables//unverifiedRooms',
            }).then(function successCallback(response) {
                self.rooms = response.data;
            }, function errorCallback(response) {
                self.showToast('an error has occured');
            });
        };

        self.verifyApartment = (id) => {
            let url = env.apiUrl + '/rentables/verifyAd/' + id;
            $http({
                method: 'PUT',
                url: url,
            }).then(function successCallback(response) {
                self.unverifiedApartments();
                self.showToast('apartment verified');
            }, function errorCallback(response) {
                self.showToast('an error has occured');
            });
        };

        self.verifyRoom = (id) => {
            let url = env.apiUrl + '/rentables/verifyAd/' + id;
            $http({
                method: 'PUT',
                url: url,
            }).then(function successCallback(response) {
                self.unverifiedRooms();
                self.showToast('room verified');
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
            self.unverifiedApartments();
            self.unverifiedRooms();
        };
    },
});
