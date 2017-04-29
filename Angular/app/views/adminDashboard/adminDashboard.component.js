app = angular.module('dormeeApp');

app.component('adminDashboard', {
    templateUrl: 'views/adminDashboard/adminDashboard.template.html',
    controller: function($http, $mdSidenav) {
        let self = this;

        self.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };

        self.$onInit = function() {
        };
    },
})
    ;
