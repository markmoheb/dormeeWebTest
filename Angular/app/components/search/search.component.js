angular.module('dormeeApp').
component('search', {

    templateUrl: 'components/search/search.template.html',
    controller: function SearchController(env, $http) {
        let self = this;

        self.search = () => {
            let url = env.apiUrl + '/rentables/search?';

            if (self.query && self.query.length > 0)
                url += 'str=' + self.query;

                $http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((response) => {
                    self.rentables = response.data;
                });
            };
        },
    });

