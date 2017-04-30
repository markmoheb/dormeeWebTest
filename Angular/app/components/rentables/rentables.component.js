app = angular.module('dormeeApp');

app.component('rentables', {
    templateUrl: 'components/rentables/rentables.template.html',
    controller: function(env, $http) {
        let self = this;
        self.apiUrl = env.apiUrl;

        let request = {
            method: 'GET',
            url: env.apiUrl + '/rentables/',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $http(request).then(function(response) {
            self.rentables = response.data;

            request = {
                method: 'GET',
                url: env.apiUrl + '/rentables/apartments',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            $http(request).then(function(response) {
                self.apartments = response.data;

                request = {
                    method: 'GET',
                    url: env.apiUrl + '/rentables/rooms',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                $http(request).then(function(response) {
                    self.rooms = response.data;
                });
            });
        });
    },
});
