app = angular.module('dormeeApp');

app.component('rentable', {
    templateUrl: 'components/rentable/rentable.template.html',
    controller: function(env, $http, $stateParams) {
        let self = this;

        let request = {
            method: 'GET',
            url: env.apiUrl + '/rentables/' + $stateParams.id,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $http(request).then(function(response) {
            console.log(response.data);
            self.rentable = response.data;
            self.apiUrl = env.apiUrl;
        });
    },
})
    ;
