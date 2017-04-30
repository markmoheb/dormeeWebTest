app = angular.module('dormeeApp');

app.component('getOwnerRentables', {
    templateUrl: 'components/getOwnerRentables/getOwnerRentables.template.html',
    controller: function(env, $http, $mdToast) {
        let self = this;

        self.showToast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .hideDelay(3000)
                .position('top right')
            );
        };

        self.ownerApartments = function() {
            $http({
                method: 'GET',
                url: env.apiUrl + '/rentables/ownerApartments',
            }).then(function(response) {
                self.apartments = response.data;
                self.showToast('response.data');
            });
        };


        self.ownerRooms = function() {
            $http({
                method: 'GET',
                url: env.apiUrl + '/rentables/ownerRooms',
            }).then(function(response) {
                self.rooms = response.data;
                self.showToast('response.data');
            });
        };

        self.ownerApartments();
        self.ownerRooms();


        self.deleteApartment = (id) => {
            let url = env.apiUrl + '/rentables/' + id;

            $http({
                method: 'DELETE',
                url: url,
            }).then((response) => {
                self.showToast('The room is DELETED');
                self.ownerApartments();
            });
        };

        self.deleteRoom = (id) => {
            let url = env.apiUrl + '/rentables/' + id;

            $http({
                method: 'DELETE',
                url: url,
            }).then((response) => {
                self.showToast('The room is DELETED');
                self.ownerRooms();
            });
        };
    },
});
