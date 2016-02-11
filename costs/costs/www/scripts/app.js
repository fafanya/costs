var mainApp = angular.module('mainApp', ['ngRoute']);
mainApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'html/main_page.html',
        controller: 'startController'
    })
    .when('/main_page', {
        templateUrl: 'html/main_page.html',
        controller: 'mainController'
    })
    .when('/add_event_page', {
        templateUrl: 'html/add_event_page.html',
        controller: 'addEventController'
    })
    .when('/event_page', {
        templateUrl: 'html/event_page.html',
        controller: 'eventController'
    })
    .when('/add_member_page', {
        templateUrl: 'html/add_member_page.html',
        controller: 'addMemberController'
    })
    .when('/member_page', {
        templateUrl: 'html/member_page.html',
        controller: 'memberController'
    })
    .when('/add_pay_page', {
        templateUrl: 'html/add_pay_page.html',
        controller: 'addPayController'
    });
});