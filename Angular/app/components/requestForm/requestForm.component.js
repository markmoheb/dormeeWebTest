app = angular.module('dormeeApp');

app.component('requestForm', {
    templateUrl: 'components/requestForm/requestForm.template.html',
    controller: function(env, $http, $mdToast, $stateParams, $state) {
        let self = this;
        let rentableId = $stateParams.id;

        self.currentDate = new Date();

        self.request = function() {
            const duration = self.requestForm.duration.$modelValue;
            const date = self.requestForm.date.$modelValue;

            $http({
                method: 'POST',
                url: env.apiUrl + '/rentRequest/reserve',
                data: {
                    duration: duration,
                    request_date: date,
                    rentable_id: rentableId,
                },
            }).then(function successCallback(response) {
                self.showToast('Done');
                $state.go('rentables');
            }, function errorCallback(response) {
                console.log(response);
                if (response.data.message)
                    self.showToast(response.data.message);
                else {
                    self.showToast('an error has occured');
                }
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
    },
});
