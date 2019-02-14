var developMode = false;

if (!developMode) {
    require.config({
        baseUrl: './',
        paths: {
            'Cesium': '../../build/Cesium/Cesium',
            'jquery': '../js/jquery-3.3.1.min',
            'draw2Dpoint': '../js/draw2Dpoint',
            'draw2Dpolyline': '../js/draw2Dpolyline',
            'draw2Dpolygon': '../js/draw2Dpolygon',
            'draw2Dlabel': '../js/draw2Dlabel',
            'draw2Dicon': '../js/draw2Dicon',
            'commons': '../js/commons'
        },
        shim: {
            Cesium: {
                exports: 'Cesium'
            }
        }
    });
} else {
    require.config({
        baseUrl: '../Source'
    });
}

require(["Cesium"], onload);
