app = angular.module('dormeeApp');

app.component('getOwnerRentRequests', {
    templateUrl: 'components/getOwnerRentRequests/getOwnerRentRequests.template.html',
    controller: function(env, $http, $mdToast, $stateParams) {
        let self = this;

        self.getRequests =
            function() {
                $http({
                    method: 'GET',
                    url: env.apiUrl + '/rentRequest/viewRequests/' + $stateParams.id,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(function(successCallback) {
                    self.requests = successCallback.data;
                }, function(errorCallback) {
                    self.showToast(errorCallback.data); // check it
                });
            };

        self.accept =
            function(id) {
                $http({
                    method: 'PUT',
                    url: env.apiUrl + '/rentRequest/updateStatus/accept/' + id,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(function(successCallback) {
                    self.getRequests();
                    self.showToast('The request is accepted');
                    $state.go('userDashboard');
                }, function(errorCallback) {
                    self.showToast(errorCallback.data); // check it
                });
            };

        self.reject =
            function(id) {
                $http({
                    method: 'PUT',
                    url: env.apiUrl + '/rentRequest/updateStatus/reject/' + id,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(function(successCallback) {
                    self.getRequests();
                    self.showToast('The request is rejected');
                }, function(errorCallback) {
                    self.showToast(errorCallback.data); // check it
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
            self.getRequests();
        };
    },
});
