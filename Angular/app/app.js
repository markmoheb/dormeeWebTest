let enviromentVariables = {};

// Import variables if present (from env.js)
if (window) {
    Object.assign(enviromentVariables, window.__env);
}

let app = angular.module('dormeeApp', ['ui.router.grant', 'angular-jwt', 'ui.router', 'ngMaterial', 'ngFileUpload', 'ngMessages', 'rzModule', 'oc.lazyLoad',
    'ncy-angular-breadcrumb', 'angular-loading-bar',
]);

app.config(['$httpProvider', 'jwtOptionsProvider', 'cfpLoadingBarProvider', '$mdAriaProvider', '$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$mdAriaProvider',
    function($httpProvider, jwtOptionsProvider, cfpLoadingBarProvider, $mdAriaProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider, $mdAriaProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 1;

        jwtOptionsProvider.config({
            authPrefix: 'JWT ',
            tokenGetter: [function() {
                return localStorage.getItem('JWT');
            }],
            whiteListedDomains: ['52.43.75.83', 'localhost'],
            unauthenticatedRedirectPath: '/login',
        });

        $httpProvider.interceptors.push('jwtInterceptor');

        $mdAriaProvider.disableWarnings();

        $mdThemingProvider.theme('default')
            .primaryPalette('blue', {
                'default': '800',
            })
            .accentPalette('blue', {
                'default': '800',
            });

        const verifyList = {
            name: 'verifyList',
            url: '/verifyList',
            template: '<verify-list></verify-list>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'admin', state: '401'});
                },
            },
        };

        const adminDeletesAds = {
            name: 'adminDeletesAds',
            url: '/admin/ads/delete',
            template: '<admin-deletes-ads></admin-deletes-ads>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'admin', state: '401'});
                },
            },
        };

        const adminVerifyAds = {
            name: 'adminVerifyAds',
            url: '/admin/ads/verify',
            template: '<admin-verifies-ads></admin-verifies-ads>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'admin', state: '401'});
                },
            },
        };

        const rentables = {
            name: 'rentables',
            url: '/rentables',
            template: '<rentables></rentables>',
        };

        const createRentable = {
            name: 'createRentable',
            url: '/rentable/upload',
            template: '<create-rentable></create-rentable>',
            resolve: {
                user: function(grant) {
                    return grant.only(
                        {test: 'owner', state: '401'}
                    );
                },
            },
        };
        const updateRentable = {
            name: 'updateRentable',
            url: '/rentable/edit/:id',
            template: '<update-rentable></update-rentable>',
            resolve: {
                user: function(grant) {
                    return grant.only(
                        {test: 'owner', state: '401'}
                    );
                },
            },
        };

        const rentable = {
            name: 'rentable',
            url: '/rentable/:id',
            template: '<rentable></rentable>',
        };

        const ownerDashboard = {
            name: 'ownerDashboard',
            url: '/owner',
            template: '<owner-dashboard></owner-dashboard>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'owner', state: '401'});
                },
            },
        };

        const profileUpdate = {
            name: 'profileUpdate',
            url: '/owner/profileUpdate',
            template: '<profile-update></profile-update>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'owner', state: '401'});
                },
            },
        };

        const addPaymentInfo = {
            name: 'paymentInfo',
            url: '/owner/paymentInfo',
            template: '<payment-info></payment-info>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'owner', state: '401'});
                },
            },
        };

        const ownerRentables = {
            name: 'ownerRentables',
            url: '/owner/myRentables',
            template: '<get-owner-rentables></get-owner-rentables>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'owner', state: '401'});
                },
            },
        };

        const rentRequests = {
            name: 'rentRequests',
            url: '/owner/rentRequests/:id',
            template: '<get-owner-rent-requests></get-owner-rent-requests>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'owner', state: '401'});
                },
            },
        };

        const register = {
            name: 'register',
            url: '/register',
            template: '<register></register>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'visitor', state: 'home'});
                },
            },
        };

        const login = {
            name: 'login',
            url: '/login',
            template: '<login></login>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'visitor', state: 'home'});
                },
            },
        };

        const four04 = {
            name: '404',
            url: '/404',
            templateUrl: 'views/404.html',
        };

        const four01 = {
            name: '401',
            url: '/401',
            templateUrl: 'views/401.html',
        };

        const rentablesFilter = {
            name: 'rentablesFilter',
            url: '/rentables/filter',
            template: '<rentables-filter></rentables-filter>',
        };

        const home = {
            name: 'home',
            url: '/home',
            templateUrl: 'views/homepage/carousel.html',
        };

        const viewRentRequest = {
            name: 'viewRentRequest',
            url: '/student/rent_request/view',
            template: '<view-rent-request></view-rent-request>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'student', state: '401'});
                },
            },
        };
        const requestForm = {
            name: 'requestForm',
            url: '/student/rent_request/reserve/:id',
            template: '<request-form></request-form>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'student', state: '401'});
                },
            },
        };
        const userDashboard = {
            name: 'userDashboard',
            url: '/users',
            template: '<user-dashboard></user-dashboard>',
            resolve: {
                user: function(grant) {
                    return grant.except({test: 'visitor', state: '401'});
                },
            },
        };

        const profile_update = {
            name: 'profile-update',
            url: '/users/profile',
            template: '<profile-update></profile-update>',
            resolve: {
                user: function(grant) {
                    return grant.except({test: 'visitor', state: '401'});
                },
            },
        };

        const verifyRequestStudent = {
            name: 'verifyRequestStudent',
            url: '/users/verify/student/request',
            template: '<verify-student></verify-student>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'user', state: '401'});
                },
            },
        };

        const verifyRequestOwner = {
            name: 'verifyRequestOwner',
            url: '/users/verify/owner/request',
            template: '<verify-owner></verify-owner>',
            resolve: {
                user: function(grant) {
                    return grant.only({test: 'user', state: '401'});
                },
            },
        };

        $stateProvider.state(home);
        $stateProvider.state(viewRentRequest);
        $stateProvider.state(requestForm);
        $stateProvider.state(rentables);
        $stateProvider.state(createRentable);
        $stateProvider.state(updateRentable);
        $stateProvider.state(rentable);
        $stateProvider.state(ownerDashboard);
        $stateProvider.state(profileUpdate);
        $stateProvider.state(addPaymentInfo);
        $stateProvider.state(ownerRentables);
        $stateProvider.state(rentRequests);
        $stateProvider.state(register);
        $stateProvider.state(login);
        $stateProvider.state(four04);
        $stateProvider.state(four01);
        $stateProvider.state(verifyList);
        $stateProvider.state(adminDeletesAds);
        $stateProvider.state(adminVerifyAds);
        $stateProvider.state(rentablesFilter);
        $stateProvider.state(userDashboard);
        $stateProvider.state(verifyRequestStudent);
        $stateProvider.state(verifyRequestOwner);
        $stateProvider.state(profile_update);

        $urlRouterProvider.when('', '/home');
        $urlRouterProvider.otherwise('/404');
    },
]);

app.constant('env', enviromentVariables);

app.run(['env', '$http', '$rootScope', '$state', '$stateParams', 'authManager', 'grant', 'roleServie',
    function(env, $http, $rootScope, $state, $stateParams, authManager, grant, roleServie) {
        authManager.checkAuthOnRefresh();
        grant.addTest('visitor', function() {
            return roleServie.isVisitor();
        });
        grant.addTest('user', function() {
            return roleServie.isUser();
        });
        grant.addTest('owner', function() {
            return roleServie.isOwner();
        });
        grant.addTest('student', function() {
            return roleServie.isStudent();
        });
        grant.addTest('admin', function() {
            return roleServie.isAdmin();
        });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
            $http({
                method: 'GET',
                url: env.apiUrl + '/auth',
            }).then(function(response) {
                $rootScope.user = response.data.role;
                roleServie.setRole(response.data.role);
                // console.log(roleServie.getRole());
            });
        });
        $rootScope.$on('$stateChangeSuccess', function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
        $rootScope.$state = $state;
        return $rootScope.$stateParams = $stateParams;
    },
]);

app.factory('roleServie', function() {
    let whichRole;

    return {
        isVisitor: function() {
            return (whichRole === 'visitor');
        },
        isUser: function() {
            return (whichRole === 'user');
        },
        isOwner: function() {
            return (whichRole === 'owner');
        },
        isStudent: function() {
            return (whichRole === 'student');
        },
        isAdmin: function() {
            return (whichRole === 'admin');
        },
        setRole: function(role) {
            whichRole = role;
        },
        getRole: function() {
            return whichRole;
        },
    };
});
