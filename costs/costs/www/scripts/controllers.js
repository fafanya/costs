mainApp.controller('mainController', function ($scope, $http, $location)
{
    $http({
        method: 'GET',
        url: 'data/events.json'
    }).then(function successCallback(response) {
        $scope.events = response.data.events;
    },
    function errorCallback(response) {
        var error = response;
    });
});

mainApp.controller('addEventController', function ($scope, $http, $location)
{
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    function onSuccess(fileSystem)
    {
        var a = fileSystem.name;
        var b = fileSystem.root.name;
    }

    function gotFS(fileSystem)
    {
        var a = fileSystem.name;
        var b = fileSystem.root.name;

        fileSystem.root.getFile("readme.txt", { create: true, exclusive: false }, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwriteend = function (evt) {
            console.log("contents of file now 'some sample text'");
            writer.truncate(11);
            writer.onwriteend = function (evt) {
                console.log("contents of file now 'some sample'");
                writer.seek(4);
                writer.write(" different text");
                writer.onwriteend = function (evt) {
                    console.log("contents of file now 'some different text'");
                }
            };
        };
        writer.write("some sample text");
    }

    function fail(error) {
        console.log(error.code);
    }

});