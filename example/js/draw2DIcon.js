define(['jquery'], () => ({
    // 绘制图上标记点
    drawIcon: function () {
        var isDrawIcon = true;
        var isDrawIconMove = false;
        var iconHtmlUrl = "iconIframe.html";
        var handler = viewer.cesiumWidget.screenSpaceEventHandler;
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        var iconId;

        handler.setInputAction(function (movement) {
            var ray = viewer.scene.camera.getPickRay(movement.position);
            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            
            var alphaChange = function () {
                var alphaVal = $("#left_container_iframe").contents().find("#icon_attr_style_opacity").val();
                if(alphaVal){
                    return new Cesium.Color(1.0, 1.0, 1.0, alphaVal/100);
                }
            }

            var scaleChange = function () {
                var scaleVal = $("#left_container_iframe").contents().find("#plot_attr_style_scale").val();
                if(scaleVal){
                    viewer.entities.getById('billboard').billboard.pixelOffset = new Cesium.Cartesian2(0, -20*scaleVal);
                }
                return scaleVal
            }
            var rotationChange = function () {
                var rotationVal = $("#left_container_iframe").contents().find("#plot_attr_style_rotation").val();
                return rotationVal/100;
            }
            var scaleByDistanceChange = function () {
                var radioVal = $("#left_container_iframe").contents().find('input:radio[name="plot_attr_style_scaleByDistance"]:checked').val();
                if (radioVal == 1) {
                    return new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5);
                } else {
                    return undefined;
                }
            }
            var distanceDisplayConditionChange = function () {
                var radioVal = $("#left_container_iframe").contents().find('input:radio[name="plot_attr_style_distanceDisplayCondition"]:checked').val();
                if (radioVal == 1) {
                    return new Cesium.DistanceDisplayCondition(0, 20000.0);
                } else {
                    return undefined;
                }
            }
            if (cartesian) {
                if (isDrawIcon) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);//经度值
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
                    viewer.entities.add({
                        id: 'billboard',
                        name: 'billboard',
                        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                        billboard: {
                            image: '../images/marker/mark1.png',
                            pixelOffset: new Cesium.Cartesian2(0, -20),
                            color: new Cesium.CallbackProperty(alphaChange, false),
                            scale: new Cesium.CallbackProperty(scaleChange, false),
                            rotation: new Cesium.CallbackProperty(rotationChange, false),
                            scaleByDistance: new Cesium.CallbackProperty(scaleByDistanceChange, false),
                            distanceDisplayCondition: new Cesium.CallbackProperty(distanceDisplayConditionChange, false)
                        }
                    });
                    $('#left_container_iframe').attr("src", iconHtmlUrl); //设置左侧弹出框的页面地址
                }
            }
            isDrawIcon = false;
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (movement) {
            var ray = viewer.scene.camera.getPickRay(movement.endPosition);

            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

            if (cartesian) {
                if (isDrawIconMove) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);//经度值
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
                    if (viewer.entities.getById(iconId)) {
                        viewer.entities.getById(iconId).position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            var pick = viewer.scene.pick(movement.position);
            //选中某模型   pick选中的对象
            if (pick && pick.id) {
                // viewer.entities.getById(pick.id._id)
                iconId = pick.id._id;
                isDrawIconMove = true;
                // console.log(pointId);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function () {
            isDrawIcon = false;
            isDrawIconMove = false;
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
}))