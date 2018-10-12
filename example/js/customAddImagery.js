/**
 * 加载自定义影像，包括ESRI地图、本地地图图片、天地图、MapBox、openStreetMap
 * @type {Array}
 */
var providerViewModels = [];

// ARCGIS地图
var arcgisModel = new Cesium.ProviderViewModel({
    name : 'ESRI地图',	// 名字
    iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/esriWorldImagery.png'),	// 缩略图的url
    tooltip : 'ESRI Provider',	// 鼠标悬浮提示
    creationFunction : function() {	// 对应绑定的ImageryProvider
        return new Cesium.ArcGisMapServerImageryProvider({
            url: 'http://server.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer',
            enablePickFeatures: false
        });
    }
});
providerViewModels.push(arcgisModel);

// 本地地图
var globeModel = new Cesium.ProviderViewModel({
    name : '本地地图',	// 名字
    iconUrl : "../images/earthIcon.jpg",	// 缩略图的url
    tooltip : 'local Provider',	// 鼠标悬浮提示
    creationFunction : function() {	// 对应绑定的ImageryProvider
        return new Cesium.SingleTileImageryProvider({
            url : '../images/earth.jpg'
        });
    }
});
providerViewModels.push(globeModel);

// 天地图
var tdtModel = new Cesium.ProviderViewModel({
    name : '天地图影像',
    iconUrl : "../images/tianditu.jpg",
    tooltip : 'TianDiTu Provider',
    creationFunction : function() {
        return new Cesium.WebMapTileServiceImageryProvider({
            url : 'http://t0.tianditu.com/img_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=img&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles',
            layer : 'img',
            style : 'default',
            format : 'tiles',
            tileMatrixSetID : 'c',
            credit : new Cesium.Credit('天地图全球影像服务'),
            subdomains : ['t0','t1','t2','t3','t4','t5','t6','t7'],
            maximumLevel : 15,
            tilingScheme : new Cesium.GeographicTilingScheme(),
            tileMatrixLabels:['1','2','3','4','5','6','7']
        });
    }
});
providerViewModels.push(tdtModel);

var tdtVectorModel = new Cesium.ProviderViewModel({
    name : '天地图矢量',
    iconUrl : "../images/tianditu.jpg",
    tooltip : 'TianDiTu Provider',
    creationFunction : function() {
        return new Cesium.WebMapTileServiceImageryProvider({
            url : 'http://t0.tianditu.com/vec_w/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=vec&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles',
            layer : 'vec',
            style : 'default',
            format : 'tiles',
            tileMatrixSetID : 'w',
            credit : new Cesium.Credit('天地图全球矢量地图服务'),
            maximumLevel : 18
        });
    }
});
providerViewModels.push(tdtVectorModel);

// MapBox
var mapBoxModel = new Cesium.ProviderViewModel({
    name : 'MapBox地图',
    iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/mapboxTerrain.png'),
    tooltip : 'MapBox Provider',
    creationFunction : function() {
        return new Cesium.MapboxImageryProvider({
            mapId: 'mapbox.satellite'
        });
    }
});
providerViewModels.push(mapBoxModel);

// openStreetMap
providerViewModels.push(new Cesium.ProviderViewModel({
    name : 'openStreetMap地图',
    iconUrl : Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
    tooltip : 'OpenStreetMap  Provider',
    creationFunction : function() {
        return Cesium.createOpenStreetMapImageryProvider({
            url : 'https://a.tile.openstreetmap.org/'
        });
    }
}));