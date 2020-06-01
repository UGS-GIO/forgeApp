require([
    // ArcGIS
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/layers/SceneLayer",
    "esri/layers/ElevationLayer",
    "esri/layers/TileLayer",
    "esri/layers/ImageryLayer",
    "esri/layers/MapImageLayer",
    "esri/layers/SceneLayer",
    "esri/layers/GroupLayer",
    "esri/Ground",
    "esri/core/watchUtils",
    "esri/layers/support/DimensionalDefinition",
    "esri/layers/support/MosaicRule",
    // Widgets
    "esri/widgets/Home",
    "esri/widgets/Zoom",
    "esri/widgets/Compass",
    "esri/widgets/Search",
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
], function(Map, MapView, SceneView, FeatureLayer, SceneLayer, ElevationLayer, TileLayer, ImageryLayer, MapImageLayer, SceneLayer, GroupLayer, Ground, watchUtils, DimensionalDefinition, MosaicRule, Home, Zoom, Compass, Search, Legend, Expand, SketchViewModel, BasemapToggle, ScaleBar, Attribution, LayerList, Locate, NavigationToggle, GraphicsLayer, SimpleFillSymbol, Graphic, FeatureSet, Query, QueryTask, AttachmentsContent, query, Memory, ObjectStore, ItemFileReadStore, DataGrid, OnDemandGrid, ColumnHider, Selection, StoreAdapter, List, declare, parser, aspect, request, mouse, Collapse, Dropdown, Share, CalciteMaps, CalciteMapArcGISSupport, on, arrayUtils, dom, domClass, domConstruct) {

    //************** grid initial setup
    let grid;

    // create a new datastore for the on demandgrid
    // will be used to display attributes of selected features
    let dataStore = new StoreAdapter({
        objectStore: new Memory({
            idProperty: "objectid"
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
        zoom: 14.5,
        padding: {
            top: 50,
            bottom: 0
        },
        //viewingMode: "local",
        // highlightOptions: {
        //     color: [255, 255, 0, 1],
        //     haloColor: "white",
        //     haloOpacity: 0.9,
        //     fillOpacity: 0.2
        //   },
        ui: {
            components: []
        }
    });
    // Popup and panel sync
    mapView.when(function() {
        CalciteMapArcGISSupport.setPopupPanelSync(mapView);
    });

    const share = new Share({
        view: mapView,
        container: "shareDiv"
    });



    unitsPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.unitsymbol) {
            content += "<span class='bold' title='Longitude'><b>Unit: </b></span>{unitsymbol}<br/>";
        }
        if (feature.graphic.attributes.unitname) {
            content += "<span class='bold' title='Longitude'><b>Unit Name: </b></span>{unitname}<br/>";
        }
        if (feature.graphic.attributes.age_strat) {
            content += "<span class='bold' title='Longitude'><b>Age: </b></span>{age_strat}<br/>";
        }
        if (feature.graphic.attributes.description) {
            content += "<span class='bold' title='Longitude'><b>Unit Description: </b></span>{description}<br/>";
        }
        return content;
    }

    wellsPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.id) {
            content += "<span class='bold' title='Longitude'><b>ID: </b></span>{id}<br/>";
        }
        if (feature.graphic.attributes.label) {
            content += "<span class='bold' title='Longitude'><b>Label: </b></span>{label}<br/>";
        }
        if (feature.graphic.attributes.type) {
            content += "<span class='bold' title='Longitude'><b>Type: </b></span>{type}<br/>";
        }

        return content;
    }

    waterLevelPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.name) {
            content += "<span class='bold' title='Longitude'><b>Name: </b></span>{name}<br/>";
        }
        if (feature.graphic.attributes.watereleva) {
            content += "<span class='bold' title='Longitude'><b>Water Level: </b></span>{watereleva}<br/>";
        }
        if (feature.graphic.attributes.datemeasur) {
            content += "<span class='bold' title='Longitude'><b>Date Measured: </b></span>{datemeasur}<br/>";
        }

        return content;
    }

    waterChemPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.station) {
            content += "<span class='bold' title='Longitude'><b>Station: </b></span>{station}<br/>";
        }
        if (feature.graphic.attributes.temp) {
            content += "<span class='bold' title='Longitude'><b>Temperature: </b></span>{temp}<br/>";
        }
        if (feature.graphic.attributes.sampledate) {
            content += "<span class='bold' title='Longitude'><b>Sample Date: </b></span>{sampledate}<br/>";
        }

        return content;
    }

    shallowWellPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.well_name) {
            content += "<span class='bold' title='Longitude'><b>Well Name: </b></span>{well_name}<br/>";
        }
        if (feature.graphic.attributes.depth_m) {
            content += "<span class='bold' title='Longitude'><b>Depth (m): </b></span>{depth_m}<br/>";
        }
        // if (feature.graphic.attributes.sampledate) {
        //     content += "<span class='bold' title='Longitude'><b>Sample Date: </b></span>{sampledate}<br/>";
        // }

        return content;
    }

    deepWellPopup = function(feature) {
        console.log(feature);
        var content = "";


        if (feature.graphic.attributes.well_name) {
            content += "<span class='bold' title='Longitude'><b>Well Name: </b></span>{well_name}<br/>";
        }
        if (feature.graphic.attributes.depth_m) {
            content += "<span class='bold' title='Longitude'><b>Depth (m): </b></span>{depth_m}<br/>";
        }
        // if (feature.graphic.attributes.sampledate) {
        //     content += "<span class='bold' title='Longitude'><b>Sample Date: </b></span>{sampledate}<br/>";
        // }

        const attachmentsElement = new AttachmentsContent({
            displayType: "list"
        });



        return content;
    }

    intermediateWellPopup = function(feature) {
        var content = "";


        if (feature.graphic.attributes.well_name) {
            content += "<span class='bold' title='Longitude'><b>Well Name: </b></span>{well_name}<br/>";
        }
        if (feature.graphic.attributes.depth_m) {
            content += "<span class='bold' title='Longitude'><b>Depth (m): </b></span>{depth_m}<br/>";
        }
        // if (feature.graphic.attributes.sampledate) {
        //     content += "<span class='bold' title='Longitude'><b>Sample Date: </b></span>{sampledate}<br/>";
        // }

        return content;
    }

    //layers
    bedrockSymbology = new SceneLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Extrusion_SubsurfaceOnly/SceneServer",
        title: "Subsurface Bedrock",
        opacity: 0.4,
        // elevationInfo: [{
        //     mode: "on-the-ground"
        // }],
    });

    milValleySubSymbology = new SceneLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/p2extrude/SceneServer",
        title: "Milford Valley Subsurface Bedrock",
        opacity: 0.4,
    });

    // bedrockSymbology = new SceneLayer ({
    //     url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/ExtrudeBetweenTest_WSL1/SceneServer",
    //     title: "Subsurface Bedrock",
    //     opacity: 0.4,
    //     // elevationInfo: [{
    //     //     mode: "on-the-ground"
    //     // }],
    // });



    landownership = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/0",
        title: "Land Ownership",
        opacity: .3,
        elevationInfo: [{
            mode: "on-the-ground"
        }],


    });

    boundary = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/3",
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
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/4",
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

    roads = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/1",
        title: "Roads",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    plss = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/2",
        title: "PLSS",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
        labelsVisible: false,
    });

    office = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/5",
        title: "Field Office",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    power = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/6",
        title: "Power Line",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

var waterLevelRenderer = {
    type: "unique-value",
    field: "source",
    defaultSymbol: {
        type: "picture-marker",
        url: "/FORGE_WellSymbol.png",
        width: "30px",
        height: "40px"
      },
    uniqueValueInfos: [{ 
        value: "Spring",
        symbol: {
          type: "picture-marker",
          url: "/FORGE_SpringSymbol.png",
          width: "24px",
          height: "30px"
        }
      }]
};

    waterLevel = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/7",
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
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/8",
        title: "Water Chemistry",
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
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/9",
        title: "Seismometers",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    seismicity = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/10",
        title: "Seismicity 1850 to 2016",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    benchmarks = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/11",
        title: "Benchmarks",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    iso1km = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/12",
        title: "Isotherms at 1km depth",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    iso2km = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/13",
        title: "Isotherms at 2km depth",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    iso3km = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/14",
        title: "Isotherms at 3km depth",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    iso4km = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/15",
        title: "Isotherms at 4km depth",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    heatflow = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/16",
        title: "Heat Flow Isotherms",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    shallowWellsFeature =  new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/FORGE_WebmapSDE_View/FeatureServer/17",
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
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/FORGE_WebmapSDE_View/FeatureServer/18",
        title: "Intermediate Well Temperatures",
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

    

    intermediateWells = new SceneLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/Thermal_Intermediate_Wells_25mDrop/SceneServer",
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
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/FORGE_WebmapSDE_View/FeatureServer/19",
        title: "Deep Well Temperatures",
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
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/21",
        title: "Well Pads",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    geoPhysBenchmarks = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/11",
        title: "Geophysical Benchmarks",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    });

    bougerGravity = new ImageryLayer({
        url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/Bouger_Gravity_Anomaly/ImageServer",
        title: "Bouger Gravity Anomaly",
        opacity: 0.5,

    });

    gravityPoints = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services/FORGE_WebmapSDE_View/FeatureServer/22",
        title: "FORGE Gravity Points",
        elevationInfo: [{
            mode: "on-the-ground"
        }],
    })


   
    // geologicUnitsSearch = new FeatureLayer ({
    //     url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/ForgeGeology_SDE/FeatureServer/4",
    //     title: "Geologic Units",
    //     elevationInfo: [{
    //         mode: "on-the-ground"
    //     }], 
    //     visible: false,
    //     //listMode: "show",
    //     // legendEnabled: true,
    //     // listMode: "hide-children",
    //     // sublayers: [
    //     //     {
    //     //         id: 4,
    //     //         //title: "Geologic Units"
    //     //     }
    //     // ]

    // });

    // geology = new MapImageLayer ({
    //     url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/ForgeGeology_SDE/MapServer",
    //     title: "Geologic Units",
    //     outFields: ["*"],
    //     //listMode: "show",
    //     legendEnabled: true,
    //     listMode: "hide-children",
    //     sublayers: [
    //         {
    //             id: 0,
    //             title: "Geologic Feature Labels"
    //         },
    //         {
    //             id: 1,
    //             title: "Geologic Unit Labels"
    //         },
    //         {
    //             id: 2,
    //             title: "Geologic Symbols"
    //         },
    //         {
    //             id: 3,
    //             title: "Geologic Lines"
    //         },
    //         {
    //             id: 4,
    //             title: "Geologic Units"
    //         },
    //     ]

    // });

    geologicUnits = new MapImageLayer({
        url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/ForgeGeology_SDE/MapServer",
        title: "Geologic Units",
        outFields: ["*"],
        listMode: "hide",
        //visible: false,
        legendEnabled: false,
        //listMode: "hide-children",
        opacity: 1,
        sublayers: [{
            id: 4,
            popupTemplate: {
                outFields: ["*"],
                title: "<b>Geologic Units</b>",
                content: unitsPopup
            },
            //title: "Geologic Units"
        }]

    });

    geologicUnitsTile = new TileLayer({
        url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/ForgeGeology_SDE/MapServer",
        title: "Geology",
        outFields: ["*"],
        //listMode: "show",
        legendEnabled: true,
        listMode: "hide-children",
        //opacity: 0.7,
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

    // geologicLines = new MapImageLayer({
    //     url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/ForgeGeology_SDE/MapServer",
    //     title: "Geologic Lines",
    //     listMode: "hide",
    //     sublayers: [{
    //         id: 3,
    //         //title: "Geologic Units"
    //     }]

    // });

    // geologicLabels = new MapImageLayer({
    //     url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/ForgeGeology_SDE/MapServer",
    //     title: "Geologic Feature Labels",
    //     listMode: "hide",
    //     sublayers: [{
    //         id: 0,
    //         //title: "Geologic Units"
    //     }]

    // });

    // geologicUnitLabels = new MapImageLayer({
    //     url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/ForgeGeology_SDE/MapServer",
    //     title: "Geologic Unit Labels",
    //     listMode: "hide",
    //     sublayers: [{
    //         id: 1,
    //         //title: "Geologic Units"
    //     }]

    // });

    // geologicSymbols = new MapImageLayer({
    //     url: "https://webmaps.geology.utah.gov/arcgis/rest/services/Energy_Mineral/ForgeGeology_SDE/MapServer",
    //     title: "Geologic Symbols",
    //     listMode: "hide-children",
    //     sublayers: [{
    //         id: 2,
    //         //title: "Geologic Units"
    //     }]

    // });

    bougerFeatures = new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/FORGE_WebmapSDE_View/FeatureServer/23",
        title: "Bouger Gravity Anomaly",
        elevationInfo: [{
            mode: "on-the-ground"
        }],

    })


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
        title: "Geophysical Data",
        visible: false,
        layers: [geoPhysBenchmarks, bougerGravity, gravityPoints, bougerFeatures]
    });

    geography = new GroupLayer({
        title: "Geography",
        layers: [roads, plss, landownership],
        visible: false,
    });

    infrastructure = new GroupLayer({
        title: "FORGE Infrastructure",
        layers: [wellsFeature, wellPads, power, office, boundary],
        //visible: true,
    });

    seismicData = new GroupLayer({
        title: "Seismic Data",
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
            } else {
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
            columns: columns
        }, "grid");

        // add a row-click listener on the grid. This will be used
        // to highlight the corresponding feature on the view
            //grid.on("dgrid-select", selectFeatureFromGrid);
            //console.log(grid.columns[0].field);



    }

//     function selectFeatureFromGrid(event) {
//         console.log(event);
//         mapView.popup.close();
//         mapView.graphics.removeAll();
//         var row = event.rows[0]
//         console.log(row);
//         var id = row.data.objectid;
//         console.log(id);

//         var sublayer = geologicUnits.findSublayerById(4);
//         console.log(sublayer);
//         sublayer.createFeatureLayer()
//             .then(function(featureLayer) {
//                 return featureLayer.load();
//             })
//             .then(continueSelect);

// function continueSelect (){
//         var query = sublayer.createQuery();

//         query.where = "objectid = '" + id + "'";
//         query.returnGeometry = true;
//         query.outFields = ["*"],

//             // query the palntLayerView using the query set above
//             sublayer.queryFeatures(query).then(function(results) {
//                 console.log(results);
//                 var graphics = results.features;
//                 console.log(graphics);
//                 var item = graphics[0];

//                 //  //checks to see if site is confidential or not
//                 //if (item.attributes.confidential != 1) {
//                 //    console.log("public");
//                 var cntr = [];
//                 cntr.push(item.geometry.longitude);
//                 cntr.push(item.geometry.latitude);
//                 console.log(item.geometry);
//                 mapView.goTo({
//                     center: cntr, // position:
//                     zoom: 13
//                 });

//                 console.log(mapView.graphics);

//                 mapView.graphics.removeAll();
//                 var selectedGraphic = new Graphic({

//                     geometry: item.geometry,
//                     symbol: new SimpleFillSymbol({
//                         //color: [0,255,255],
//                         //style: "circle",
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
//                     location: item.geometry
//                 });

//             })
//     }
//     }

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
                    var dateString = moment(data[i].sampledate).format('YYYY-MM-DD');
                    data[i].sampledate = dateString;

                }
            } else if (data[i].datemeasur) {
                console.log("Found Survey Date");
                for (var i = 0; i < data.length; i++) {
                    var dateString = moment(data[i].datemeasur).format('YYYY-MM-DD');
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
        activeMenu: "source",
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
            // {
            //     layer: geologicUnitsSearch,
            //     name: "Geologic Units",
            //     searchFields: ["description"],
            //     displayField: "unitname",
            //     outFields: ["*"],

            //     //placeholder: "example: BLM"
            // }, 
            // {
            //     layer: geologicLines,
            //     name: "Geologic Lines",
            //     searchFields: ["feature", "featurename"],
            //     displayField: "featurename",
            //     outFields: ["*"],

            //     //placeholder: "example: BLM"
            // }, 
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

    CalciteMapArcGISSupport.setSearchExpandEvents(searchWidget);
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




    mapView.map.add(water);
    mapView.map.add(geoPhysData);
    mapView.map.add(seismicData);
    mapView.map.add(thermalData);
    mapView.map.add(geography);
    mapView.map.add(subSurface);
    //mapView.map.ground.layers.add(bedrockElevation);
    mapView.map.add(geology);
    mapView.map.add(infrastructure);



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
        } else if (title === "Geologic Units") {
            layer = geologicUnits;
        } else if (title === "Roads") {
            layer = roads;
        } else if (title === "PLSS") {
            layer = plss;
        } else if (title === "Field Office") {
            layer = office;
        } else if (title === "Power Line") {
            layer = power;
        } else if (title === "Water Levels") {
            layer = waterLevel;
        } else if (title === "Water Chemistry") {
            layer = waterChemistry;
        } else if (title === "Seismometers") {
            layer = seismoms;
        } else if (title === "Seismicity 1850 to 2016") {
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
        }

        //*********** TABLE CODE  ***********/

        if (id === "table") {
            console.log("Table Action CLicked");

            // Geo Unit Table code
            if (title == "Geologic Units") {
                doGridClear()
                console.log("GeoUnits Table");
                gridFields = ["objectid", "unitsymbol", "unitname", "grouping", "age_strat", "description"];
                var sublayer = geologicUnits.findSublayerById(4);
                console.log(sublayer);
                sublayer.createFeatureLayer()
                    .then(function(featureLayer) {
                        return featureLayer.load();
                    })
                    .then(generateTable);

                function generateTable(featureLayer) {
                    var query = featureLayer.createQuery();
                    // add table close x to right hand corner
                    document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
                    document.getElementById("removeX").setAttribute("style", "float: right;");

                    query.where = "1=1";
                    query.outfields = ["objectid", "unitsymbol", "unitname", "grouping", "age_strat", "description"];
                    sublayer.queryFeatures(query).then(function(e) {
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
                        gridFields = ["objectid", "unitsymbol", "unitname", "grouping", "age_strat", "description"];
                        var fieldArray = [
                            //{alias: 'objectid', name: 'objectid'}, 
                            {
                                alias: 'Unit Symbol',
                                name: 'unitsymbol'
                            },
                            {
                                alias: 'Unit Name',
                                name: 'unitname'
                            },
                            {
                                alias: 'grouping',
                                name: 'grouping'
                            },
                            {
                                alias: 'age_strat',
                                name: 'age_strat'
                            },
                            {
                                alias: 'description',
                                name: 'description'
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
                gridFields = ["label", "type", "depth"];
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
                                alias: 'Depth',
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
                            
                            gridFields = ["name", "watereleva", "datemeasur"];
                                
                                var query = waterLevel.createQuery();
                                // add table close x to right hand corner
                                document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
                                document.getElementById("removeX").setAttribute("style", "float: right;");
            
                                console.log(query);
                                query.where = "1=1";
                                query.outfields = ["OBJECTID", "name", "watereleva", "datemeasur"];
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
                                    gridFields = ["OBJECTID", "name", "watereleva", "datemeasur"];
                                    var fieldArray = [
                                        //{alias: 'objectid', name: 'objectid'}, 
                                        {
                                            alias: 'Name',
                                            name: 'name'
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
                        else if (title == "Water Chemistry") {
                            doGridClear()
                            
                            gridFields = ["station", "temp", "sampledate"];
                                
                                var query = waterChemistry.createQuery();
                                // add table close x to right hand corner
                                document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
                                document.getElementById("removeX").setAttribute("style", "float: right;");
            
                                console.log(query);
                                query.where = "1=1";
                                query.outfields = ["OBJECTID", "station", "temp", "sampledate"];
                                waterChemistry.queryFeatures(query).then(function(e) {
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
                                    gridFields = ["OBJECTID", "station", "temp", "sampledate"];
                                    var fieldArray = [
                                        //{alias: 'objectid', name: 'objectid'}, 
                                        {
                                            alias: 'Station',
                                            name: 'station'
                                        },
                                        {
                                            alias: 'Temperature',
                                            name: 'temp'
                                        },
                                        {
                                            alias: 'Sample Date',
                                            name: 'sampledate'
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
else if (title == "Seismicity 1850 to 2016") {
    doGridClear()
                            
    gridFields = ["mag", "depth", "day", "month", "year"];
        
        var query = seismicity.createQuery();
        // add table close x to right hand corner
        document.getElementById("removeX").setAttribute("class", "glyphicon glyphicon-remove");
        document.getElementById("removeX").setAttribute("style", "float: right;");

        console.log(query);
        query.where = "1=1";
        query.outfields = ["objectid", "mag", "depth", "day", "month", "year"];
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
            gridFields = ["objectid", "mag", "depth", "day", "month", "year"];
            var fieldArray = [
                //{alias: 'objectid', name: 'objectid'}, 
                {
                    alias: 'Magnitude',
                    name: 'mag'
                },
                {
                    alias: 'Depth',
                    name: 'depth'
                },
                {
                    alias: 'Day',
                    name: 'day'
                },
                {
                    alias: 'Month',
                    name: 'month'
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
    gridFields = ["well_name", "depth_m"];
    var shallowWellsLayer =  new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/FORGE_WebmapSDE_View/FeatureServer/17",
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
        query.outfields = ["OBJECTID", "well_name", "depth_m"];
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
            gridFields = ["OBJECTID", "well_name", "depth_m"];
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
    gridFields = ["well_name", "depth_m"];
    var intWellsLayer =  new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/FORGE_WebmapSDE_View/FeatureServer/18",
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
        query.outfields = ["OBJECTID", "well_name", "depth_m"];
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
            gridFields = ["OBJECTID", "well_name", "depth_m"];
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
    gridFields = ["well_name", "depth_m"];
    var deepWellsLayer =  new FeatureLayer({
        url: "https://services.arcgis.com/ZzrwjTRez6FJiOq4/ArcGIS/rest/services/FORGE_WebmapSDE_View/FeatureServer/19",
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
        query.outfields = ["OBJECTID", "well_name", "depth_m"];
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
            gridFields = ["OBJECTID", "well_name", "depth_m"];
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

} else {
    
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
            mapView.map.add(intermediateWells);
        }
        if (e == false) {
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
        mapView.map.add(shallowWells);
        mapView.map.add(intermediateWells);
        mapView.map.add(deepWells);
        }
        if (e == false) {
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

});