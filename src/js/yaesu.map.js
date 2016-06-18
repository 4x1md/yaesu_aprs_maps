/**
 * yaesu.map.js
 *
 * Main angularjs controller.
 */
angular.module('YaesuMapApp', [])
.controller('YaesuMapController', function($scope, $window, $timeout) {
    $scope.beacons = [];
    $scope.radioModel = "none";
    $scope.status = "ready";
    $scope.fileInput = document.getElementById('fileinput');
    $scope.fileReader = new $window.FileReader();
    $scope.parser = new Parser();


    /* ======================================== */
    /* ====== File input and FileReader ======= */
    /* ======================================== */

    /** File input onchange event.
     * Fires when the uses chooses a new file.
     */
    $scope.fileInput.onchange = function () {
	    $scope.status = "loading file";
	    var file = $scope.fileInput.files[0];
	    $scope.fileReader.readAsArrayBuffer(file);
	};

    /** FileReader onload event.
     * Fires when FileReades finishes reading selected file.
     */
    $scope.fileReader.onload = function () {
	    $scope.binaryString = $scope.fileReader.result;
	    var array = new Uint8Array($scope.binaryString);
	    $scope.beacons = $scope.parser.parseMemory(array);
	    $scope.radioModel = $scope.parser.lastRadioModel;
	    $scope.status = "parsing done";
	    $scope.$apply();
	}

    /* ======================================== */
    /* ================= Maps ================= */
    /* ======================================== */
	$scope.mapOptions = {
	    zoom: 12,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	$scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);
	$scope.markers = [];
	$scope.infoWindow = new google.maps.InfoWindow();

    /** Creates map marker. */
	var createMarker = function (beacon) {
	    var content = '<h3 class="marker-title">' + beacon.srcCallsign + '</h3>&nbsp;';
	    content += '<small class="marker-title">(<a href="' + beacon.srcUrl + '" target="_blank">APRS</a>)</small>';
	    content += '<div class="marker-content">';
	    content += '<div>To: ' + beacon.destCallsign + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	    content += 'Time: ' + beacon.dateTime + '</div>';
	    content += '<div>' + beacon.message + '</div>';
	    content += '</div>';

	    var icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';

	    var marker = new google.maps.Marker({
	        map: $scope.map,
	        infoWindow: $scope.infoWindow,
	        position: new google.maps.LatLng(beacon.lat, beacon.lon),
	        title: beacon.srcCallsign,
	        content: content,
            //label: callsign,
	        //icon: pinSymbol('green')
	    });
	    google.maps.event.addListener(marker, 'click', function () {
	        marker.infoWindow.setContent(marker.content);
	        marker.infoWindow.open(marker.map, marker);
	    });
	    return marker;
    }

    /** Clears all map markers. */
	var clearMarkers = function () {
	    for (var i = 0; i < $scope.markers.length; i++) {
	        $scope.markers[i].setMap(null);
	    };
	    $scope.markers = [];
	}

    /** Updates map with beacons data. Is called when user presses
     * "Update map" button.
     */
	$scope.updateMap = function () {
	    clearMarkers();
	    $scope.bounds = new google.maps.LatLngBounds();
	    for (i = 0; i < $scope.beacons.length; i++) {
	        var beacon = $scope.beacons[i];
	        if (beacon.lat == 0 && beacon.lon == 0) {
	            continue;
	        }
	        var marker = createMarker(beacon);
	        $scope.markers.push(marker);
	        var loc = new google.maps.LatLng(beacon.lat, beacon.lon);
	        $scope.bounds.extend(loc);
	    }
	    $timeout(function () { $scope.refreshMap(); }, 100);
	}

    /** Refreshes map on the screen. */
	$scope.refreshMap = function () {
	    // Source: http://jsfiddle.net/9kxz8/
	    google.maps.event.trigger($scope.map, 'resize');
	    $scope.map.fitBounds($scope.bounds);
	    $scope.map.panToBounds($scope.bounds);
	    $scope.map.setCenter($scope.bounds.getCenter());
	    $scope.status = "done";
	}

	$scope.openInfoWindow = function (e, selectedMarker) {
	    e.preventDefault();
	    google.maps.event.trigger(selectedMarker, 'click');
	}
});
