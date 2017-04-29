angular.module('dormeeApp').
component('profileUpdate', {

    templateUrl: 'components/profile-update/profile-update.template.html',
    controller: function ProfileUpdateController(env, $http, $mdToast, $state) {
        let self = this;
        let url = env.apiUrl + '/users/profile';

        self.error = {};

        self.showToast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(message)
                .hideDelay(3000)
                .position('top right')
            );
        };

        this.getUser = () => {
            self.isUserNameTaken = false;
            self.isEmailTaken = false;

            $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(function successCallback(response) {
                self.user = response.data;
                self.isStudent = self.user.role === 'student';
                self.isOwner = self.user.role === 'owner';
                if (self.user.birthdate)
                    self.date = new Date(self.user.birthdate);
            }, function errorCallback(response) {
                self.showToast('an error has occured');
            });
        };


        this.update = () => {
            this.user.birthdate = moment(this.date).toISOString();

            $http({
                method: 'PUT',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: self.user,
            }).then((response) => {
                    console.log(response.data);
                    self.showToast('User successfully updated!');
                    $state.go('userDashboard');
                },
                (err) => {
                    // console.log(err);

                    if (err.data.error) {
                        if (err.data.error.indexOf('email') > -1) {
                            self.takenEmail = self.user.email;
                            self.isEmailTaken = true;
                            self.error.email = 'Email is already taken, please try another.';
                            self.profileUpdate.email.$error.validationError = true;
                            self.profileUpdate.email.$invalid = true;
                            console.log(self.error.email);
                            self.showToast('User updated except for email.');
                        }

                        if (err.data.error.indexOf('username') > -1) {
                            self.takenUsername = self.user.username;
                            self.isUserNameTaken = true;
                            self.error.username = 'Username is already taken, please try another.';
                            self.profileUpdate.username.$error.validationError = true;
                            self.profileUpdate.username.$invalid = true;
                            console.log(self.error.username);
                            self.showToast('User updated except for username.');
                        }
                    }
                    console.log(response.data);
                    self.showToast('User successfully updated!');
                    $state.go('ownerDashboard');
                },
                (err) => {
                    if (err.data.error) {
                        if (err.data.error.indexOf('email') > -1) {
                            self.takenEmail = self.user.email;
                            self.isEmailTaken = true;
                            self.error.email = 'Email is already taken, please try another.';
                            self.profileUpdate.email.$error.validationError = true;
                            self.profileUpdate.email.$invalid = true;
                            console.log(self.error.email);
                        }

                        if (err.data.error.indexOf('username') > -1) {
                            self.takenUsername = self.user.username;
                            self.isUserNameTaken = true;
                            self.error.username = 'Username is already taken, please try another.';
                            self.profileUpdate.username.$error.validationError = true;
                            self.profileUpdate.username.$invalid = true;
                            console.log(self.error.username);
                        }
                    }
                }
            );
        };

        this.changeUsername = () => {
            self.profileUpdate.username.$error.validationError = false;
            self.profileUpdate.username.$invalid = true;
            self.isUserNameTaken = (self.takenUsername) ? (self.user.username === self.takenUsername) : false;
        };

        this.changeEmail = () => {
            self.profileUpdate.email.$error.validationError = false;
            self.profileUpdate.email.$invalid = true;
            self.isEmailTaken = (self.takenEmail) ? (self.user.email === self.takenEmail) : false;
        };
    },
});
