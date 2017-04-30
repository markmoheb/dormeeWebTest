app = angular.module('dormeeApp');

app.component('rentable', {
    templateUrl: 'components/rentable/rentable.template.html',
    controller: function(env, $http, $stateParams, $mdToast) {
        let self = this;
        self.apiUrl = env.apiUrl;
      
        $http({
            method: 'GET',
            url: env.apiUrl + '/rentables/' + $stateParams.id,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(function(response) {
            self.rentable = response.data;
        });

        self.getOwnerRentables = function() {
            $http({
                method: 'GET',
                url: env.apiUrl + '/rentables/ownerRentables',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(function(successCallback) {
                let ownerRentables = [];

                for (i = 0; i < successCallback.data.length; i++) {
                    ownerRentables.push(successCallback.data[i]._id);
                }

                self.ownerRentables = ownerRentables;
            }, function(errorCallback) {
                self.showToast(errorCallback.data.message);
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
            self.getOwnerRentables();
        };
    },
});
