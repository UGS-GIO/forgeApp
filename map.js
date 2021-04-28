require([
    // ArcGIS
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/webscene/Slide",
    "esri/layers/FeatureLayer",
    "esri/layers/SceneLayer",
    "esri/layers/ElevationLayer",
    "esri/layers/TileLayer",
    "esri/layers/ImageryLayer",
    "esri/layers/MapImageLayer",
    "esri/renderers/RasterStretchRenderer",
    "esri/layers/support/LabelClass",
    "esri/layers/SceneLayer",
    "esri/layers/GroupLayer",
    "esri/Ground",
    "esri/core/watchUtils",
    "esri/core/urlUtils",
    "esri/layers/support/DimensionalDefinition",
    "esri/layers/support/MosaicRule",
    "esri/geometry/SpatialReference",
    "esri/tasks/GeometryService",
    "esri/tasks/support/ProjectParameters",
    // Widgets
    "esri/widgets/Home",
    "esri/widgets/Zoom",
    "esri/widgets/Compass",
    "esri/widgets/Search",
    "esri/widgets/Measurement",
    "esri/widgets/DirectLineMeasurement3D",
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/widgets/BasemapToggle",
    "esri/widgets/ScaleBar",
    "esri/widgets/Attribution",
    "esri/widgets/LayerList",
    "esri/widgets/Locate",
    "esri/widgets/NavigationToggle",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/Graphic",
    "esri/tasks/support/FeatureSet",
    "esri/tasks/support/Query",
    "esri/tasks/QueryTask",
    "esri/popup/content/AttachmentsContent",
    //DGrid
    "dojo/query",
    "dojo/store/Memory",
    "dojo/data/ObjectStore",
    "dojo/data/ItemFileReadStore",
    "dojox/grid/DataGrid",
    "dgrid/OnDemandGrid",
    "dgrid/extensions/ColumnHider",
    "dgrid/Selection",
    "dstore/legacy/StoreAdapter",
    "dgrid/List",
    "dojo/_base/declare",
    "dojo/parser",
    "dojo/aspect",
    "dojo/request",
    "dojo/mouse",
    // Bootstrap
    "bootstrap/Collapse",
    "bootstrap/Dropdown",
    "share-Widget/Share",
    // Calcite Maps
    "calcite-maps/calcitemaps-v0.10",

    // Calcite Maps ArcGIS Support
    "calcite-maps/calcitemaps-arcgis-support-v0.10",
    "dojo/on",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/domReady!"
], function(Map, MapView, SceneView, Slide, FeatureLayer, SceneLayer, ElevationLayer, TileLayer, ImageryLayer, MapImageLayer, RasterStretchRenderer, LabelClass, SceneLayer, GroupLayer, Ground, watchUtils, urlUtils, DimensionalDefinition, MosaicRule, SpatialReference, GeometryService, ProjectParameters, Home, Zoom, Compass, Search, Measurement, DirectLineMeasurement3D, Legend, Expand, SketchViewModel, BasemapToggle, ScaleBar, Attribution, LayerList, Locate, NavigationToggle, GraphicsLayer, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, FeatureSet, Query, QueryTask, AttachmentsContent, query, Memory, ObjectStore, ItemFileReadStore, DataGrid, OnDemandGrid, ColumnHider, Selection, StoreAdapter, List, declare, parser, aspect, request, mouse, Collapse, Dropdown, Share, CalciteMaps, CalciteMapArcGISSupport, on, arrayUtils, dom, domClass, domConstruct) {

    //************** grid initial setup
    let grid;
    helpLoaded = "no";

    // create a new datastore for the on demandgrid
    // will be used to display attributes of selected features
    let dataStore = new StoreAdapter({
        objectStore: new Memory({
            idProperty: "OBJECTID"
        })
    });

    const gridDis = document.getElementById("gridDisplay");

    var worldElevation = ElevationLayer({
        url: "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });


    bedrockElevation = new ElevationLayer({
        url: "https://tiles.arcgis.com/tiles/ZzrwjTRez6FJiOq4/arcgis/rest/services/ForgeRasterFromTin/ImageServer"
    });

    milValleyBedrock = new ElevationLayer({
        url: "https://tiles.arcgis.com/tiles/ZzrwjTRez6FJiOq4/arcgis/rest/services/p2raster/ImageServer"
    })

    // Map
    var map = new Map({
        basemap: "topo",
        //ground: "world-elevation",
        ground: new Ground({
            layers: [worldElevation],
            navigationConstraint: {
                type: "none"
            }
        })
    });

    // View
    var mapView = new SceneView({
        container: "mapViewDiv",
        map: map,
        center: [-112.884, 38.502],
        zoom: 13,
        padding: {
            top: 50,
            bottom: 0
        },
        // camera: {
        //     position: {
        //       x: -112.9, // lon
        //       y: 38.35,   // lat
        //       z: 9000 // elevation in meters
        //     },
        
        //     tilt: 65
        //   },
          environment: {
            background: {
              type: "color",
              color: [255, 252, 244, 1]
            },
            quality: "high",
          },
          qualityProfile: "high",

        ui: {
            components: []
        }
    });






    // Popup and panel sync
    mapView.when(function() {
        CalciteMapArcGISSupport.setPopupPanelSync(mapView);
    });

//SLides



    faultsPopup = function(feature) {
                var content = "";


        if (feature.graphic.attributes.featurename) {
            content += "<span class='bold' ><b>Name: </b></span>{featurename}<br/>";
        }
        if (feature.graphic.attributes.type) {
            content += "<span class='bold' ><b>Type: </b></span>{type}<br/>";
        }
        if (feature.graphic.attributes.subtype) {
            content += "<span class='bold' ><b>Sub Type: </b></span>{subtype}<br/>";
        }

        return content;
    }



    unitsPopup = function(feature) {
        console.log(feature)
;        var content = "";


        if (feature.graphic.attributes.UnitSymbol) {
            content += "<span class='bold' ><b>Unit: </b></span>{UnitSymbol}<br/>";
        }
        if (feature.graphic.attributes.UnitName) {
            content += "<span class='bold' ><b>Unit Name: </b></span>{UnitName}<br/>";
        }
        if (feature.graphic.attributes.age_strat) {
            content += "<span class='bold' ><b>Age: </b></span>{age_strat}<br/>";
        }
        if (feature.graphic.attributes.Description) {
            content += "<span class='bold' ><b>Unit Description: </b></span>{Description}<br/>";
        }
        return content;
    }

    wellsPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.id) {
            content += "<span class='bold' ><b>ID: </b></span>{id}<br/>";
        }
        if (feature.graphic.attributes.label) {
            content += "<span class='bold' ><b>Label: </b></span>{label}<br/>";
        }
        if (feature.graphic.attributes.type) {
            content += "<span class='bold' ><b>Type: </b></span>{type}<br/>";
        }

        return content;
    }

    waterLevelPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.name) {
            content += "<span class='bold' ><b>Name: </b></span>{name}<br/>";
        }
        if (feature.graphic.attributes.label) {
            content += "<span class='bold' ><b>Label: </b></span>{label}<br/>";
        }
        if (feature.graphic.attributes.watereleva) {
            content += "<span class='bold' ><b>Water Level: </b></span>{watereleva} feet<br/>";
        }
        if (feature.graphic.attributes.dtw) {
            content += "<span class='bold' ><b>Depth to Water: </b></span>{dtw} feet below ground surface<br/>";
        }
        if (feature.graphic.attributes.datemeasur) {
            content += "<span class='bold' ><b>Date Measured: </b></span>{datemeasur}<br/>";
        }

        return content;
    }

    waterChemPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.station) {
            content += "<span class='bold' ><b>Station: </b></span>{station}<br/>";
        }
        if (feature.graphic.attributes.labelfield) {
            content += "<span class='bold' ><b>Name: </b></span>{labelfield}<br/>";
        }
        if (feature.graphic.attributes.ph) {
            content += "<span class='bold' ><b>pH: </b></span>{ph}<br/>";
        }
        if (feature.graphic.attributes.k) {
            content += "<span class='bold' ><b>K: </b></span>{k} mg/L<br/>";
        }
        if (feature.graphic.attributes.na) {
            content += "<span class='bold' ><b>Na: </b></span>{na} mg/L<br/>";
        }
        if (feature.graphic.attributes.ca) {
            content += "<span class='bold' ><b>CA: </b></span>{ca} mg/L<br/>";
        }
        if (feature.graphic.attributes.mg) {
            content += "<span class='bold' ><b>MG: </b></span>{mg} mg/L<br/>";
        }
        if (feature.graphic.attributes.br) {
            content += "<span class='bold' ><b>BR: </b></span>{br} mg/L<br/>";
        }
        if (feature.graphic.attributes.cl) {
            content += "<span class='bold' ><b>Cl: </b></span>{cl} mg/L<br/>";
        }
        if (feature.graphic.attributes.f) {
            content += "<span class='bold' ><b>F: </b></span>{f} mg/L<br/>";
        }
        if (feature.graphic.attributes.so4) {
            content += "<span class='bold' ><b>SO<sub>4</sub>: </b></span>{so4} mg/L<br/>";
        }
        if (feature.graphic.attributes.hco3) {
            content += "<span class='bold' ><b>HCO<sub>3</sub>: </b></span>{hco3} mg/L<br/>";
        }
        if (feature.graphic.attributes.hco3) {
            content += "<span class='bold' ><b><sub>18</sub>O: </b></span>{18o}‰<br/>";
        }
        if (feature.graphic.attributes.hco3) {
            content += "<span class='bold' ><b><sub>2</sub>H: </b></span>{2h}‰<br/>";
        }
        if (feature.graphic.attributes.temp) {
            content += "<span class='bold' ><b>Temperature: </b></span>{temp}°C<br/>";
        }
        if (feature.graphic.attributes.b) {
            content += "<span class='bold' ><b>B: </b></span>{b} mg/L<br/>";
        }
        if (feature.graphic.attributes.si) {
            content += "<span class='bold' ><b>Si: </b></span>{si} mg/L<br/>";
        }
        if (feature.graphic.attributes.source) {
            content += "<span class='bold' ><b>Source: </b></span>{source}<br/>";
        }
        if (feature.graphic.attributes.as_) {
            content += "<span class='bold' ><b>As_: </b></span>{as_} ug/L<br/>";
        }
        if (feature.graphic.attributes.tds) {
            content += "<span class='bold' ><b>TDS: </b></span>{tds} mg/L<br/>";
        }
        if (feature.graphic.attributes.sampledate) {
            content += "<span class='bold' ><b>Sample Date: </b></span>{sampledate}<br/>";
        }
        if (feature.graphic.attributes.watertype) {
            content += "<span class='bold' ><b>Water Type: </b></span>{watertype}<br/>";
        }


        return content;
    }

    shallowWellPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.well_name) {
            content += "<span class='bold' ><b>Well Name: </b></span>{well_name}<br/>";
        }
        if (feature.graphic.attributes.depth_m) {
            content += "<span class='bold' ><b>Depth (m): </b></span>{depth_m}<br/>";
        }
        // if (feature.graphic.attributes.sampledate) {
        //     content += "<span class='bold' ><b>Sample Date: </b></span>{sampledate}<br/>";
        // }

        return content;
    }

    deepWellPopup = function(feature) {
        console.log(feature);
        var content = "";


        if (feature.graphic.attributes.well_name) {
            content += "<span class='bold' ><b>Well Name: </b></span>{well_name}<br/>";
        }
        if (feature.graphic.attributes.depth_m) {
            content += "<span class='bold' ><b>Depth (m): </b></span>{depth_m}<br/>";
        }
        // if (feature.graphic.attributes.sampledate) {
        //     content += "<span class='bold' ><b>Sample Date: </b></span>{sampledate}<br/>";
        // }

        const attachmentsElement = new AttachmentsContent({
            displayType: "list"
        });



        return content;
    }

    intermediateWellPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.well_name) {
            content += "<span class='bold' ><b>Well Name: </b></span>{well_name}<br/>";
        }
        if (feature.graphic.attributes.depth_m) {
            content += "<span class='bold' ><b>Depth (m): </b></span>{depth_m}<br/>";
        }
        // if (feature.graphic.attributes.sampledate) {
        //     content += "<span class='bold' ><b>Sample Date: </b></span>{sampledate}<br/>";
        // }

        return content;
    }

    seismomPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.name) {
            content += "<span class='bold' ><b>Benchmark ID: </b></span>{name}<br/>";
        }


        return content;
    }

    benchPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.point_id) {
            content += "<span class='bold' ><b>Seismometer Name: </b></span>{point_id}<br/>";
        }


        return content;
    }


    //layers
    bedrockSymbology = new SceneLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Extrusion_SubsurfaceOnly/SceneServer",
        title: "Top of Bedrock Surface",
        opacity: 0.4,
        popupEnabled: false
        // elevationInfo: [{
        //     mode: "on-the-ground"
        // }],
    });

    milValleySubSymbology = new SceneLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/p2extrude/SceneServer",
        title: "Milford Valley Top of Bedrock Surface",
        opacity: 0.4,
        visible: false,
        popupEnabled: false
    });

    // bedrockSymbology = new SceneLayer ({
    //     url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/ExtrudeBetweenTest_WSL1/SceneServer",
    //     title: "Subsurface Bedrock",
    //     opacity: 0.4,
    //     // elevationInfo: [{
    //     //     mode: "on-the-ground"
    //     // }],
    // });

    deviatedWell16A = new SceneLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Deviated_Well_new/SceneServer",
        title: "Deviated Well 16A",
        elevationInfo: [{
            mode: "on-the-ground"
        }], 

    });

    landownership = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/0",
        title: "Land Ownership",
        opacity: .3,
        elevationInfo: [{
            mode: "on-the-ground"
        }],


    });

    boundary = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/3",
        title: "FORGE Boundary",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    wells = new SceneLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Infrastructure_Wells_3d_drop25m/SceneServer", 
        //url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Inf_Wells_3d/SceneServer",  old old
        title: "Wells",
        // elevationInfo: [{
        //     mode: "on-the-ground"
        // }], 
        //visible: "true",
        listMode: "hide",
        popupTemplate: {
            outFields: ["*"],
            title: "<b>FORGE Wells</b>",
            content: wellsPopup
        },
    });

    wellsFeature = new FeatureLayer ({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/4",
        title: "Wells",
        elevationInfo: [{
            mode: "on-the-ground"
        }], 
        popupTemplate: {
            outFields: ["*"],
            title: "<b>FORGE Wells</b>",
            content: wellsPopup
        },
    });

    var roadRenderer = {
        type: "simple",
        symbol: {
            type: "simple-line",
            color: "black",
            width: "3px",

        }
    }

    roads = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/1",
        title: "Roads",
        renderer: roadRenderer,
        popupTemplate: {
            outFields: ["*"],
            title: "<b>FORGE Roads</b>",
            content: "<span class='bold' ><b>Road Name: </b></span>{fullname}<br/>"
        },
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    plss = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/2",
        title: "Township & Range",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        labelsVisible: false,
    });


    power = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/6",
        title: "Power Line",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        visible: false,
    });

var waterLevelRenderer = {
    type: "unique-value",
    field: "source",
    defaultSymbol: {
        type: "picture-marker",
        url: "FORGE_WellSymbol.png",
        width: "30px",
        height: "40px"
      },
    uniqueValueInfos: [{ 
        value: "Spring",
        symbol: {
          type: "picture-marker",
          url: "FORGE_SpringSymbol.png",
          width: "24px",
          height: "30px"
        }
      }]
};

    waterLevel = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/7",
        title: "Water Levels",
        renderer: waterLevelRenderer,
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        popupTemplate: {
            outFields: ["*"],
            title: "<b>Water Level</b>",
            content: waterLevelPopup
        },
    });

    waterChemistry = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/8",
        title: "Water Chemistry (TDS mg/L)",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        popupTemplate: {
            outFields: ["*"],
            title: "<b>Water Chemistry</b>",
            content: waterChemPopup
        },
    });

    seismoms = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/9",
        title: "Seismometers",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        popupTemplate: {
            outFields: ["*"],
            title: "<b>Seismometers</b>",
            content: seismomPopup
        },
    });

    seismicity = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/10",
        title: "Seismicity 1850 to 2016 (Magnitude)",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    benchmarks = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/11",
        title: "Benchmarks",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        popupTemplate: {
            outFields: ["*"],
            title: "<b>Geophysical Benchmark</b>",
            content: benchPopup
        },
    });

    iso1km = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/12",
        title: "Isotherms at 1km depth",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        visible: false,
    });

    iso2km = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/13",
        title: "Isotherms at 2km depth",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        visible: false,
    });

    iso3km = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/14",
        title: "Isotherms at 3km depth",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        visible: false,
    });

    iso4km = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/15",
        title: "Isotherms at 4km depth",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        visible: false,
    });

    heatflow = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/16",
        title: "Heat Flow (W/m²)",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        visible: false,
    });

    shallowWellsFeature =  new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/Forge_AGOL_map_View/FeatureServer/17",
        title: "Shallow Well Temperatures",
        elevationInfo: [{
            mode: "on-the-ground"
        }], 
        popupTemplate: {
            outFields: ["*"],
            title: "<b>Shallow Well</b>",
            content: [

                {
                    type: "text",
                    text: "<b>Well Name: </b>{well_name}<br><b>Depth (m): </b>{depth_m}<br>"
                },
                {
                    type: "attachments"
                }
            ]
        },
    });

    shallowWells = new SceneLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Thermal_Shallow_Wells_25mDrop/SceneServer",
        title: "Shallow Well Temperatures",
        // elevationInfo: [{
        //     mode: "on-the-ground"
        // }], 
        //visible: false,
        listMode: "hide",
        popupTemplate: {
            outFields: ["*"],
            title: "<b>Shallow Well</b>",
            content: [

                {
                    type: "text",
                    text: "<b>Well Name: </b>{well_name}<br><b>Depth (m): </b>{depth_m}<br>"
                },
                {
                    type: "attachments"
                }
            ]
        },

    });

    intWellsFeature =  new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/Forge_AGOL_map_View/FeatureServer/18",
        title: "Intermediate Well Temperatures",
        elevationInfo: [{
            mode: "on-the-ground"
        }], 
        popupTemplate: {
            outFields: ["*"],
            title: "<b>Intermediate Well</b>",
            content: [

                {
                    type: "text",
                    text: "<b>Well Name: </b>{well_name}<br><b>Depth (m): </b>{depth_m}<br>"
                },
                {
                    type: "attachments"
                }
            ]
        },

    });

    

    intermediateWells = new SceneLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Thermal_Intermediate_Wells_25mDrop/SceneServer/0",
        title: "Intermediate Well Temperatures",
        // elevationInfo: [{
        //     mode: "on-the-ground"
        // }], 
        listMode: "hide",
        popupTemplate: {
            outFields: ["*"],
            title: "<b>Intermediate Well</b>",
            content: [

                {
                    type: "text",
                    text: "<b>Well Name: </b>{well_name}<br><b>Depth (m): </b>{depth_m}<br>"
                },
                {
                    type: "attachments"
                }
            ]
        },
    });

    deepWellsFeature =  new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/Forge_AGOL_map_View/FeatureServer/19",
        title: "Deep Well Temperatures",
        elevationInfo: [{
            mode: "on-the-ground"
        }], 
        popupTemplate: {
            outFields: ["*"],
            title: "<b>Deep Well</b>",
            content: [

                {
                    type: "text",
                    text: "<b>Well Name: </b>{well_name}<br><b>Depth (m): </b>{depth_m}<br>"
                },
                {
                    type: "attachments"
                }
            ]
        },
    });

    deepWells = new SceneLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Thermal_Deep_Wells_25mDrop/SceneServer",
        title: "Deep Well Temperatures",
        // elevationInfo: [{
        //     mode: "on-the-ground"
        // }], 
        listMode: "hide",
        popupTemplate: {
            outFields: ["*"],
            title: "<b>Deep Well</b>",
            content: [

                {
                    type: "text",
                    text: "<b>Well Name: </b>{well_name}<br><b>Depth (m): </b>{depth_m}<br>"
                },
                {
                    type: "attachments"
                }
            ]
        },
    });

    wellPads = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/21",
        title: "Well Pads",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        visible: false
    });

    geoPhysBenchmarks = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/11",
        title: "Gravity and GPS Benchmarks",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    bougerGravity = new TileLayer({
        url: "https://tiles.arcgis.com/tiles/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_Bouger_Tile/MapServer",
        title: "Bouger Gravity (mGal)",
        listMode: "hide-children",
        opacity: 0.8
    });


    // bougerGravity = new ImageryLayer({
    //     url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/Bouger_Gravity_Anomaly/ImageServer",
    //     title: "Bouger Gravity Anomaly",
    //     opacity: 0.8,

    // });

    gravityPoints = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Forge_AGOL_map_View/FeatureServer/22",
        title: "FORGE Gravity Points",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    })




   
    geologicUnits = new FeatureLayer ({
            url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_GeoUnits_Blank_WGS/FeatureServer/0",
        //url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_GeoUnits_Blank/FeatureServer/0",
        title: "Geologic Units",
        outFields: ["*"],
        elevationInfo: [{
            mode: "on-the-ground"
        }], 
        //visible: false,
        legendEnabled: false,
        listMode: "hide",
        popupTemplate: {
                        outFields: ["*"],
                        title: "<b>Geologic Units</b>",
                        content: unitsPopup
                    },

    });

    geologicFaults = new FeatureLayer ({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/FORGE_Faults_Blank_WGS_View/FeatureServer/0",
    //url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_GeoUnits_Blank/FeatureServer/0",
    title: "Geologic Faults",
    outFields: ["*"],
    elevationInfo: [{
        mode: "on-the-ground"
    }], 
    //visible: false,
    legendEnabled: false,
    listMode: "hide",
    popupTemplate: {
                    outFields: ["*"],
                    title: "<b>Geologic Faults</b>",
                    content: faultsPopup
                },

});


    geologicUnitsTile = new TileLayer({
        url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/ForgeAppGeology/MapServer",
        title: "Geology", 
        outFields: ["*"],
        //listMode: "show",
        legendEnabled: true,
        listMode: "hide-children",
        opacity: 0.7,
        // sublayers: [{
        //     id: 4,
        //     popupTemplate: {
        //         outFields: ["*"],
        //         title: "<b>Geologic Units</b>",
        //         content: unitsPopup
        //     },
        //     //title: "Geologic Units"
        // }]

    });


    geology = new GroupLayer({
        title: "Geology",
        layers: [geologicUnitsTile]
        //layers: [geologicUnitsTile, geologicLines, geologicSymbols, geologicLabels, geologicUnitLabels]
    });

    water = new GroupLayer({
        title: "Groundwater",
        visible: false,
        layers: [waterLevel, waterChemistry]
    });

    subSurface = new GroupLayer({
        title: "Subsurface Geologic Data",
        visible: false,
        layers: [bedrockSymbology, milValleySubSymbology]
    });

    thermalData = new GroupLayer({
        title: "Thermal Data",
        visible: false,
        layers: [iso1km, iso2km, iso3km, iso4km, heatflow, shallowWellsFeature, intWellsFeature, deepWellsFeature]
    });

    geoPhysData = new GroupLayer({
        title: "Gravity Data",
        visible: false,
        layers: [geoPhysBenchmarks, bougerGravity, gravityPoints]
    });

    geography = new GroupLayer({
        title: "Geography",
        layers: [roads, plss, landownership],
        visible: false,
    });

    infrastructure = new GroupLayer({
        title: "Utah FORGE Infrastructure",
        layers: [deviatedWell16A, wellsFeature, wellPads, power, boundary],
        //visible: true,
    });

    seismicData = new GroupLayer({
        title: "Seismicity Data",
        visible: false,
        layers: [seismoms, seismicity]
    });



    //**********************   GRID CODE ****************

    // create grid
    function createGrid(d) {
        console.log("creating grid");
        console.log(d.fields);
        console.log(gridFields);
        var dFields = d.fields;

        var columns = dFields.filter(function(field, i) {
            if (gridFields.indexOf(field.name) >= -1) {
                return field;
            }
        }).map(function(field) {
            //console.log(field);
            if (field.name == "objectid") {
                console.log("HIDE COLUMN " + field.name);
                return {
                    field: field.name,
                    label: field.alias,
                    //sortable: true,
                    hidden: true
                };
            
            } else if (field.name == "so4") {
                //console.log("found so4");
                return {
                    
                    renderCell: function(object, value, node){
                        var div = document.createElement("div");
                    div.innerHTML = value.so4;
                    return div;
                    },
                renderHeaderCell: function(headerNode){
                    var div = document.createElement("div");
                    div.innerHTML = "SO<sub>4</sub>";
                    return div;
                },
                sortable: true
            }
            } else if (field.name == "hco3") {
                //console.log("found so4");
                return {   
                        renderCell: function(object, value, node){
                            var div = document.createElement("div");
                        div.innerHTML = value.hco3;
                        return div;
                        },
                renderHeaderCell: function(node){
                    var div = document.createElement("div");
                    div.innerHTML = "HCO<sub>3</sub>";
                    return div;
                }
            }
            } else if (field.name == "f18o") {
               // console.log("found so4");
                return {
                    renderCell: function(object, value, node){
                        var div = document.createElement("div");
                    div.innerHTML = value.f18o;
                    return div;
                    },
                renderHeaderCell: function(node){
                    var div = document.createElement("div");
                    div.innerHTML = "<sub>18</sub>O";
                    return div;
                }
            }
            } else if (field.name == "f2h") {
                //console.log("found so4");
                return {
                    renderCell: function(object, value, node){
                        var div = document.createElement("div");
                    div.innerHTML = value.f2h;
                    return div;
                    },
                renderHeaderCell: function(node){
                    var div = document.createElement("div");
                    div.innerHTML = "<sub>2</sub>H";
                    return div;
                }
            }
            } 
            else {
                console.log("SHOW COLUMN");
                return {
                    field: field.name,
                    label: field.alias,
                    sortable: true
                };
            }


        });

        console.log(columns);






        // create a new onDemandGrid with its selection and columnhider
        // extensions. Set the columns of the grid to display attributes
        // the hurricanes cvslayer
        grid = new(declare([OnDemandGrid, Selection]))({
            columns: columns,
            minRowsPerPage: 5000,
            maxRowsPerPage: 5000,
        }, "grid");

        grid.on("dgrid-select", selectFeatureFromGrid);

    }



    function layerTable(response) {
        console.log("Table Generating");
        console.log(response);

        gridDis.style.display = 'block';
        domClass.add("mapViewDiv");

        createGrid(response);

        let graphics = response.features;
        var data = graphics.map(function(feature, i) {
            return Object.keys(feature.attributes)
                .filter(function(key) {
                    // get fields that exist in the grid
                    return (gridFields.indexOf(key) !== -1);
                })
                // need to create key value pairs from the feature
                // attributes so that info can be displayed in the grid
                .reduce((obj, key) => {
                    obj[key] = feature.attributes[key];
                    return obj;
                }, {});
        });

        for (var i = 0; i < data.length; i++) {
            if (data[i].sampledate) {
                console.log("Found Survey Date");
                for (var i = 0; i < data.length; i++) {
                    var dateString = moment(data[i].sampledate).format('MMMM Do YYYY');
                    data[i].sampledate = dateString;

                }
            }
            else if (data[i].datemeasur) {
                console.log("Found Sample Date");
                for (var i = 0; i < data.length; i++) {
                    var dateString = moment(data[i].datemeasur).format('MMMM Do YYYY');
                    data[i].datemeasur = dateString;

                }
            }
            
        }


        // set the datastore for the grid using the
        // attributes we got for the query results
        dataStore.objectStore.data = data;
        console.log(dataStore.objectStore.data);
        grid.set("collection", dataStore);

    }


    // Search - add to navbar
    var searchWidget = new Search({
        container: "searchWidgetDiv",
        view: mapView,
        allPlaceholder: "Search Layers",
        activeMenu: "none",
        locationEnabled: false,
        includeDefaultSources: false,
        sources: [{
                layer: landownership,
                name: "Land Owner Agency",
                searchFields: ["agency"],
                displayField: "agency",
                exactMatch: false,
                outFields: ["*"],

                placeholder: "example: BLM"
            },
            {
                layer: roads,
                name: "Roads",
                searchFields: ["fullname"],
                displayField: "fullname",
                exactMatch: false,
                outFields: ["*"],

                //placeholder: "example: 3708"
            },
            {
                layer: wells,
                name: "Wells",
                searchFields: ["label"],
                displayField: "label",
                outFields: ["*"],

                //placeholder: "example: BLM"
            },
            {
                layer: wellPads,
                name: "Well Pads",
                searchFields: ["name"],
                displayField: "name",
                outFields: ["*"],

                //placeholder: "example: BLM"
            },
            {
                layer: geologicUnits,
                name: "Geologic Units",
                searchFields: ["Description", "UnitSymbol", "UnitName"],
                displayField: "UnitName",
                outFields: ["*"],

                //placeholder: "example: BLM"
            }, 
            {
                layer: geologicFaults,
                name: "Geologic Faults",
                searchFields: ["type", "featurename", "subtype"],
                displayField: "featurename",
                outFields: ["*"],

                //placeholder: "example: BLM"
            }, 
            {
                layer: waterLevel,
                name: "Water Level",
                searchFields: ["name", "label"],
                displayField: "name",
                outFields: ["*"],

                //placeholder: "example: BLM"
            },
            {
                layer: waterChemistry,
                name: "Water Chemistry",
                searchFields: ["labelfield"],
                displayField: "labelfield",
                outFields: ["*"],

                //placeholder: "example: BLM"
            },
            {
                layer: geoPhysBenchmarks,
                name: "Benchmarks",
                searchFields: ["point_id"],
                displayField: "point_id",
                outFields: ["*"],

                //placeholder: "example: BLM"
            },
            {
                layer: shallowWells,
                name: "Shallow Wells",
                searchFields: ["well_name"],
                displayField: "well_name",
                outFields: ["*"],

                //placeholder: "example: BLM"
            },
            {
                layer: intermediateWells,
                name: "Intermediate Wells",
                searchFields: ["well_name"],
                displayField: "well_name",
                outFields: ["*"],

                //placeholder: "example: BLM"
            },
            {
                layer: deepWells,
                name: "Deep Wells",
                searchFields: ["well_name"],
                displayField: "well_name",
                outFields: ["*"],

                //placeholder: "example: BLM"
            }

        ]
    });

    //CalciteMapArcGISSupport.setSearchExpandEvents(searchWidget);
    // Map widgets
    var home = new Home({
        view: mapView
    });
    mapView.ui.add(home, "top-left");
    var zoom = new Zoom({
        view: mapView
    });
    mapView.ui.add(zoom, "top-left");
    var compass = new Compass({
        view: mapView
    });
    mapView.ui.add(compass, "top-left");

    var basemapToggle = new BasemapToggle({
        view: mapView,
        secondBasemap: "satellite"
    });

    // geolocate user position
    var locateWidget = new Locate({
        view: mapView, // Attaches the Locate button to the view
    });

    mapView.ui.add(locateWidget, "top-left");

    mapView.ui.add(searchWidget, {
        position: "bottom-right",
        index: 1
      });

    //   mapView.ui.add(share, "top-left");



    mapView.map.add(water);
    mapView.map.add(geoPhysData);
    mapView.map.add(seismicData);
    mapView.map.add(thermalData);
    mapView.map.add(geography);
    mapView.map.add(subSurface);
    //mapView.map.ground.layers.add(bedrockElevation);
    mapView.map.add(geology);
    mapView.map.add(infrastructure);
    mapView.map.add(geologicUnits);
    mapView.map.add(geologicFaults);

    //testing code for loading certain layers, zooms, camera positions with urlUtils

var checkURL = urlUtils.urlToObject(window.location.href);
console.log(checkURL);

if (checkURL.query != null) {
if (checkURL.query.loadview == "subsurface") {  //load subsurface view and data
    subSurface.visible = true;
    geology.visible = false;
    mapView.camera.position.z = -431.67459647450596;
    mapView.camera.tilt = 93.26527489700682;
} else if (checkURL.query.loadview == "thermal") { //load thermal view and data
    thermalData.visible = true;
    geology.visible = false;
    mapView.camera.position.latitude = 38.482522462;
    mapView.camera.position.longitude = -112.87325304;
    mapView.camera.position.z = 70000;
    mapView.camera.tilt = 0;
    mapView.camera.position.heading = 359.98;
} else if (checkURL.query.loadview == "geologic") { //load geolgoic setting view and data
    geology.visible = true;
    mapView.camera.position.latitude = 38.482522462;
    mapView.camera.position.longitude = -112.87325304;
    mapView.camera.position.z = 70000;
    mapView.camera.tilt = 0;
    mapView.camera.position.heading = 270;
}

}




    layerList = new LayerList({
        view: mapView,
        //container: "legendDiv",
        listItemCreatedFunction: function(event) {
            const item = event.item;
            //console.log(item);
            if (item.layer.type != "group") { // don't show legend twice
                item.panel = {
                    content: "legend",
                    open: true
                }
                item.actionsSections = [
                    [{
                        title: "Data Table",
                        className: "esri-icon-table",
                        id: "table"
                    }],
                    [{
                        title: "Increase opacity",
                        className: "esri-icon-up",
                        id: "increase-opacity"
                    }, {
                        title: "Decrease opacity",
                        className: "esri-icon-down",
                        id: "decrease-opacity"
                    }],
                    [{
                        title: "Zoom to Layer",
                        className: "esri-icon-zoom-out-fixed",
                        id: "zoom-to" 
                    }]
                ];
            }
        }
    });

    //legend expand widget
    var expandLegend = new Expand({
        view: mapView,
        content: layerList,
        //group: "top-left",
        expandTooltip: "Expand Legend",
        expanded: false
    })

    //legend expand widget
    var legend = new Expand({
        view: mapView,
        content: layerList,
        //group: "top-left",
        expandTooltip: "Expand Legend",
        expanded: true
    })




    //layerlist action for opacity

    layerList.on("trigger-action", function(event) {

        console.log(event);



        // Capture the action id.
        var id = event.action.id;

        var title = event.item.title;

        console.log(title);

        if (title === "FORGE Boundary") {
            layer = boundary;
        } else if (title === "Land Ownership") {
            layer = landownership;
        } else if (title === "Wells") {
            layer = wells;
        } else if (title === "Geology") {
            layer = geologicUnitsTile;
        } else if (title === "Roads") {
            layer = roads;
        } else if (title === "Township & Range") {
            layer = plss;
        } else if (title === "Field Office") {
            layer = office;
        } else if (title === "Power Line") {
            layer = power;
        } else if (title === "Water Levels") {
            layer = waterLevel;
        } else if (title === "Water Chemistry (TDS mg/L)") {
            layer = waterChemistry;
        } else if (title === "Seismometers") {
            layer = seismoms;
        } else if (title === "Seismicity 1850 to 2016 (Magnitude)") {
            layer = seismicity;
        } else if (title === "Benchmarks") {
            layer = benchmarks;
        } else if (title === "Isotherms at 1km depth") {
            layer = iso1km;
        } else if (title === "Isotherms at 2km depth") {
            layer = iso2km;
        } else if (title === "Isotherms at 3km depth") {
            layer = iso3km;
        } else if (title === "Isotherms at 4km depth") {
            layer = iso4km;
        } else if (title === "Heat Flow Isotherms") {
            layer = heatflow;
        } else if (title === "Shallow Well Temperatures") {
            layer = shallowWells;
        } else if (title === "Intermediate Well Temperatures") {
            layer = intermediateWells;
        } else if (title === "Deep Well Temperatures") {
            layer = deepWells;
        } else if (title === "Geologic Lines") {
            layer = geologicLines;
        } else if (title === "Geologic Labels") {
            layer = geologicLabels;
        } else if (title === "Geologic Symbols") {
            layer = geologicSymbols;
        } else if (title === "Gravity and GPS Benchmarks") {
            layer = geoPhysBenchmarks;
        } else if (title === "FORGE Gravity Points") {
            layer = gravityPoints;
        } else if (title === "Bouger Gravity (mGal)") {
            layer = bougerGravity;
        } else if (title === "Milford Valley Top of Bedrock Surface") {
            layer = milValleySubSymbology;
        } else if (title === "Top of Bedrock Surface") {
            layer = bedrockSymbology;
        }

        //*********** TABLE CODE  ***********/

        if (id === "table") {
            console.log("Table Action CLicked");

            // Geo Unit Table code
            if (title == "Geology") {
                
                doGridClear()
                console.log("GeoUnits Table");

                gridFields = ["OBJECTID", "UnitSymbol", "UnitName", "grouping", "age_strat", "Description"];
                //var sublayer = geologicUnits.findSublayerById(4);


                layer = geologicUnits;
                
                layer.load().then(attributesReady);

                function attributesReady() {
                    var query = layer.createQuery();
                    // add table close x to right hand corner
                    document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
                    document.getElementById("removeX").setAttribute("style", "float: right;");

                    query.where = "1=1";
                    query.outfields = ["OBJECTID", "UnitSymbol", "UnitName", "grouping", "age_strat", "Description"];
                    layer.queryFeatures(query).then(function(e) {
                        console.log(e);


                        resultsArray = e["features"];
                        console.log(resultsArray);
                        // put our attributes in an object the datagrid can ingest.
                        var srch = {
                            "items": []
                        };
                        resultsArray.forEach(function(ftrs) {
                            var att = ftrs.attributes;

                            srch.items.push(att);
                        });
                        console.log(srch);
                        gridFields = ["OBJECTID", "UnitSymbol", "UnitName", "grouping", "age_strat", "Description"];
                        var fieldArray = [
                            //{alias: 'objectid', name: 'objectid'}, 
                            {
                                alias: 'Unit Symbol',
                                name: 'UnitSymbol'
                            },
                            {
                                alias: 'Unit Name',
                                name: 'UnitName'
                            },
                            {
                                alias: 'Grouping',
                                name: 'grouping'
                            },
                            {
                                alias: 'Stratigraphic Age',
                                name: 'age_strat'
                            },
                            {
                                alias: 'Description of Unit',
                                name: 'Description'
                            }
                        ];

                        e.fields = fieldArray;
                        console.log(e);
                        layerTable(e);

                    });
                }
            }
            // Wells Table code
            else if (title == "Wells") {
                doGridClear()
                console.log("Wells Table");
                gridFields = ["OBJECTID", "label", "type", "depth"];
                var wellsLayer =  new FeatureLayer({
                    url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Infrastructure_Wells_3d/FeatureServer/0",
                    outFields: ["*"],
                })
                console.log(wellsLayer);
                wellsLayer.load().then(attributesReady);
                // var sublayer = geologicUnits.findSublayerById(4);
                // console.log(sublayer);
                // sublayer.createFeatureLayer()
                //     .then(function(featureLayer) {
                //         return featureLayer.load();
                //     })
                //     .then(generateTable);

                function attributesReady() {
                    
                    var query = wellsLayer.createQuery();
                    // add table close x to right hand corner
                    document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
                    document.getElementById("removeX").setAttribute("style", "float: right;");

                    console.log(query);
                    query.where = "1=1";
                    query.outfields = ["OBJECTID", "label", "type", "depth"];
                    wellsLayer.queryFeatures(query).then(function(e) {
                        console.log(e);


                        resultsArray = e["features"];
                        console.log(resultsArray);
                        // put our attributes in an object the datagrid can ingest.
                        var srch = {
                            "items": []
                        };
                        resultsArray.forEach(function(ftrs) {
                            console.log(ftrs);
                            var att = ftrs.attributes;

                            srch.items.push(att);
                        });
                        console.log(srch);
                        gridFields = ["OBJECTID", "label", "type", "depth"];
                        var fieldArray = [
                            //{alias: 'objectid', name: 'objectid'}, 
                            {
                                alias: 'Name',
                                name: 'label'
                            },
                            {
                                alias: 'Type',
                                name: 'type'
                            },
                            {
                                alias: 'Depth (m)',
                                name: 'depth'
                            }
                            
                        ];

                        e.fields = fieldArray;
                        console.log(e);
                        layerTable(e);

                    });
                }
            }
                        // Water Levels code
                        else if (title == "Water Levels") {
                            doGridClear()

                            dataStore = new StoreAdapter({
                                objectStore: new Memory({
                                    idProperty: "objectid"
                                })
                            });
                            
                            gridFields = ["objectid", "name", "label", "watereleva", "datemeasur"];
                                
                                var query = waterLevel.createQuery();
                                // add table close x to right hand corner
                                document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
                                document.getElementById("removeX").setAttribute("style", "float: right;");
            
                                console.log(query);
                                query.where = "1=1";
                                query.outfields = ["objectid", "name", "label", "watereleva", "datemeasur"];
                                waterLevel.queryFeatures(query).then(function(e) {
                                    console.log(e);
            
            
                                    resultsArray = e["features"];
                                    console.log(resultsArray);
                                    // put our attributes in an object the datagrid can ingest.
                                    var srch = {
                                        "items": []
                                    };
                                    resultsArray.forEach(function(ftrs) {
                                        console.log(ftrs);
                                        var att = ftrs.attributes;
            
                                        srch.items.push(att);
                                    });
                                    console.log(srch);
                                    gridFields = ["objectid", "name", "label", "watereleva", "datemeasur"];
                                    var fieldArray = [
                                        //{alias: 'objectid', name: 'objectid'}, 
                                        {
                                            alias: 'Name',
                                            name: 'name'
                                        },
                                        {
                                            alias: "ID",
                                            name: "label"
                                        },
                                        {
                                            alias: 'Water Elevation',
                                            name: 'watereleva'
                                        },
                                        {
                                            alias: 'Date Measured',
                                            name: 'datemeasur'
                                        }
                                        
                                    ];
            
                                    e.fields = fieldArray;
                                    console.log(e);
                                    layerTable(e);
            
                                });
                            
                        }
                        // Water chemistry
                        else if (title == "Water Chemistry (TDS mg/L)") {
                            doGridClear()
                            
                            gridFields = ["objectid", "station", "ph", "k", "na", "ca", "mg", "br", "cl", "f", "so4", "hco3", "no3", "f18o", "f2h", "temp", "b", "si", "tds", "sampledate", "watertype"];
                                
                                var query = waterChemistry.createQuery();
                                // add table close x to right hand corner
                                document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
                                document.getElementById("removeX").setAttribute("style", "float: right;");
            
                                console.log(query);
                                query.where = "1=1";
                                query.outfields = ["objectid", "station", "temp", "sampledate"];
                                waterChemistry.queryFeatures(query).then(function(e) {
                                    console.log(e);
            
            
                                    resultsArray = e["features"];
                                    console.log(resultsArray);
                                    // put our attributes in an object the datagrid can ingest.
                                    var srch = {
                                        "items": []
                                    };
                                    resultsArray.forEach(function(ftrs) {
                                        var att = ftrs.attributes;
            
                                        srch.items.push(att);
                                    });
                                    console.log(srch);
                                    gridFields = ["objectid", "station", "ph", "k", "na", "ca", "mg", "br", "cl", "f", "so4", "hco3", "no3", "f18o", "f2h", "temp", "b", "si", "tds", "sampledate", "watertype"];
                                    var fieldArray = [
                                        //{alias: 'objectid', name: 'objectid'}, 
                                        {
                                            alias: 'Station',
                                            name: 'station'
                                        },
                                        {
                                            alias: 'pH',
                                            name: 'ph'
                                        },
                                        {
                                            alias: 'K',
                                            name: 'k'
                                        },{
                                            alias: 'Na',
                                            name: 'na'
                                        },{
                                            alias: 'CA',
                                            name: 'ca'
                                        },{
                                            alias: 'MG',
                                            name: 'mg'
                                        },{
                                            alias: 'BR',
                                            name: 'br'
                                        },{
                                            alias: 'Cl',
                                            name: 'cl'
                                        },{
                                            alias: 'F',
                                            name: 'f'
                                        },{

                                            alias: "SO4", 
                                            name: 'so4',
                                            
                                        },{
                                            alias: 'HCO<sub>3</sub>',
                                            name: 'hco3'
                                        },{
                                            alias: '<sub>18</sub>O',
                                            name: 'f18o'
                                        },{
                                            alias: '<sub>2</sub>H',
                                            name: 'f2h'
                                        },
                                        {
                                            alias: 'Temperature (°C)',
                                            name: 'temp'
                                        },
                                        {
                                            alias: 'B',
                                            name: 'b'
                                        },
                                        {
                                            alias: 'Si',
                                            name: 'si'
                                        },
                                        {
                                            alias: 'TDS',
                                            name: 'tds'
                                        },
                                        {
                                            alias: 'Sample Date',
                                            name: 'sampledate'
                                        },
                                        {
                                            alias: 'Water Type',
                                            name: 'watertype'
                                        }
                                        
                                    ];
            
                                    e.fields = fieldArray;
                                    console.log(e);
                                    layerTable(e);
            
                                });
                            
                        }


// sesimoms
else if (title == "Seismometers") {
    doGridClear()
                            
    gridFields = ["name", "network"];
        
        var query = seismoms.createQuery();
        // add table close x to right hand corner
        document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
        document.getElementById("removeX").setAttribute("style", "float: right;");

        console.log(query);
        query.where = "1=1";
        query.outfields = ["objectid", "name", "network"];
        seismoms.queryFeatures(query).then(function(e) {
            console.log(e);


            resultsArray = e["features"];
            console.log(resultsArray);
            // put our attributes in an object the datagrid can ingest.
            var srch = {
                "items": []
            };
            resultsArray.forEach(function(ftrs) {
                console.log(ftrs);
                var att = ftrs.attributes;

                srch.items.push(att);
            });
            console.log(srch);
            gridFields = ["objectid", "name", "network"];
            var fieldArray = [
                //{alias: 'objectid', name: 'objectid'}, 
                {
                    alias: 'Name',
                    name: 'name'
                },
                {
                    alias: 'Network',
                    name: 'network'
                }
                
            ];

            e.fields = fieldArray;
            console.log(e);
            layerTable(e);

        });
    
}
// sesimicity
else if (title == "Seismicity 1850 to 2016 (Magnitude)") {
    doGridClear()
                            
    gridFields = ["mag", "depth", "day", "month", "year"];
        
        var query = seismicity.createQuery();
        // add table close x to right hand corner
        document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
        document.getElementById("removeX").setAttribute("style", "float: right;");

        console.log(query);
        query.where = "1=1";
        query.outfields = ["objectid", "mag", "depth", "day", "mo", "year"];
        seismicity.queryFeatures(query).then(function(e) {
            console.log(e);


            resultsArray = e["features"];
            console.log(resultsArray);
            // put our attributes in an object the datagrid can ingest.
            var srch = {
                "items": []
            };
            resultsArray.forEach(function(ftrs) {
                console.log(ftrs);
                var att = ftrs.attributes;

                srch.items.push(att);
            });
            console.log(srch);
            gridFields = ["objectid", "mag", "depth", "day", "mo", "year"];
            var fieldArray = [
                //{alias: 'objectid', name: 'objectid'}, 
                {
                    alias: 'Magnitude',
                    name: 'mag'
                },
                {
                    alias: 'Depth (km)',
                    name: 'depth'
                },
                {
                    alias: 'Day',
                    name: 'day'
                },
                {
                    alias: 'Month',
                    name: 'mo'
                },
                {
                    alias: 'Year',
                    name: 'year'
                }
                
            ];

            e.fields = fieldArray;
            console.log(e);
            layerTable(e);

        });
    
}
// shallow wells
else if (title == "Shallow Well Temperatures") {
    doGridClear()
    gridFields = ["objectid","well_name", "depth_m"];
    var shallowWellsLayer =  new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/Forge_AGOL_map_View/FeatureServer/17",
        outFields: ["*"],
    })

    shallowWellsLayer.load().then(attributesReady);

    function attributesReady() {
        
        var query = shallowWellsLayer.createQuery();
        // add table close x to right hand corner
        document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
        document.getElementById("removeX").setAttribute("style", "float: right;");

        console.log(query);
        query.where = "1=1";
        query.outfields = ["objectid", "well_name", "depth_m"];
        shallowWellsLayer.queryFeatures(query).then(function(e) {
            console.log(e);


            resultsArray = e["features"];
            console.log(resultsArray);
            // put our attributes in an object the datagrid can ingest.
            var srch = {
                "items": []
            };
            resultsArray.forEach(function(ftrs) {
                console.log(ftrs);
                var att = ftrs.attributes;

                srch.items.push(att);
            });
            console.log(srch);
            gridFields = ["objectid", "well_name", "depth_m"];
            var fieldArray = [
                //{alias: 'objectid', name: 'objectid'}, 
                {
                    alias: 'Well Name',
                    name: 'well_name'
                },
                {
                    alias: 'Depth (m)',
                    name: 'depth_m'
                }
                
            ];

            e.fields = fieldArray;
            console.log(e);
            layerTable(e);

        });
    }
}
// intermediate wells
else if (title == "Intermediate Well Temperatures") {
    doGridClear()
    gridFields = ["objectid", "well_name", "depth_m"];
    var intWellsLayer =  new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/Forge_AGOL_map_View/FeatureServer/18",
        outFields: ["*"],
    })

    intWellsLayer.load().then(attributesReady);

    function attributesReady() {
        
        var query = intWellsLayer.createQuery();
        // add table close x to right hand corner
        document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
        document.getElementById("removeX").setAttribute("style", "float: right;");

        console.log(query);
        query.where = "1=1";
        query.outfields = ["objectid", "well_name", "depth_m"];
        intWellsLayer.queryFeatures(query).then(function(e) {
            console.log(e);


            resultsArray = e["features"];
            console.log(resultsArray);
            // put our attributes in an object the datagrid can ingest.
            var srch = {
                "items": []
            };
            resultsArray.forEach(function(ftrs) {
                console.log(ftrs);
                var att = ftrs.attributes;

                srch.items.push(att);
            });
            console.log(srch);
            gridFields = ["objectid", "well_name", "depth_m"];
            var fieldArray = [
                //{alias: 'objectid', name: 'objectid'}, 
                {
                    alias: 'Well Name',
                    name: 'well_name'
                },
                {
                    alias: 'Depth (m)',
                    name: 'depth_m'
                }
                
            ];

            e.fields = fieldArray;
            console.log(e);
            layerTable(e);

        });
    }
}
// deep wells
else if (title == "Deep Well Temperatures") {
    doGridClear()

    gridFields = ["objectid", "well_name", "depth_m"];
    var deepWellsLayer =  new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/Forge_AGOL_map_View/FeatureServer/19",
        outFields: ["*"],
    })

    deepWellsLayer.load().then(attributesReady);

    function attributesReady() {
        
        var query = deepWellsLayer.createQuery();
        // add table close x to right hand corner
        document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
        document.getElementById("removeX").setAttribute("style", "float: right;");

        console.log(query);
        query.where = "1=1";
        query.outfields = ["objectid", "well_name", "depth_m"];
        deepWellsLayer.queryFeatures(query).then(function(e) {
            console.log(e);


            resultsArray = e["features"];
            console.log(resultsArray);
            // put our attributes in an object the datagrid can ingest.
            var srch = {
                "items": []
            };
            resultsArray.forEach(function(ftrs) {
                console.log(ftrs);
                var att = ftrs.attributes;

                srch.items.push(att);
            });
            console.log(srch);
            gridFields = ["objectid", "well_name", "depth_m"];
            var fieldArray = [
                //{alias: 'objectid', name: 'objectid'}, 
                {
                    alias: 'Well Name',
                    name: 'well_name'
                },
                {
                    alias: 'Depth (m)',
                    name: 'depth_m'
                }
                
            ];

            e.fields = fieldArray;
            console.log(e);
            layerTable(e);

        });
    }

} // geophysical benchmarks
else if (title == "Geophysical Benchmarks") {
    doGridClear()
                            
    gridFields = ["point_id", "elevation"];
        
        var query = geoPhysBenchmarks.createQuery();
        // add table close x to right hand corner
        document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
        document.getElementById("removeX").setAttribute("style", "float: right;");

        console.log(query);
        query.where = "1=1";
        query.outfields = ["objectid", "point_id", "elevation"];
        geoPhysBenchmarks.queryFeatures(query).then(function(e) {
            console.log(e);


            resultsArray = e["features"];
            console.log(resultsArray);
            // put our attributes in an object the datagrid can ingest.
            var srch = {
                "items": []
            };
            resultsArray.forEach(function(ftrs) {
                console.log(ftrs);
                var att = ftrs.attributes;

                srch.items.push(att);
            });
            console.log(srch);
            gridFields = ["objectid", "point_id", "elevation"];
            var fieldArray = [
                //{alias: 'objectid', name: 'objectid'}, 
                {
                    alias: 'Point ID',
                    name: 'point_id'
                },
                {
                    alias: 'Elevation',
                    name: 'elevation'
                }
                
            ];

            e.fields = fieldArray;
            console.log(e);
            layerTable(e);

        });
}

else if (title == "FORGE Gravity Points") {

    doGridClear()
                            
    gridFields = ["name", "hae", "ngvd29", "obs", "errg", "iztc", "oztc", "gfa", "gsbga", "gcbga", "adj", "adj", "gcbgav2"];
        
        var query = geoPhysBenchmarks.createQuery();
        // add table close x to right hand corner
        document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
        document.getElementById("removeX").setAttribute("style", "float: right;");

        console.log(query);
        query.where = "1=1";
        query.outfields = ["objectid", "name", "hae", "ngvd29", "obs", "errg", "iztc", "oztc", "gfa", "gsbga", "gcbga", "adj", "adj", "gcbgav2"];
        gravityPoints.queryFeatures(query).then(function(e) {
            console.log(e);


            resultsArray = e["features"];
            console.log(resultsArray);
            // put our attributes in an object the datagrid can ingest.
            var srch = {
                "items": []
            };
            resultsArray.forEach(function(ftrs) {
                console.log(ftrs);
                var att = ftrs.attributes;

                srch.items.push(att);
            });
            console.log(srch);
            gridFields = ["objectid", "name", "hae", "ngvd29", "obs", "errg", "iztc", "oztc", "gfa", "gsbga", "gcbga", "adj", "gcbgav2"];
            var fieldArray = [
                //{alias: 'objectid', name: 'objectid'}, 
                {
                    alias: 'Point Name',
                    name: 'name'
                },
                {
                    alias: 'hae',
                    name: 'hae'
                },
                {
                    alias: 'ngvd29',
                    name: 'ngvd29'
                },
                {
                    alias: 'obs',
                    name: 'obs'
                },
                {
                    alias: 'errg',
                    name: 'errg'
                },
                {
                    alias: 'iztc',
                    name: 'iztc'
                },
                {
                    alias: 'gfa',
                    name: 'gfa'
                },
                {
                    alias: 'gsbga',
                    name: 'gsbga'
                },
                {
                    alias: 'gcbga',
                    name: 'gcbga'
                },
                {
                    alias: 'adj',
                    name: 'adj'
                },
                {
                    alias: 'gcbgav2',
                    name: 'gcbgav2'
                }
                
            ];

            e.fields = fieldArray;
            console.log(e);
            layerTable(e);

        });

}

else {
    
        alert("Table Not Available For This Layer.");
      
}


        } else if (id === "increase-opacity") {
            // if the increase-opacity action is triggered, then
            // increase the opacity of the GroupLayer by 0.25

            if (layer.opacity < 1) {
                layer.opacity += 0.1;
            }
        } else if (id === "decrease-opacity") {
            // if the decrease-opacity action is triggered, then
            // decrease the opacity of the GroupLayer by 0.25

            if (layer.opacity > 0) {
                layer.opacity -= 0.1;
            }
        }  else if (id === "zoom-to") {

            if(event.item.layer.fullExtent.spatialReference !== mapView.spatialReference){
                var geomSer = new GeometryService({url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer'});
                var params = new ProjectParameters({
                  geometries: [event.item.layer.fullExtent],
                  outSpatialReference: mapView.spatialReference
                });
                geomSer.project(params).then(function(results){
                  mapView.goTo(results[0]);
                });
              }else{
                view.goTo(event.item.layer.fullExtent);
              }


        }
    });



    function doGridClear() {
        console.log("doGridClear");
        //mapView.popup.close();
        sitesCount = 0
        if (grid) {
            dataStore.objectStore.data = {};
            grid.set("collection", dataStore);
        }
        gridDis.style.display = 'none';
        domClass.remove("mapViewDiv", 'withGrid');

    }


    // Basemap events
    query("#selectBasemapPanel").on("change", function(e) {
        if (e.target.value == "ustopo") {
            // setup the ustopo basemap global variable.
            var ustopo = new Basemap({
                baseLayers: new TileLayer({
                    url: "https://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer"
                }),
                title: "usTopographic",
                id: "ustopo"
            });
            mapView.map.basemap = ustopo;
            // if mapview use basemaps defined in the value-vector=, but if mapview use value=
        } else if (map.mview == "map") {
            mapView.map.basemap = e.target.options[e.target.selectedIndex].dataset.vector;
        } else { // =="scene"
            mapView.map.basemap = e.target.value;
        }
    });

    // watch for when the screenshot panel is open

    // query(".calcite-panels .panel .panel-collapse").on("show.bs.collapse", function() {
    //     console.log("Screenshot Panel Open");

    // });

    //screenshot code

    // the button that triggers area selection mode
    const screenshotBtn = document.getElementById("screenshotBtn");

    // the orange mask used to select the area
    const maskDiv = document.getElementById("maskDiv");

    // element where we display the print preview
    const screenshotDiv = document.getElementById("screenshotDiv");


    // add an event listener to trigger the area selection mode
    screenshotBtn.addEventListener("click", function() {
        screenshotBtn.classList.add("active");
        mapView.container.classList.add("screenshotCursor");
        let area = null;

        // listen for drag events and compute the selected area
        const dragHandler = mapView.on("drag", function(event) {
            // prevent navigation in the view
            event.stopPropagation();

            // when the user starts dragging or is dragging
            if (event.action !== "end") {
                // calculate the extent of the area selected by dragging the cursor
                const xmin = clamp(
                    Math.min(event.origin.x, event.x),
                    0,
                    mapView.width
                );
                const xmax = clamp(
                    Math.max(event.origin.x, event.x),
                    0,
                    mapView.width
                );
                const ymin = clamp(
                    Math.min(event.origin.y, event.y),
                    0,
                    mapView.height
                );
                const ymax = clamp(
                    Math.max(event.origin.y, event.y),
                    0,
                    mapView.height
                );
                var pixelRatio = 2;
                area = {
                    x: xmin,
                    y: ymin,
                    width: (xmax - xmin) * pixelRatio,
                    height: (ymax - ymin) * pixelRatio
                };
                console.log(area);
                // set the position of the div element that marks the selected area
                setMaskPosition(area);
            }
            // when the user stops dragging
            else {
                // remove the drag event listener from the SceneView
                dragHandler.remove();
                // the screenshot of the selected area is taken
                mapView
                    .takeScreenshot({
                        area: area,
                        format: "png"
                    })
                    .then(function(screenshot) {
                        // display a preview of the image
                        showPreview(screenshot);

                        // create the image for download
                        document.getElementById("downloadBtn").onclick = function() {
                            const text = document.getElementById("textInput").value;
                            // if a text exists, then add it to the image
                            if (text) {
                                const dataUrl = getImageWithText(screenshot, text);
                                downloadImage(
                                    "FORGE_Screenshot.png",
                                    dataUrl
                                );
                            }
                            // otherwise download only the webscene screenshot
                            else {
                                downloadImage(
                                    "FORGE_Screenshot.png",
                                    screenshot.dataUrl
                                );
                            }
                        };

                        // the screenshot mode is disabled
                        screenshotBtn.classList.remove("active");
                        mapView.container.classList.remove("screenshotCursor");
                        setMaskPosition(null);
                    });
            }
        });

        function setMaskPosition(area) {
            if (area) {
                maskDiv.classList.remove("hide");
                maskDiv.style.left = area.x + "px";
                maskDiv.style.top = area.y + "px";
                maskDiv.style.width = area.width + "px";
                maskDiv.style.height = area.height + "px";
            } else {
                maskDiv.classList.add("hide");
            }
        }

        function clamp(value, from, to) {
            return value < from ? from : value > to ? to : value;
        }
    });

    // creates an image that will be appended to the DOM
    // so that users can have a preview of what they will download
    function showPreview(screenshot) {
        console.log(screenshot);
        screenshotDiv.classList.remove("hide");
        // add the screenshot dataUrl as the src of an image element
        const screenshotImage = document.getElementsByClassName(
            "js-screenshot-image"
        )[0];
        screenshotImage.width = screenshot.data.width;
        screenshotImage.height = screenshot.data.height;
        screenshotImage.src = screenshot.dataUrl;
    }

    // returns a new image created by adding a custom text to the webscene image
    function getImageWithText(screenshot, text) {
        const imageData = screenshot.data;

        // to add the text to the screenshot we create a new canvas element
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = imageData.height;
        canvas.width = imageData.width;

        // add the screenshot data to the canvas
        context.putImageData(imageData, 0, 0);
        context.font = "20px Arial";
        context.fillStyle = "#000";
        context.fillRect(
            0,
            imageData.height - 40,
            context.measureText(text).width + 20,
            30
        );

        // add the text from the textInput element
        context.fillStyle = "#fff";
        context.fillText(text, 10, imageData.height - 20);

        return canvas.toDataURL();
    }

    function downloadImage(filename, dataUrl) {
        // the download is handled differently in Microsoft browsers
        // because the download attribute for <a> elements is not supported
        if (!window.navigator.msSaveOrOpenBlob) {
            // in browsers that support the download attribute
            // a link is created and a programmatic click will trigger the download
            const element = document.createElement("a");
            element.setAttribute("href", dataUrl);
            element.setAttribute("download", filename);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } else {
            // for MS browsers convert dataUrl to Blob
            const byteString = atob(dataUrl.split(",")[1]);
            const mimeString = dataUrl
                .split(",")[0]
                .split(":")[1]
                .split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], {
                type: mimeString
            });

            // download file
            window.navigator.msSaveOrOpenBlob(blob, filename);
        }
    }
    // button to hide the print preview html element
    document
        .getElementById("closeBtn")
        .addEventListener("click", function() {
            screenshotDiv.classList.add("hide");
        });

        document.getElementById("removeX").addEventListener("click", function(evt) {
            // mapView.popup.close();
            // mapView.graphics.removeAll();
            doGridClear();
    
        })
// //select feature from grid table
// function selectFeatureFromGrid(event) {
//     console.log(event);
//     mapView.popup.close();
//     mapView.graphics.removeAll();
//     var row = event.rows[0]
//     console.log(row);
//     if (row.data.objectid) {
//     var id = row.data.objectid;
//     console.log("no caps");
//     var whereQuery = "objectid = '" + id + "'";
//     } else {
//         var id = row.data.OBJECTID;
//         console.log("Caps");
//         var whereQuery = "OBJECTID = '" + id + "'";
//     }
//     console.log(id);

//     var query = layer.createQuery();

//     //query.where = "objectid = '" + id + "'";
//     query.where = whereQuery;
//     query.returnGeometry = true;
//     query.outFields = ["*"],

//         // query the palntLayerView using the query set above
//         layer.queryFeatures(query).then(function(results) {
//             console.log(results);
//             var graphics = results.features;
//             console.log(graphics);
//             //graphics[0].geometry.type   polygon, 
//             var item = graphics[0];
//             if (item.geometry.type == "polygon") {
//             console.log("polygon");
//                 var cntr = [];
//                 cntr.push(item.geometry.centroidlongitude);
//                 cntr.push(item.geometry.centroid.latitude);
//                 console.log(item.geometry);
//                 mapView.goTo({
//                     center: cntr, // position:
//                     zoom: 10
//                 });
//                 mapView.graphics.removeAll();
//                 var selectedGraphic = new Graphic({
//                     geometry: item.geometry,
//                     symbol: new SimpleMarkerSymbol({
//                         //color: [0,255,255],
//                         style: "circle",
//                         //size: "8px",
//                         outline: {
//                             color: [255, 255, 0],
//                             width: 3
//                         }
//                     })
//                 });
//                 mapView.graphics.add(selectedGraphic);
//                 mapView.popup.open({
//                     features: [item],
//                     //location: item.geometry
//                 });
//             }
//         })
// }

function selectFeatureFromGrid(event) {
    console.log(event);
    console.log(dataStore);
    // close view popup if it is open
    mapView.popup.close();
    // get the ObjectID value from the clicked row
    const row = event.rows[0];
    console.log(row);
    if (row.data.objectid) {
        var id = row.data.objectid;
    } else {
    var id = row.data.OBJECTID;
}
    console.log(id);

    // setup a query by specifying objectIds
    const query = {
      objectIds: [parseInt(id)],
      outFields: ["*"],
      returnGeometry: true
    };

    // query the csvLayerView using the query set above
    layer
      .queryFeatures(query)
      .then(function(results) {
        console.log(results);
        const graphics = results.features;
        var item = graphics[0];
        console.log(item);
        var cntr = item.geometry;
        console.log(mapView);
        //cntr.push(item.geometry.centroid.longitude);                
        //cntr.push(item.geometry.centroid.latitude);

                      console.log(cntr);
                        mapView.goTo({
                             center: cntr, // position:
                            zoom: 14
                        });

        // remove all graphics to make sure no selected graphics
        mapView.graphics.removeAll();

        // create a new selected graphic

        const selectedGraphic = new Graphic({
            geometry: graphics[0].geometry,
            symbol: {
              type: "simple-fill",
              style: "solid",
              //color: "orange",
              //size: "12px", // pixels
              outline: {
                // autocasts as new SimpleLineSymbol()
                color: [255, 255, 0],
                width: 2 // points
              }
            }
          });
console.log(selectedGraphic);
        // const selectedGraphic = new Graphic({
        //   geometry: graphics[0].geometry,
        //   symbol: {
        //     type: "simple-marker",
        //     style: "circle",
        //     color: "orange",
        //     size: "12px", // pixels
        //     outline: {
        //       // autocasts as new SimpleLineSymbol()
        //       color: [255, 255, 0],
        //       width: 2 // points
        //     }
        //   }
        // });

        // add the selected graphic to the view
        // this graphic corresponds to the row that was clicked
        mapView.graphics.add(selectedGraphic);
        mapView.popup.open({
                                features: [item],
                                //location: item.geometry
                            });
      })
      .catch(errorCallback);
  }

    //testing resizing grid

    var isResizing = false,
        lastDownX = 0;

    $(function () {
        var container = $('#cont');
        var top = $('mapViewDiv');
        var bottom = $('#gridDisplay');
        //var gridHeight = $('dgrid');
        var handle = $('#drag');

        handle.on('mousedown', function (e) {
            isResizing = true;
            lastDownX = e.clientY;
        });

        $(document).on('mousemove', function (e) {
            // we don't want to do anything if we aren't resizing.
            if (!isResizing) 
                return;
            //console.log("e.clientY ", e.clientY, container.offset().top)
            var offsetRight = container.height() - (e.clientY - container.offset().top);
            console.log(offsetRight);

            top.css('bottom', offsetRight);
            bottom.css('height', offsetRight);
            //gridHeight.css('height', offsetRight);

            let root = document.documentElement;

            root.addEventListener("mousemove", e => {
                root.style.setProperty('--gridHeight', offsetRight + "px");
            })

        }).on('mouseup', function (e) {
            // stop resizing
            isResizing = false;
        });
    });

    // Load

    isResponsiveSize = mapView.widthBreakpoint === "xsmall";
    updateView(isResponsiveSize);

    // Breakpoints

    mapView.watch("widthBreakpoint", function(breakpoint) {
        console.log("watching breakpoint");
        console.log(breakpoint);
        switch (breakpoint) {
            case "xsmall":
                updateView(true);
                break;
            case "small":
            case "medium":
            case "large":
            case "xlarge":
                updateView(false);
                break;
            default:
        }
    });

    function updateView(isMobile) {
        console.log("Is Mobile");
        setLegendMobile(isMobile);
    }


    function setLegendMobile(isMobile) {
        var toAdd = isMobile ? expandLegend : legend;
        var toRemove = isMobile ? legend : expandLegend;

        mapView.ui.remove(toRemove);
        mapView.ui.add(toAdd, "top-left");
    }

    watchUtils.watch(shallowWellsFeature, 'visible', function(e) {
        if (e == true) {
            mapView.map.add(shallowWells);
        }
        if (e == false) {
            mapView.map.remove(shallowWells);
        };
    });

    watchUtils.watch(intWellsFeature, 'visible', function(e) {
        if (e == true) {
            console.log("int wells layer on");
            mapView.map.add(intermediateWells);
        }
        if (e == false) {
            console.log("int wells layer off");
            mapView.map.remove(intermediateWells);
        };
    });

    watchUtils.watch(deepWellsFeature, 'visible', function(e) {
        if (e == true) {
            mapView.map.add(deepWells);
        }
        if (e == false) {
            mapView.map.remove(deepWells);
        };
    });

    watchUtils.watch(wellsFeature, 'visible', function(e) {
        if (e == true) {
            mapView.map.add(wells);
        }
        if (e == false) {
            mapView.map.remove(wells);
        };
    });

    watchUtils.watch(thermalData, 'visible', function(e) {
    if (e == true) {
        console.log("parent thermal layer on");
        mapView.map.add(shallowWells);
        mapView.map.add(intermediateWells);
        mapView.map.add(deepWells);
        }
        if (e == false) {
            console.log("parent thermal layer off");
            mapView.map.remove(shallowWells);
            mapView.map.remove(intermediateWells);
            mapView.map.remove(deepWells);
        };

    
});

watchUtils.watch(infrastructure, 'visible', function(e) {
    if (e == true) {
        mapView.map.add(wells);
        }
        if (e == false) {
            mapView.map.remove(wells);
        };

    
});
mapView.map.add(wells);

// var measurementWidget = new Measurement({
//     view: mapView,
//     activeTool: "direct-line",
//     container: measureWidg
//   });

        // Create new instance of the Measurement widget
        const measurement = new Measurement(
            {
                view: mapView,
                container: measureWidg
            }
        );


        // Set-up event handlers for buttons and click events
        const distanceButton = document.getElementById("distance");
        const clearButton = document.getElementById("clear");


        distanceButton.addEventListener("click", function () {
          distanceMeasurement();
        });
        clearButton.addEventListener("click", function () {
          clearMeasurements();
        });

        function distanceMeasurement() {
            const type = mapView.type;
            console.log(type);
            measurement.activeTool =
              "direct-line";
            distanceButton.classList.add("active");
          }
  
          // Clears all measurements
          function clearMeasurements() {
            distanceButton.classList.remove("active");
            measurement.clear();
          }
  
     //watches when geoUnitsImagery is turned to also turn geoUnitsFeatures
     watchUtils.watch(geology, 'visible', function(ee) {
         console.log(ee);
         if (ee == true) {
            mapView.map.add(geologicUnits);
            mapView.map.add(geologicFaults);
        }
         if (ee == false) {
            mapView.map.remove(geologicUnits);
            mapView.map.remove(geologicFaults);
        };
    });

     watchUtils.watch(geologicUnitsTile, 'visible', function(e) {
         console.log(e);
         
        if (e == true) {
            mapView.map.add(geologicUnits);
            mapView.map.add(geologicFaults);
        }
        if (e == false) {
            mapView.map.remove(geologicUnits);
            mapView.map.remove(geologicFaults);
        };
    });
//scale widget

var coordsWidget = document.createElement("div");
      coordsWidget.id = "coordsWidget";
      coordsWidget.className = "esri-widget esri-component";
      coordsWidget.style.padding = "3px 3px 10px";
      coordsWidget.style.backgroundColor = "#ffffff80";

      mapView.ui.add(coordsWidget, "bottom-left");

function showCoordinates(pt) {
    if (pt) {
    var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
        " | Scale 1:" + Math.round(mapView.scale * 1) / 1;
    coordsWidget.innerHTML = coords;
    }
  }

  mapView.watch("stationary", function(isStationary) {
    showCoordinates(mapView.center);
  });

  mapView.watch("stationary", function(evt) {

    showCoordinates(mapView.toMap({ x: evt.x, y: evt.y }));
  });

  function errorCallback(error) {
    console.log("error:", error);
  }


// Check for mobile screen to load with collapsed legend

isResponsiveSize = mapView.widthBreakpoint === "xsmall";
updateView(isResponsiveSize);

// Breakpoints

mapView.watch("widthBreakpoint", function(breakpoint) {
    console.log("watching breakpoint");
    console.log(breakpoint);
  switch (breakpoint) {
    case "xsmall":
      updateView(true);
      break;
    case "small":
    case "medium":
    case "large":
    case "xlarge":
      updateView(false);
      break;
    default:
  }
});


function updateView(isMobile) {
    
  setLegendMobile(isMobile);

}

    loadHelp = document.querySelector('.help-tip img');



    var navHelp = '<div class="esri-component esri-widget">';
    navHelp += '<div id="help-tip" class="esri-widget--button esri-widget esri-interactive" role="button" title="Navigation Help">';
    navHelp += '<span aria-hidden="true" role="presentation" class="esri-icon esri-icon-question"></span>';
    navHelp += '<span class="esri-icon-font-fallback-text">Navigation Help</span></div></div>';
    $(".esri-ui-top-left").append(navHelp);
    
    if (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
                loadHelp.style.display = "none";
				loadHelp.src = "map_navigation_mobile_crop.png";
				loadHelp.style.maxWidth = "92%";
				loadHelp.style.left = "15px";
    } else {
                loadHelp.style.display = "block";
				loadHelp.src = "map_navigation_crop.png";
				loadHelp.style.maxWidth = "75%";
				loadHelp.style.left = "54px";
    }

$("#help-tip, .help-tip").click(function() {
	$(loadHelp).toggle();
});

function setLegendMobile(isMobile) {
  var toAdd = isMobile ? expandLegend : legend;
  var toRemove = isMobile ? legend : expandLegend;


  mapView.ui.remove(toRemove);
  mapView.ui.add(toAdd, "top-left");
}

//uncollapse mobile popup when it docks
popup = mapView.popup;
mapView.when(function() {
  popup.watch("collapsed", function(value){
      if(value){
      popup.collapsed = false;
    }
  });

});


function catchAbortError(error){
    if (error.name != "AbortError"){
      console.error(error);
    }
  }

document.getElementById("default").addEventListener("click", function() { 
    console.log("sub");

        subSurface.visible = true;
    geology.visible = false;

    mapView.goTo(
        {
            position: {
                x: -112.9, // lon
                y: 38.35,   // lat
                z: -431 // elevation in meters
              },
          heading: 359,
          tilt: 93
        },
        {
          speedFactor: 0.3,
        }
      ).catch(catchAbortError);




    })

    document.getElementById("default2").addEventListener("click", function() { 
        console.log("geology");
    
            subSurface.visible = true;
        geology.visible = true;
    
        mapView.goTo(
            {
                position: {
                    x: -113.02598857958381, // lon
                    y: 38.504534148367306,   // lat
                    z: 3280 // elevation in meters
                  },
              heading: 92,
              tilt: 82
            },
            {
              speedFactor: 0.3,
            }
          ).catch(catchAbortError);
    
    
    
    
        })


});

