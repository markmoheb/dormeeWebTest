angular.module('dormeeApp').
    component('paymentInfo', {

        templateUrl: 'components/payment-info/payment-info.template.html',
        controller: function PaymentController(env, $http, $mdToast, $state) {
            let self = this;

            self.showToast = function(message) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .hideDelay(3000)
                        .position('top right')
                );
            };

            this.getUser = () => {
                $http({
                    method: 'GET',
                    url: env.apiUrl + '/users/profile',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((response) => {
                    this.user = response.data;
                    if (this.user.payment_info)
                        this.payment = true;
                    else
                        this.noPayment = true;
                });
            };

            this.addPaymentInfo = () => {
                let url = env.apiUrl + '/owners/addPaymentInfo';

                $http({
                    method: 'PUT',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: this.user.payment_info,
                }).then((response) => {
                    self.showToast('User payment updated!');
                    $state.go('ownerDashboard');
                });
            };
        },
    });
