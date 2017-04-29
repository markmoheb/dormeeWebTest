app = angular.module('dormeeApp');

app.component('getOwnerRentables', {
    templateUrl: 'components/getOwnerRentables/getOwnerRentables.template.html',
    controller: function(env, $http) {
        let self = this;

        self.ownerApartments = function() {
            $http({
                method: 'GET',
                url: env.apiUrl + '/rentables/ownerApartments',
            }).then(function(response) {
                self.apartments = response.data;
                console.log(response.data);
            });
        };


        self.ownerRooms = function() {
            $http({
                method: 'GET',
                url: env.apiUrl + '/rentables/ownerRooms',
            }).then(function(response) {
                self.rooms = response.data;
                console.log(response.data);
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
                console.log('DELETED');
                self.ownerApartments();
            });
        };

        self.deleteRoom = (id) => {
            let url = env.apiUrl + '/rentables/' + id;

            $http({
                method: 'DELETE',
                url: url,
            }).then((response) => {
                console.log('DELETED');
                self.ownerRooms();
            });
        };
    },
});
