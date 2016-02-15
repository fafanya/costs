// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        /*var db = window.openDatabase("lul.db", "1.0", "luls", 500000);

        db.transaction(function (transaction) {
            transaction.executeSql('CREATE TABLE IF NOT EXISTS phonegap_pro (id integer primary key, title text, desc text)'
+ 'CREATE TABLE pay (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, member_event_id INTEGER NOT NULL, amount REAL);'+
'CREATE TABLE passage (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT NOT NULL);' +
'CREATE TABLE member_event_link (id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, member_id INTEGER NOT NULL, event_id INTEGER NOT NULL);'+
'CREATE TABLE member (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,passage_id INTEGER NOT NULL, name TEXT NOT NULL);'+
'CREATE TABLE event (id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,passage_id INTEGER NOT NULL, name	TEXT NOT NULL);'+
'CREATE TABLE debt (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,passage_id	INTEGER NOT NULL,who_member_id INTEGER NOT NULL, whom_member_id	INTEGER NOT NULL, amount REAL NOT NULL);'
           
            , [], function (tx, results) {
                $scope.$apply(function () {
                    var t = results;
                });

            }, null);
        });*/

        /*var db = window.openDatabase("lul.db", "1.0", "luls", 500000);
        db.transaction(function (transaction) {
            transaction.executeSql('CREATE TABLE IF NOT EXISTS phonegap_pro (id integer primary key, title text, desc text)'
            , [], function (tx, results) {
                $scope.$apply(function () {
                    var t = results;
                });
            }, function (error) {
                var er = error;
            });
        });*/
    };


    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();