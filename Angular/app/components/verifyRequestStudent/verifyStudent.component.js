app = angular.module('dormeeApp');

app.component('verifyStudent', {
    templateUrl: 'components/verifyRequestStudent/verifyStudent.template.html',
    controller: function(env, $http, Upload, $timeout, $state, $mdToast) {
        let self = this;

        self.upload = function(file) {
            const university = self.verifyStudent.university.$modelValue;
            const universityEmail = self.verifyStudent.universityEmail.$modelValue;

            Upload.upload({
                method: 'POST',
                url: env.apiUrl + '/users/verify/student/request/',
                data: {
                    img: file,
                    university: university,
                    universityEmail: universityEmail,
                },
            }).then(function successCallback(response) {
                self.showToast('request placed');
                $state.go('home');
            }, function errorCallback(response) {
                self.showToast('an error has occured');
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
