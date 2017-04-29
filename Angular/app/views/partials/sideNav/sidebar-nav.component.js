app = angular.module('dormeeApp');

app.component('sideBar', {
    templateUrl: 'views/partials/sideNav/sidebar-nav.html',
    controller: function(roleServie) {
        let self = this;

        self.isUser = function() {
            return roleServie.isUser();
        };
        self.isOwner = function() {
            return roleServie.isOwner();
        };
        self.isStudent = function() {
            return roleServie.isStudent();
        };
        self.isAdmin = function() {
            return roleServie.isAdmin();
        };

        self.$onInit = function() {
        };
    },
});
