angular.module('dormeeApp').
component('rentablesFilter', {

    templateUrl: 'views/rentablesFilter/rentablesFilter.template.html',
    controller: function(env, $http) {
        let self = this;
        self.apiUrl = env.apiUrl;

        self.slider = {
            min: 1000,
            max: 5000,
            options: {
                floor: 0,
                ceil: 10000,
            },
        };

        self.search = () => {
            let url = env.apiUrl + '/rentables/filter?';

            if (self.district && self.district.length > 0)
                url += 'dis=' + self.district;

            if (self.rating)
                url += '&rat=' + self.rating;

            if (self.slider.min && self.slider.max)
                url += '&pl=' + self.slider.min + '&ph=' + self.slider.max;

            roomsURL = url + '&type=' + 'Room';
            apartmentsURL = url + '&type=' + 'Apartment';

            let roomsRequest = {
                method: 'GET',
                url: roomsURL,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            let apartmentsRequest = {
                method: 'GET',
                url: apartmentsURL,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            $http(roomsRequest).then(function(response) {
                self.rooms = response.data;

                $http(apartmentsRequest).then(function(response) {
                    self.apartments = response.data;
                });
            });
        };
        self.$onInit = function() {
            self.search();
        };
    },
});