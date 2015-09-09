angular.module('starter.controllers', ['ngCordova', 'ngTwitter'])

.controller('AppCtrl', function($scope, $ionicPlatform, $twitterApi, $cordovaOauth, $http) {
    var twitterKey = 'STORAGE.TWITTER.KEY'; // storeOauthToken
    var clientId = 'daLhFOdYvq0Jb4Uivdg5IL1hf';
    var clientSecret = 'N28nLRPUjih4iWhuO1zaw6RbgtcIJ9aOVKPeDHS5jIw0CRLZa7';
    var myToken = '';
    var POTDApi = 'https://api.nasa.gov/planetary/apod?api_key=OKsZatPeSQtXGUtJ9DbrB2uxeGh6NQVqFZPCZVB2';


    $scope.tweet = {};

    $scope.nasa = {};

    $ionicPlatform.ready(function() {
        // check if there is a token stored in local storage
        myToken = JSON.parse(window.localStorage.getItem(twitterKey));
        console.log(myToken);
        if (myToken === '' || myToken === null) {
            $cordovaOauth.twitter(clientId, clientSecret).then(function(success) {
                myToken = success;
                // set token for Twitter as a string in local storage
                window.localStorage.setItem(twitterKey, JSON.stringify(success));
                $twitterApi.configure(clientId, clientSecret, success);
                $scope.getPOTD();
            }, function(error) {
                console.log(error);
                $scope.getPOTD(); // Must call in error in order to view in browser
            });
        } else {
            $twitterApi.configure(clientId, clientSecret, myToken);
            $scope.getPOTD();
        }
    });

    $scope.submitTweet = function() {
        $twitterApi.postStatusUpdate($scope.tweet.message + ' ' + $scope.nasa.url).then(function(result) {});
    }

    $scope.correctTimestring = function(string) {
        return new Date(Date.parse(string));
    };

    $scope.logOut = function() {
        window.localStorage.clear();
        console.log("logOut");
    }

    // default request to POTD api (today's date)
    $scope.getPOTD = function() {
        $http.get(POTDApi).
        then(function(success) {
            $scope.nasa = success.data;
        }, function(error) {
            console.log(error);
        });
    };

    $scope.getPOTDByDate = function() {
        var day = $scope.nasa.date.getDate();
        var month = $scope.nasa.date.getMonth() + 1;
        var year = $scope.nasa.date.getFullYear();
        var newDate;
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        newDate = year + '-' + month + '-' + day;
        console.log(newDate);

        // ajax request for new photo url
        $http.get(POTDApi + '&date=' + newDate)
            .then(function(success) {
                $scope.nasa = success.data;
            }, function(error) {});
    };

});