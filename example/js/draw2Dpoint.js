define(['jquery'], () => ({
    // 绘制点
    drawPoint: function () {
        var isDrawPoint = true;
        var isDrawPointMove = false;
        var pointHtmlUrl = "pointIframe.html";
        var handler = viewer.cesiumWidget.screenSpaceEventHandler;
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        var pointId;

        handler.setInputAction(function (movement) {
            var ray = viewer.scene.camera.getPickRay(movement.position);
            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

            var pixelSizeChange = function () {
                var pixeSizeVal = $("#left_container_iframe").contents().find("#plot_attr_style_pixelSize").val();
                if (pixeSizeVal >= 0) {
                    return pixeSizeVal;
                }
            }
            var colorAlphaChange = function () {
                var colorStr = $("#left_container_iframe").contents().find("#point_jscolor_fill_value").val();
                colorStr = "#" + colorStr;
                // var opacityVal = $("#left_container_iframe").contents().find("#point_fill_opacity").val();
                // opacityVal = opacityVal/100;
                return Cesium.Color.fromCssColorString(colorStr);
            }
            var outlineWidthChange = function () {
                var outlineWidthVal = $("#left_container_iframe").contents().find("#plot_attr_style_outlineWidth").val();
                if (outlineWidthVal >= 0) {
                    return outlineWidthVal;
                }
            }
            var outlineColorChange = function () {
                var colorStr = $("#left_container_iframe").contents().find("#point_jscolor_outline_value").val();
                colorStr = "#" + colorStr;
                return Cesium.Color.fromCssColorString(colorStr);
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
                if (isDrawPoint) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);//经度值
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
                    viewer.entities.add({
                        name: 'point',
                        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                        point: { //点
                            pixelSize: new Cesium.CallbackProperty(pixelSizeChange, false),
                            color: new Cesium.CallbackProperty(colorAlphaChange, false),
                            outlineColor: new Cesium.CallbackProperty(outlineColorChange, false),
                            outlineWidth: new Cesium.CallbackProperty(outlineWidthChange, false),
                            scaleByDistance: new Cesium.CallbackProperty(scaleByDistanceChange, false), // 按视距缩放
                            distanceDisplayCondition: new Cesium.CallbackProperty(distanceDisplayConditionChange, false) // 按视距显示
                        }
                    });
                    $('#left_container_iframe').attr("src", pointHtmlUrl); //设置左侧弹出框的页面地址
                }
            }
            isDrawPoint = false;
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (movement) {
            var ray = viewer.scene.camera.getPickRay(movement.endPosition);

            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

            if (cartesian) {
                if (isDrawPointMove) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);//经度值
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
                    if (viewer.entities.getById(pointId)) {
                        viewer.entities.getById(pointId).position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            var pick = viewer.scene.pick(movement.position);
            //选中某模型   pick选中的对象
            if (pick && pick.id) {
                // viewer.entities.getById(pick.id._id)
                pointId = pick.id._id;
                isDrawPointMove = true;
                // console.log(pointId);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function () {
            isDrawPoint = false;
            isDrawPointMove = false;
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
}))