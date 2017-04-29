app = angular.module('dormeeApp');

app.component('logout', {
  templateUrl: 'components/logout/logout.template.html',
  controller: function($http, $mdToast, $state) {
    let self = this;

    self.logOut = () => {
      localStorage.setItem('JWT', '');
      self.showToast('logout successful');
      $state.go('login', {}, {reload: true});
    };

    self.showToast = function(message) {
      $mdToast.show(
        $mdToast.simple()
        .textContent(message)
        .hideDelay(3000)
        .position('top right')
      );
    };
  },
});
