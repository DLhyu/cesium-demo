define(['jquery'], () => ({
    // 绘制面
    drawPolygon : function (){
        var isDrawPolygon = true;
        var polygonHtmlUrl = "polygonIframe.html";
        var fillChange = function () {
            var radioVal = $("#left_container_iframe").contents().find('input:radio[name="plot_attr_style_polygon_fill"]:checked').val();
            if (radioVal == 1) {
                var colorStr = $("#left_container_iframe").contents().find("#polygon_jscolor_fill_value").val();
                colorStr = "#" + colorStr;
                var opacityVal = $("#left_container_iframe").contents().find("#polygon_attr_style_opacity").val();
                opacityVal = opacityVal/100;
                viewer.entities.getById('polygon').polygon.material = Cesium.Color.fromCssColorString(colorStr).withAlpha(opacityVal);
                return true;
            } else {
                return false;
            }
        }
        var colorAlphaChange = function () {
            var colorStr = $("#left_container_iframe").contents().find("#polygon_jscolor_outline_value").val();
            colorStr = "#" + colorStr;
            var opacityVal = $("#left_container_iframe").contents().find("#polygon_attr_style_outline_opacity").val();
            opacityVal = opacityVal/100;
            return Cesium.Color.fromCssColorString(colorStr).withAlpha(opacityVal);
        }
        var outlineChange = function () {
            var radioVal = $("#left_container_iframe").contents().find('input:radio[name="plot_attr_style_polygon_outline"]:checked').val();
            if (radioVal == 1) {
                return true;
            } else {
                return false;
            }
        }
        var outlineWidthChange = function () {
            var widthVal = $("#left_container_iframe").contents().find("#plot_attr_style_polygon_outlineWidth").val();
            return widthVal;
        }
        var CreatePolygon = (function() {
            function _(positons) {
                if (!Cesium.defined(positons)) {
                    throw new Cesium.DeveloperError('positions is required!');
                }
                if (positons.length < 3) {
                    throw new Cesium.DeveloperError('positions 的长度必须大于等于3');
                }
                this.options = {
                    id : 'polygon',
                    polygon : {
                        show : true,
                        fill : true,
                        hierarchy : undefined,
                        material : Cesium.Color.fromCssColorString('#3388ff').withAlpha(0.5),
                        outline : true,
                        outlineColor : Cesium.Color.fromCssColorString('#ffffff'),
                        outlineWidth : 7
                    }
                };
                this.path = positons;

                this._init();
            }

            _.prototype._init = function() {
                var that = this;
                var positionCBP = function() {
                    return that.path;
                };
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(positionCBP, false);
                viewer.entities.add(this.options);
            };

            return _;
        })();

        var polygonPath = [];
        var polygon = undefined;

        var handler = viewer.cesiumWidget.screenSpaceEventHandler;
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        handler.setInputAction(function(movement) {
            var ray = viewer.scene.camera.getPickRay(movement.endPosition);

            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

            if (cartesian) {
                if (isDrawPolygon) {
                    if (polygonPath.length < 2) {
                        return;
                    }
                    if (!Cesium.defined(polygon)) {
                        polygonPath.push(cartesian);

                        polygon = new CreatePolygon(polygonPath);

                    } else {
                        polygon.path.pop();
                        polygon.path.push(cartesian);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(movement) {
            var ray = viewer.scene.camera.getPickRay(movement.position);

            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

            if (cartesian) {
                if (isDrawPolygon) {
                    polygonPath.push(cartesian);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function() {
            isDrawPolygon = false;
            polygonPath = [];
            polygon = undefined;
            $('#left_container_iframe').attr("src", polygonHtmlUrl); //设置左侧弹出框的页面地址
            changeProperty('polygon');
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        function changeProperty(id) {
            var polygonID = viewer.entities.getById(id);
            polygonID.polygon.fill = new Cesium.CallbackProperty(fillChange, false);
            // polygonID.polygon.material = new Cesium.CallbackProperty(colorAlphaChange, false);
            polygonID.polygon.outline = new Cesium.CallbackProperty(outlineChange, false);
            polygonID.polygon.outlineWidth = new Cesium.CallbackProperty(outlineWidthChange, false);
            polygonID.polygon.outlineColor = new Cesium.CallbackProperty(colorAlphaChange, false);
        }
    }
}))