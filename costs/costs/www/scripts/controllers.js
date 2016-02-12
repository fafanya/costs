function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

mainApp.controller('mainController', function ($scope, $http, $location){
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {

        var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

        db.transaction(function (transaction)
        {
            transaction.executeSql('SELECT * FROM passage', [], function (tx, results)
            {
                $scope.$apply(function (){
                    $scope.passages = results.rows;
                });
                
            }, null);
        });
    }

    $scope.viewPassage = function (id) {
        document.cookie = "passage_id=" + id;
        window.location("#passage_page");
    };
    $scope.deletePassage = function (id) {
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {

            

            var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

            db.transaction(function (transaction) {
                var executeQuery = "DELETE FROM passage where id=?";
                transaction.executeSql(executeQuery, [id],
                function (tx, result) {
                    window.location = "#main_page";
                },
                function (error) {
                    var er = error;
                });
            });
        }
    };
});
mainApp.controller('addPassageController', function ($scope, $http, $location) {
    $scope.addPassage = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

            db.transaction(function (transaction) {
                var name = document.getElementById("name").value;
                var executeQuery = "INSERT INTO passage (name) VALUES (?)";

                transaction.executeSql(executeQuery, [name], function (tx, results) {
                    $scope.$apply(function () {
                        window.location = "#main_page";
                    });
                }, function (error) {
                    var er = error;
                });
            });
        }
    };
});
mainApp.controller('passageController', function ($scope, $http, $location) {
    
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

        db.transaction(function (transaction){
            var passage_id = getCookie("passage_id");
            transaction.executeSql('SELECT * FROM event WHERE event.passage_id =' + passage_id, [], function (tx, results) {
                $scope.$apply(function () {
                    $scope.events = results.rows;
                });
            }, null);
        });

        db.transaction(function (transaction) {
            var passage_id = getCookie("passage_id");
            transaction.executeSql('SELECT * FROM member WHERE member.passage_id =' + passage_id, [], function (tx, results) {
                $scope.$apply(function () {
                    $scope.members = results.rows;
                });
            }, null);
        });
    }

    $scope.viewEvent = function (id) {
        document.cookie = "event_id=" + id;
        window.location = "#event_page";
    };

    $scope.deleteEvent = function (id) {
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

            db.transaction(function (transaction) {
                var executeQuery = "DELETE FROM event where id=?";
                transaction.executeSql(executeQuery, [id],
                function (tx, result) {
                    window.location = "#passage_page";
                },
                function (error) {
                    var er = error;
                });
            });
        }
    };

    $scope.viewMember = function (id) {
        document.cookie = "member_id=" + id;
        window.location = "#member_page";
    };

    $scope.deleteMember = function (id) {
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

            db.transaction(function (transaction) {
                var executeQuery = "DELETE FROM member where id=?";
                transaction.executeSql(executeQuery, [id],
                function (tx, result) {
                    window.location = "#passage_page";
                },
                function (error) {
                    var er = error;
                });
            });
        }
    };
});
mainApp.controller('addEventController', function ($scope, $http, $location)
{
    $scope.addEvent = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

            db.transaction(function (transaction) {

                var passage_id = getCookie("passage_id");
                var name = document.getElementById("name").value;
                var executeQuery = "INSERT INTO event (passage_id, name) VALUES (?,?)";

                transaction.executeSql(executeQuery, [passage_id, name], function (tx, results) {
                    $scope.$apply(function () {
                        window.location = "#passage_page";
                    });
                }, function (error) {
                    var er = error;
                });
            });
        }
    };
});
mainApp.controller('eventController', function ($scope, $http, $location){
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

        db.transaction(function (transaction) {
            var event_id = getCookie("event_id");
            transaction.executeSql('SELECT m.name, m.id FROM member_event_link l, member m WHERE m.id = l.member_id and l.event_id =' + event_id, [], function (tx, results) {
                $scope.$apply(function () {
                    $scope.members = results.rows;
                });
            }, null);
        });
    }

    $scope.viewMember = function (id) {
        document.cookie = "member_id=" + id;
        window.location("#member_page");
    };
});
mainApp.controller('addMemberController', function ($scope, $http, $location)
{
    $scope.addMember = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

            db.transaction(function (transaction) {
                var passage_id = getCookie("passage_id");
                var name = document.getElementById("name").value;
                var executeQuery = "INSERT INTO member (passage_id, name) VALUES (?,?)";

                transaction.executeSql(executeQuery, [passage_id, name], function (tx, results) {
                    $scope.$apply(function () {
                        window.location = "#passage_page";
                    });
                }, function (error) {
                    var er = error;
                });
            });
        }
    };
});
mainApp.controller('memberController', function ($scope, $http, $location) {

    var member_id = getCookie("member_id");
    $scope.member_id = member_id;

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function gotFS(fileSystem) {
        fileSystem.root.getFile("pays.json", null, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.file(gotFile, fail);
    }

    function gotFile(file) {
        readAsText(file);
    }

    function readAsText(file) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            var t = JSON.parse(evt.target.result);
            $scope.$apply(function () {
                $scope.pays = t;
            });
            $scope.pays = t;
        };
        reader.readAsText(file);
    }

    function fail(error) {
        console.log(error.code);
    }
});
mainApp.controller('addMemberToEventController', function ($scope, $http, $location) {
    var passage_id = getCookie("passage_id");

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        var db = window.openDatabase("costs.db", "1.0", "costs", 500000);
        db.transaction(function (transaction) {
            var passage_id = getCookie("passage_id");
            transaction.executeSql('SELECT * FROM member WHERE member.passage_id =' + passage_id, [], function (tx, results) {
                $scope.$apply(function () {
                    $scope.members = results.rows;
                });
            }, null);
        });
    }

    $scope.addMember = function (id) {
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

            db.transaction(function (transaction) {

                var event_id = getCookie("event_id");
                var executeQuery = "INSERT INTO member_event_link (member_id, event_id) VALUES (?,?)";

                transaction.executeSql(executeQuery, [id, event_id], function (tx, results) {
                    $scope.$apply(function () {
                        window.location = "#event_page";
                    });
                }, function (error) {
                    var er = error;
                });
            });
        }
    };
});
mainApp.controller('addPayController', function ($scope, $http, $location) {

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function gotFS(fileSystem) {
        fileSystem.root.getFile("pays.json", null, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.file(gotFile, fail);
    }

    function gotFile(file) {
        readAsText(file);
    }

    function readAsText(file) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            var t = JSON.parse(evt.target.result);
            $scope.events = t;
        };
        reader.readAsText(file);
    }

    function fail(error) {
        console.log(error.code);
    }

    $scope.addPay = function () {

        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        }

        function gotFS(fileSystem) {
            fileSystem.root.getFile("pays.json", { create: true, exclusive: false }, gotFileEntry, fail);
        }

        function gotFileEntry(fileEntry) {
            fileEntry.createWriter(gotFileWriter, fail);
        }

        function gotFileWriter(writer) {
            writer.onwriteend = function (evt) {
                window.location = "#member_page";
            };

            var id = 0;
            var myArray = $scope.events;
            myArray.map(function (ele) {
                if (ele.id > id) {
                    id = ele.id;
                }
            });

            var member_id = getCookie("member_id");

            var pay = document.getElementById("pay").value;
            myArray.push({ "id": id + 1, "member_id": member_id, "pay": pay });
            var data = JSON.stringify(myArray);
            writer.write(data);
        }

        function fail(error) {
            console.log(error.code);
        }

    };
});