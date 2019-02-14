define(['jquery', 'commons'], () => ({
    // 绘制图上文字
    drawLabel: function () {
        var isDrawLabel = true;
        var isDrawLabelMove = false;
        var labelHtmlUrl = "labelIframe.html";
        var handler = viewer.cesiumWidget.screenSpaceEventHandler;
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        var labelId;

        handler.setInputAction(function (movement) {
            var ray = viewer.scene.camera.getPickRay(movement.position);
            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

            var colorAlphaChange = function () {
                var colorStr = $("#left_container_iframe").contents().find("#label_jscolor_fill_value").val();
                colorStr = "#" + colorStr;
                // console.log(colorRgb(colorStr, 1));
                var opacityVal = $("#left_container_iframe").contents().find("#label_attr_style_opacity").val();
                opacityVal = opacityVal/100;
                return Cesium.Color.fromCssColorString(colorRgb(colorStr, opacityVal));
            }
            var outlineWidthChange = function () {
                var outlineWidthVal = $("#left_container_iframe").contents().find("#label_plot_attr_style_border_width").val();
                if (outlineWidthVal >= 0) {
                    return outlineWidthVal;
                }else {
                    return 0;
                }
            }
            var outlineColorChange = function () {
                var colorStr = $("#left_container_iframe").contents().find("#label_jscolor_border_width_color").val();
                colorStr = "#" + colorStr;
                var opacityVal = $("#left_container_iframe").contents().find("#label_attr_style_opacity").val();
                opacityVal = opacityVal/100;
                return Cesium.Color.fromCssColorString(colorRgb(colorStr, opacityVal));
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
            var textChange = function () {
                var textLabel = $("#left_container_iframe").contents().find("#plot_attr_style_text_label").val();
                if(textLabel!=null&&textLabel!=''){
                    return textLabel;
                }else{
                    return "文字";
                }
            }
            var fontChange = function () {
                var fontSize = $("#left_container_iframe").contents().find("#plot_attr_style_font_size").val();
                var fontFamily = $("#left_container_iframe").contents().find("#plot_attr_style_font_family").val();
                var str = fontSize + "px" + " " + fontFamily;
                return str;
            }
            var styleChange = function () {
                var labelStyle = $("#left_container_iframe").contents().find('input:radio[name="label_plot_attr_style_border"]:checked').val();
                if(labelStyle==1){
                    return Cesium.LabelStyle.FILL_AND_OUTLINE;
                }else {
                    return Cesium.LabelStyle.FILL;
                }
            }
            var backgroundChange = function () {
                var backgroundVal = $("#left_container_iframe").contents().find('input:radio[name="plot_attr_style_background"]:checked').val();
                if(backgroundVal==1){
                    return true;
                }else {
                    return false;
                }
            }
            if (cartesian) {
                if (isDrawLabel) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);//经度值
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
                    viewer.entities.add({
                        name: 'label',
                        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                        label: { //文字
                            text: new Cesium.CallbackProperty(textChange, false),
                            fillColor: new Cesium.CallbackProperty(colorAlphaChange, false),
                            outlineColor: new Cesium.CallbackProperty(outlineColorChange, false),
                            outlineWidth: new Cesium.CallbackProperty(outlineWidthChange, false),
                            font: new Cesium.CallbackProperty(fontChange, false),
                            style: new Cesium.CallbackProperty(styleChange, false),
                            showBackground: new Cesium.CallbackProperty(backgroundChange, false),
                            scaleByDistance: new Cesium.CallbackProperty(scaleByDistanceChange, false),
                            distanceDisplayCondition: new Cesium.CallbackProperty(distanceDisplayConditionChange, false),
                            pixelOffset: new Cesium.Cartesian2(0, -20)
                        }
                    });
                    $('#left_container_iframe').attr("src", labelHtmlUrl); //设置左侧弹出框的页面地址
                }
            }
            isDrawLabel = false;
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (movement) {
            var ray = viewer.scene.camera.getPickRay(movement.endPosition);

            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

            if (cartesian) {
                if (isDrawLabelMove) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var longitude = Cesium.Math.toDegrees(cartographic.longitude);//经度值
                    var latitude = Cesium.Math.toDegrees(cartographic.latitude);//纬度值
                    if (viewer.entities.getById(labelId)) {
                        viewer.entities.getById(labelId).position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            var pick = viewer.scene.pick(movement.position);
            //选中某模型   pick选中的对象
            if (pick && pick.id) {
                // viewer.entities.getById(pick.id._id)
                labelId = pick.id._id;
                isDrawLabelMove = true;
                // console.log(pointId);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function () {
            isDrawLabel = false;
            isDrawLabelMove = false;
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    }
}))