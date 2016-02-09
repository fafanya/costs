mainApp.controller('mainController', function ($scope, $http)
{
    $http({
        method: 'GET',
        url: '../data/events.json'
    }).then(function successCallback(response) {
        $scope.events = response.data.events;
    },
    function errorCallback(response) {
        var error = response;
    });
});