app = angular.module('dormeeApp');

app.component('viewRentRequest', {
    templateUrl: 'components/viewRentRequests/viewRentRequest.template.html',
    controller: function(env, $http, $mdToast, $state) {
        let self = this;
        let rentRequestId = 0;
        let rentPrice = 0;
        self.apiUrl = env.apiUrl;

        let handler = StripeCheckout.configure({
            key: 'pk_test_VN6FYFcqrnBOzuslAsMjH01H',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function(token) {
                $http({
                    method: 'POST',
                    url: env.apiUrl + '/transactions/charge',
                    data: {
                        stripeToken: token.id,
                        rentRequestId: rentRequestId,
                        amount: rentPrice,
                        currency: 'EGP',
                        description: 'Pay your Rent',
                    },
                }).then(function successCallback(response) {
                    self.getRequests;
                    self.showToast('Successfully Paid!');
                }, function errorCallback(response) {
                    self.showToast('Error with Transaction, please contact Support');
                });
            },
        });

        self.getRequests =
            function() {
                $http({
                    method: 'GET',
                    url: env.apiUrl + '/rentRequest',
                }).then(function successCallback(response) {
                    self.list = response.data;
                }, function errorCallback(response) {
                    self.showToast('an error has occured');
                });
            };

        self.pay =
            function(status, rentRequest_Id, rent_Price, duration, vacant) {
                if (vacant == 'false')
                    self.showToast('Not Vacant');
                else if (status == 'Pending_Acceptance')
                    self.showToast('Your request is still being processed');
                else if (status == 'Rejected')
                    self.showToast('Your request has been rejected');
                else {
                    rentRequestId = rentRequest_Id;
                    rentPrice = rent_Price * duration;
                    handler.open({
                        name: 'Dormee',
                        description: 'Pay your rent',
                        currency: 'EGP',
                        amount: rentPrice * 100,
                    });
                    window.addEventListener('popstate', function() {
                        handler.close();
                    });
                }
            };

        self.cancel =
            function(id) {
                $http({
                    method: 'DELETE',
                    url: env.apiUrl + '/rentRequest/removeRentRequest/' + id,
                }).then(function(response) {
                    self.showToast('Your Request has been deleted');
                    self.apiUrl = env.apiUrl;
                    self.getRequests();
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