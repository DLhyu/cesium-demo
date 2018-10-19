define(['jquery'], () => ({
    // 绘制线
    drawLine: function () {
        var isDrawPolyline = true;
        var lineHtmlUrl = "polylineIframe.html";
        var colorAlphaChange = function () {
            var colorStr = $("#left_container_iframe").contents().find("#line_jscolor_fill_value").val();
            colorStr = "#" + colorStr;
            // var opacityVal = $("#left_container_iframe").contents().find("#line_attr_style_opacity").val();
            // opacityVal = opacityVal/100;
            return Cesium.Color.fromCssColorString(colorStr);
        }
        var lineWidthChange = function () {
            var lineWidth = $("#left_container_iframe").contents().find("#plot_attr_style_line_width").val();
            // if(lineWidth>=0){
                return lineWidth;
            // }
        }
        var outlineWidthChange = function () {
            var radioVal = $("#left_container_iframe").contents().find('input:radio[name="plot_attr_style_outline_line"]:checked').val();
            if (radioVal == 1) {
                var outlineWidth = $("#left_container_iframe").contents().find("#plot_attr_style_outline_width").val();
                return outlineWidth;
            } else {
                return 0;
            }
        }
        var outlineColorChange = function () {
            var outlineColor = $("#left_container_iframe").contents().find("#jscolor_line_outline_value").val();
            outlineColor = "#" + outlineColor;
            return Cesium.Color.fromCssColorString(outlineColor)
        }
        var clampToGroundChange = function () {
            var radioVal = $("#left_container_iframe").contents().find('input:radio[name="plot_attr_style_line_clampToGround"]:checked').val();
            if (radioVal == 1) {
                return true;
            } else {
                return false;
            }
        }
        var CreatePolyline = (function() {
            function _(positons) {
                if (!Cesium.defined(positons)) {
                    throw new Cesium.DeveloperError('positions is required!');
                }
                if (positons.length < 2) {
                    throw new Cesium.DeveloperError('positions 的长度必须大于等于2');
                }
                this.options = {
                    polyline : {
                        show : true,
                        width : new Cesium.CallbackProperty(lineWidthChange, false),
                        material : new Cesium.PolylineOutlineMaterialProperty({
                            color : new Cesium.CallbackProperty(colorAlphaChange, false),
                            outlineWidth : new Cesium.CallbackProperty(outlineWidthChange, false),
                            outlineColor : new Cesium.CallbackProperty(outlineColorChange, false)
                        }),
                        depthFailMaterial : new Cesium.PolylineOutlineMaterialProperty({
                            color : Cesium.Color.RED,
                            outlineWidth : 0,
                            outlineColor : Cesium.Color.RED
                        }),
                        followSurface : false,
                        clampToGround : new Cesium.CallbackProperty(clampToGroundChange, false)
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
                this.options.polyline.positions = new Cesium.CallbackProperty(positionCBP, false);
                viewer.entities.add(this.options);
            };

            return _;
        })();


        var polylinePath = [];
        var polyline = undefined;

        var handler = viewer.cesiumWidget.screenSpaceEventHandler;
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        handler.setInputAction(function(movement) {
            var ray = viewer.scene.camera.getPickRay(movement.endPosition);

            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

            if (cartesian) {
                if (isDrawPolyline) {
                    if (polylinePath.length < 1) {
                        return;
                    }
                    if (!Cesium.defined(polyline)) {
                        polylinePath.push(cartesian);

                        polyline = new CreatePolyline(polylinePath);

                    } else {
                        polyline.path.pop();
                        polyline.path.push(cartesian);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(movement) {
            var ray = viewer.scene.camera.getPickRay(movement.position);

            var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

            if (cartesian) {
                if (isDrawPolyline) {
                    polylinePath.push(cartesian);
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function() {
            isDrawPolyline = false;
            polylinePath = [];
            polyline = undefined;
            $('#left_container_iframe').attr("src", lineHtmlUrl); //设置左侧弹出框的页面地址
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
}))