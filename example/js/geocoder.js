function cancelGeocode(viewModel) {
    viewModel._isSearchInProgress = false;
    if (Cesium.defined(viewModel._geocodeInProgress)) {
        viewModel._geocodeInProgress.cancel = true;
        viewModel._geocodeInProgress = undefined;
    }
}

function updateCamera(viewModel, destination) {
    viewModel._scene.camera.flyTo({
        destination : destination,
        complete: function() {
            viewModel._complete.raiseEvent();
        },
        duration : viewModel._flightDuration,
        endTransform : Cesium.Matrix4.IDENTITY
    });
}

function geocode(viewModel) {
    viewer.entities.removeAll();
    var query = viewModel.searchText;

    if (/^\s*$/.test(query)) {
        //whitespace string
        return;
    }

    // If the user entered (longitude, latitude, [height]) in degrees/meters,
    // fly without calling the geocoder.
    var splitQuery = query.match(/[^\s,\n]+/g);
    if ((splitQuery.length === 2) || (splitQuery.length === 3)) {
        var longitude = +splitQuery[0];
        var latitude = +splitQuery[1];

        var objBD = GPS.bd_decrypt(latitude,longitude); // 百度坐标系（BD09）转火星坐标系（GCJ02）
        var obj = GPS.gcj_decrypt_exact(objBD.lat,objBD.lon); // 火星坐标系（GCJ02）转地球坐标系（WGS84）
        var height = (splitQuery.length === 3) ? +splitQuery[2] : 100000.0;

        if (!isNaN(longitude) && !isNaN(latitude) && !isNaN(height)) {
            updateCamera(viewModel, Cesium.Cartesian3.fromDegrees(obj.lon,obj.lat, height));
            viewer.entities.add({
                position : Cesium.Cartesian3
                    .fromDegrees(obj.lon,obj.lat),
                billboard : {
                    image : '../images/localpostion.png',
                    scaleByDistance : new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                    width : 20,
                    height : 20
                }
                // name : "经度："+obj.lon.toFixed(4)+", "+"纬度："+obj.lat.toFixed(4)
            });
            return;
        }
    }else{
        var map = new BMap.Map("B_Map");
        var options = {
            onSearchComplete: function(results){
                // 判断状态是否正确
                if (local.getStatus() == BMAP_STATUS_SUCCESS){
                    var resultslength = results.getCurrentNumPois()
                    // var s = [];
                    var nameVal,lng,lat;
                    for (var i = 0; i < resultslength; i ++){
                        // s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
                        // console.log(results.getPoi(i).title+":"+results.getPoi(i).point.lng+","+results.getPoi(i).point.lat);
                        lng = results.getPoi(i).point.lng;
                        lat = results.getPoi(i).point.lat;
                        nameVal = results.getPoi(i).title;
                    }
                    var objBD = GPS.bd_decrypt(lat,lng); // 百度坐标系（BD09）转火星坐标系（GCJ02）
                    var obj = GPS.gcj_decrypt_exact(objBD.lat,objBD.lon); // 火星坐标系（GCJ02）转地球坐标系（WGS84）
                    var heg = 100000.0;

                    if (!isNaN(lng) && !isNaN(lat) && !isNaN(heg)) {
                        updateCamera(viewModel, Cesium.Cartesian3.fromDegrees(obj.lon,obj.lat, heg));
                        // console.log(obj.lon+","+obj.lat);
                        viewer.entities.add({
                            position : Cesium.Cartesian3
                                .fromDegrees(obj.lon,obj.lat),
                            billboard : {
                                image : '../images/localpostion.png',
                                scaleByDistance : new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5),
                                width : 20,
                                height : 20
                            },
                            name : "地名",
                            description : nameVal
                        });
                        return;
                    }
                }
            }
        }
        var local = new BMap.LocalSearch(map, options);
        local.search(query);
    }
}