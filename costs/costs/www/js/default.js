var mainApp = angular.module('mainApp', ['ngRoute']);
mainApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: '../html/main_page.html',
        controller: 'mainController'
    })
    .when('/main_page', {
        templateUrl: '../html/main_page.html',
        controller: 'mainController'
    })
    .when('/add_event_page', {
        templateUrl: '../html/add_event_page.html',
        controller: 'addEventController'
    });
});