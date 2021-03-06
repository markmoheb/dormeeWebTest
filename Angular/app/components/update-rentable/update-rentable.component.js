app = angular.module('dormeeApp');

// file upload directive
app.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            let model = $parse(attrs.fileModel);
            let modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        },
    };
}]);

app.component('updateRentable', {
    templateUrl: 'components/update-rentable/update-rentable.template.html',

  controller: function(env, $http, $stateParams, $state, NgMap) {
        let self = this;

        NgMap.getMap().then(function(map) {
            console.log(map.getCenter());
            console.log('markers', map.markers);
            console.log('shapes', map.shapes);

            self.markerMove = function(e) {
                self.lat = map.markers[0].getPosition().lat();
                self.lon = map.markers[0].getPosition().lng();
            };
        });

        // Amenities checkboxes
        self.items = ['Furniture', 'Air conditioner', 'Cooker', 'Heater', 'Washer',
            'Landline', 'Internet', 'TV', 'Parking', 'Elevator',
        ];
        self.selected = [];

        self.toggle = function(item, list) {
            let idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
        };

        self.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        self.isIndeterminate = function() {
            return (self.selected.length !== 0 &&
                self.selected.length !== self.items.length);
        };

        self.isChecked = function() {
            return self.selected.length === self.items.length;
        };

        self.toggleAll = function() {
            if (self.selected.length === self.items.length) {
                self.selected = [];
            } else if (self.selected.length === 0 || self.selected.length > 0) {
                self.selected = self.items.slice(0);
            }
        };

        self.getRentable = function() {
            let getRequest = {
                method: 'GET',
                url: env.apiUrl + '/rentables/' + $stateParams.id,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            $http(getRequest).then(function(response) {
                self.rentable = response.data;

                self.rentable_type = self.rentable.rentable_type;
                self.address = self.rentable.address;
                self.district = self.rentable.district;
                self.size = self.rentable.size;
                self.rent_price = self.rentable.rent_price;
                self.floor_level = self.rentable.floor_level;
                self.insurance = self.rentable.insurance;
                self.number_of_rooms = self.rentable.number_of_rooms;
                self.number_of_bathrooms = self.rentable.number_of_bathrooms;
                self.summary = self.rentable.summary;
                self.lat = self.rentable.latitude;
                self.lon = self.rentable.longitude;

                if (self.rentable.amenities.furnished == 'true') self.toggle('Furniture', self.selected);
                if (self.rentable.amenities.air_conditioning == 'true') self.toggle('Air conditioner', self.selected);
                if (self.rentable.amenities.cooker == 'true') self.toggle('Cooker', self.selected);
                if (self.rentable.amenities.heater == 'true') self.toggle('Heater', self.selected);
                if (self.rentable.amenities.washer == 'true') self.toggle('Washer', self.selected);
                if (self.rentable.amenities.landline == 'true') self.toggle('Landline', self.selected);
                if (self.rentable.amenities.internet == 'true') self.toggle('Internet', self.selected);
                if (self.rentable.amenities.TV == 'true') self.toggle('TV', self.selected);
                if (self.rentable.amenities.parking == 'true') self.toggle('Parking', self.selected);
                if (self.rentable.amenities.elevator == 'true') self.toggle('Elevator', self.selected);
            });
        };


        self.updateRentable = function() {
            let fd = new FormData();

            // Amenities
            let furnished = self.exists('Furniture', self.selected) ? 'true' : 'false';
            let air_conditioning = self.exists('Air conditioner', self.selected) ? 'true' : 'false';
            let cooker = self.exists('Cooker', self.selected) ? 'true' : 'false';
            let heater = self.exists('Heater', self.selected) ? 'true' : 'false';
            let washer = self.exists('Washer', self.selected) ? 'true' : 'false';
            let landline = self.exists('Landline', self.selected) ? 'true' : 'false';
            let internet = self.exists('Internet', self.selected) ? 'true' : 'false';
            let TV = self.exists('TV', self.selected) ? 'true' : 'false';
            let parking = self.exists('Parking', self.selected) ? 'true' : 'false';
            let elevator = self.exists('Elevator', self.selected) ? 'true' : 'false';

            fd.append('amenities.furnished', furnished);
            fd.append('amenities.air_conditioning', air_conditioning);
            fd.append('amenities.cooker', cooker);
            fd.append('amenities.heater', heater);
            fd.append('amenities.washer', washer);
            fd.append('amenities.landline', landline);
            fd.append('amenities.internet', internet);
            fd.append('amenities.TV', TV);
            fd.append('amenities.parking', parking);
            fd.append('amenities.elevator', elevator);

            if (self.photo) fd.append('photo', self.photo);

            if (self.rentable_type) fd.append('rentable_type', self.rentable_type);
            if (self.address) fd.append('address', self.address);
            if (self.district) fd.append('district', self.district);
            if (self.size) fd.append('size', self.size);
            if (self.rent_price) fd.append('rent_price', self.rent_price);
            if (self.floor_level) fd.append('floor_level', self.floor_level);
            if (self.insurance) fd.append('insurance', self.insurance);
            if (self.number_of_rooms) fd.append('number_of_rooms', self.number_of_rooms);
            if (self.number_of_bathrooms) fd.append('number_of_bathrooms', self.number_of_bathrooms);
            if (self.summary) fd.append('summary', self.summary);
            if (self.lat) fd.append('latitude', self.lat);
            if (self.lat) fd.append('longitude', self.lon);

            let request = {
                method: 'PUT',
                url: env.apiUrl + '/rentables/' + $stateParams.id,
                transformRequest: angular.identity,
                data: fd,
                headers: {
                    'Content-Type': undefined,
                },
            };

            $http(request).then(function(response) {
                $state.go('ownerRentables');
            });
        };
    },
});