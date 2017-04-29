app = angular.module('dormeeApp');

app.component('ownerDashboard', {
    templateUrl: 'views/ownerDashboard/ownerDashboard.template.html',
    controller: function(env, $http, $mdSidenav) {
        let self = this;

        let url = env.apiUrl + '/users/profile';

        self.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };

        self.$onInit = function() {
              $http({
                  method: 'GET',
                  url: url,
                  headers: {
                      'Content-Type': 'application/json',
                  },
              }).then((response) => {
                  self.user = response.data;

                  if (self.user.birthdate)
                    self.date = new Date(self.user.birthdate);
              });
        };
    },
});
