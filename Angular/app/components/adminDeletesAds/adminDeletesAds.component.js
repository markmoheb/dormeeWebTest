app = angular.module('dormeeApp');

app.component('adminDeletesAds', {
    templateUrl: 'components/adminDeletesAds/adminDeletesAds.template.html',
    controller: function(env, $http, $mdToast) {
        let self = this;

        self.adminApartments = function() {
            $http({
                method: 'GET',
                url: env.apiUrl + '/rentables/apartments',
            }).then(function successCallback(response) {
                self.apartments = response.data;
            }, function errorCallback(response) {
                self.showToast('an error has occured');
            });
        };

        self.adminRooms = function() {
            $http({
                method: 'GET',
                url: env.apiUrl + 'rentables/rooms',
            }).then(function successCallback(response) {
                self.rooms = response.data;
            }, function errorCallback(response) {
                self.showToast('an error has occured');
            });
        };

        self.adminDeleteApartment = (id) => {
            let url = env.apiUrl + 'rentables/' + id;
            $http({
                method: 'DELETE',
                url: url,
            }).then(function successCallback(response) {
                self.adminApartments();
                self.showToast('apartment deleted');
            }, function errorCallback(response) {
                self.showToast('an error has occured');
            });
        };

        self.adminDeleteRoom = (id) => {
            let url = env.apiUrl + 'rentables/' + id;
            $http({
                method: 'DELETE',
                url: url,
            }).then(function successCallback(response) {
                self.adminRooms();
                self.showToast('room deleted');
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
            self.adminApartments();
            self.adminRooms();
        };
    },
});
