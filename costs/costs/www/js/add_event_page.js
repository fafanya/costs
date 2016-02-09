mainApp.controller('addEventController', function ($scope, $http) {
    $scope.addEvent = function ()
    {
        $http({
            method: 'GET',
            url: '../data/events.json'
        }).then(function successCallback(response) 
        {
            var name = document.getElementById("name").value;
            var event = { name: name, id: 4 };

            $scope.events = response.data.events;
            $scope.events.push(event);
            var t = 1 + 1;

            $http.post('../data/events.json', angular.toJson($scope.events)).then(
                function success(resp)
                {
                    var q = 1 + 1;
                },
                function err(resp)
                {
                    var e = 1 + 1;
                }
                );
        },
        function errorCallback(response) {
            var error = response;
        });
    };
});