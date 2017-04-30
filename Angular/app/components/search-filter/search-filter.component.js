angular.module('dormeeApp').
    component('searchFilter', {

        templateUrl: 'components/search-filter/search-filter.template.html',
        controller: function SearchFilterController($http) {
            let self = this;

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

                // console.log(self.slider.min);
                // console.log(self.slider.max);

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
