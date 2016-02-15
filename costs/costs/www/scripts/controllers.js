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
function countDebts(b) {

    var debts = [];

    var N = b.length;
    
    var i = 0;
    var j = 0;
    var m = 0;

    while(i != N && j != N)
    {
        if(b[i].b <= 0)
        {
            i = i + 1;
        }
        else if (b[j].b >= 0)
        {
            j = j + 1;
        }
        else
        {
            if (b[i].b < -b[j].b)
            {
                m = b[i].b;
            }
            else
            {
                m = -b[j].b;
            }
            var debt = { who: b[i].member.name, whom: b[j].member.name, amount: m };
            debts.push(debt);
            b[i].b = b[i].b - m;
            b[j].b = b[j].b + m;
        }
    }

    return debts;
}
mainApp.controller('mainController', function ($scope, $http, $location){
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        var db = window.openDatabase("costs.db", "1.0", "costs", 500000);
        db.transaction(function (transaction) {
            transaction.executeSql(
                'CREATE TABLE IF NOT EXISTS pay (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, member_event_id INTEGER NOT NULL, amount REAL);'+
                'CREATE TABLE IF NOT EXISTS passage (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, name TEXT NOT NULL);'+
                'CREATE TABLE IF NOT EXISTS member_event_link (id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, member_id INTEGER NOT NULL, event_id INTEGER NOT NULL);' +
                'CREATE TABLE IF NOT EXISTS member (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,passage_id INTEGER NOT NULL, name TEXT NOT NULL);' +
                'CREATE TABLE IF NOT EXISTS event (id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,passage_id INTEGER NOT NULL, name	TEXT NOT NULL);' +
                'CREATE TABLE IF NOT EXISTS debt (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,passage_id	INTEGER NOT NULL,who_member_id INTEGER NOT NULL, whom_member_id	INTEGER NOT NULL, amount REAL NOT NULL);'
            , [], function (tx, results) {
                $scope.$apply(function () {
                    var t = results;
                });
            }, function (error) {
                var er = error;
            });
        });

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

            transaction.executeSql('SELECT * FROM member WHERE member.passage_id =' + passage_id, [], function (tx, results) {
                $scope.$apply(function () {
                    $scope.members = results.rows;
                });
            }, null);

            transaction.executeSql('SELECT p.amount, l.member_id, l.event_id FROM pay p, event e, member_event_link l WHERE p.member_event_id = l.id and l.event_id = e.id and e.passage_id =' + passage_id, [], function (tx, results) {
                $scope.$apply(function () {
                    $scope.pays = results.rows;
                });
            }, null);

            transaction.executeSql('SELECT l.member_id, l.event_id FROM event e, member_event_link l WHERE l.event_id = e.id and e.passage_id =' + passage_id, [], function (tx, results) {
                $scope.$apply(function () {
                    $scope.member_event_links = results.rows;
                });
            }, null);

        });

        db.transaction(function (transaction) {
            var passage_id = getCookie("passage_id");
            transaction.executeSql('SELECT debt.id, debt.amount, debt.who_member_id, debt.whom_member_id, m1.name as name1, m2.name as name2 FROM debt, member m1, member m2 WHERE m1.id = debt.who_member_id and m2.id = debt.whom_member_id and debt.passage_id =' + passage_id, [], function (tx, results) {
                $scope.$apply(function () {

                    $scope.custom_debts = results.rows;

                    var members = $scope.members;
                    var debts = results.rows;
                    var events = $scope.events;
                    var pays = $scope.pays;
                    var links = $scope.member_event_links;

                    var membersLen = members.length;
                    var kvMembers = [];
                    var i = 0;
                    for (i = 0; i < membersLen; i++) {
                        var kvMember = { b: 0, member: members[i] };
                        kvMembers.push(kvMember);
                    }

                    var debtsLen = debts.length;
                    i = 0;
                    for (i = 0; i < debtsLen; i++) {
                        var j = 0;
                        for (j = 0; j < membersLen; j++) {
                            if (debts[i].who_member_id == kvMembers[j].member.id) {
                                kvMembers[j].b = kvMembers[j].b + debts[i].amount;
                            }
                        }

                        j = 0;
                        for (j = 0; j < membersLen; j++) {
                            if (debts[i].whom_member_id == kvMembers[j].member.id) {
                                kvMembers[j].b = kvMembers[j].b - debts[i].amount;
                            }
                        }
                    }

                    var paysLen = pays.length;
                    var eventsLen = events.length;
                    var linksLen = links.length;

                    i = 0;
                    for (i = 0; i < eventsLen; i++) {
                        var eventSumma = 0;

                        var j = 0;
                        for (j = 0; j < paysLen; j++) {
                            if (pays[j].event_id == events[i].id) {
                                eventSumma = eventSumma + pays[j].amount;

                                var t = 0;
                                for (t = 0; t < membersLen; t++) {
                                    if (pays[j].member_id == kvMembers[t].member.id) {
                                        kvMembers[t].b = kvMembers[t].b - pays[j].amount;
                                    }
                                }
                            }
                        }

                        var eventMembersAmount = 0;
                        var k = 0;
                        for (k = 0; k < linksLen; k++) {
                            if (links[k].event_id == events[i].id) {
                                eventMembersAmount = eventMembersAmount + 1;
                            }
                        }

                        var avg = eventSumma / eventMembersAmount;
                        k = 0;
                        for (k = 0; k < linksLen; k++) {
                            if (links[k].event_id == events[i].id) {
                                var t = 0;
                                for (t = 0; t < membersLen; t++) {
                                    if (links[k].member_id == kvMembers[t].member.id) {
                                        kvMembers[t].b = kvMembers[t].b + avg;
                                    }
                                }
                            }
                        }
                    }

                    $scope.debts = countDebts(kvMembers);
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

    $scope.deleteDebt = function(id){
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

            db.transaction(function (transaction) {
                var executeQuery = "DELETE FROM debt where id=?";
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
            transaction.executeSql('SELECT m.name, l.id FROM member_event_link l, member m WHERE m.id = l.member_id and l.event_id =' + event_id, [], function (tx, results) {
                $scope.$apply(function () {
                    $scope.members = results.rows;
                });
            }, null);
        });
    }

    $scope.viewMember = function (id) {
        document.cookie = "member_event_id=" + id;
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
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

        db.transaction(function (transaction) {
            var member_event_id = getCookie("member_event_id");
            transaction.executeSql('SELECT p.amount FROM pay p WHERE p.member_event_id =' + member_event_id, [], function (tx, results) {
                $scope.$apply(function () {
                    $scope.pays = results.rows;
                });
            }, null);
        });
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
    $scope.addPay = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

            db.transaction(function (transaction) {
                var member_event_id = getCookie("member_event_id");
                var amount = document.getElementById("amount").value;
                var executeQuery = "INSERT INTO pay (member_event_id, amount) VALUES (?,?)";

                transaction.executeSql(executeQuery, [member_event_id, amount], function (tx, results) {
                    $scope.$apply(function () {
                        window.location = "#member_page";
                    });
                }, function (error) {
                    var er = error;
                });
            });
        }
    };
});
mainApp.controller('addDebtController', function ($scope, $http, $location) {

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

        db.transaction(function (transaction) {
            var passage_id = getCookie("passage_id");
            transaction.executeSql('SELECT * FROM member WHERE member.passage_id =' + passage_id, [], function (tx, results) {
                $scope.$apply(function () {
                    $scope.who_members = results.rows;
                    $scope.whom_members = results.rows;
                });
            }, null);
        });
    }

    $scope.addDebt = function () {
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var db = window.openDatabase("costs.db", "1.0", "costs", 500000);

            db.transaction(function (transaction) {
                var passage_id = getCookie("passage_id");
                var who_member_id = document.getElementById("who_members").value;
                var whom_member_id = document.getElementById("whom_members").value;
                var amount = document.getElementById("amount").value;

                var executeQuery = "INSERT INTO debt (passage_id, who_member_id, whom_member_id, amount) VALUES (?,?,?,?)";

                transaction.executeSql(executeQuery, [passage_id, who_member_id, whom_member_id, amount], function (tx, results) {
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