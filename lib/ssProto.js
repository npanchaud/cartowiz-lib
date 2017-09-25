/***********************************************************************************************************************
 *
 * @author Nadia Panchaud, Institute of Cartography and Geoinformation, ETH Zurich
 * @copyright © ETH Zurich 2014-2017, Nadia Panchaud
 * @license GNU General Public License v3 http://www.gnu.org/licenses/
 *
 *  CartoWiz is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  If you use the CartoWiz library, please link to the CartoWiz project (https://npanchaud.github.io/cartowiz/)
 *  somewhere in the source-code-comment or the "about" of your project and give credits, thanks!
 *
 *  Please report bugs and send improvement suggestions to <nadia.panchaud@alumni.ethz.ch>
 *
 **********************************************************************************************************************/


/*********************************************************************************************************************/
/******************************* Prototypes to be used as constructors for the map objects ***************************/

/**
 * Main object, holding the contextual map model, linked to the window element because it's declared as global
 * @type {Object}
 */
smartSymbo = {}; // when creating the map object -> smartSymbo.myMap = new Map();

/**
 * Object to hold the log of the layerOrder function
 * @type {Object}
 */
smartSymbo.orderLog = {}; // object to save the code of re-ordering operations for each layer

/**
 * Object to hold the log of the assignGround function
 * @type {Object}
 */
smartSymbo.groundLog = {}; // object to save the code of ground assignment operations for each layer


/**
 * Create a Map Object
 * @constructor
 * @param {string} type    type of map: general, physical, political, thematic
 * @param {number} scale   calculated from the ratio map image width/coordinates width
 * @param {array} extent   read from the selection frame
 * @param {number} refSys  epsg code of the reference system
 */
function Map(type, scale, extent, refSys) {
    var nrArguments = 4;
    if (arguments.length == nrArguments) {
        //this.id = id; // not used, but could be necessary for saving parameters or handling sevral maps
        this.type = type;
        this.scale = scale;
        this.extent = extent;
        this.referenceSystem = refSys;

        this.mainLayersArray = []; // array holding the idName of the map main layers, limited at 2
        this.assignMainLayer = function(idName) {
            this.mainLayersArray.push(idName);
        };

        this.foreGround = []; // arrays hollding the list of layers assigned to foreground
        this.middleGround = []; // arrays hollding the list of layers assigned to middleground
        this.backGround = []; // arrays hollding the list of layers assigned to background

        this.layersArray = []; // array holding the layer objects
        /**
         * Create and assign Layer object
         * @param {string} idName       layerName as used by the WMS
         * @param {string} label        label of the layer used for display
         * @param {string} category     category of the layer: physical, cultural, thematic, map
         * @param {string} theme        theme of the layer
         * @param {number} minScale     minimal scale at which the layer should be used
         * @param {number} maxScale     maximal scale at which the layer should be used
         * @param {string} geometryType type of geometries in the layer: [point | line | polygon | raster]
         * @param {number} index        index number of the layer in the stack: 0 = first layer drawn on the canvas
         * @param {string} position     OPTIONAL: [background | middleground | foreground]
         * @param {boolean} priority     OPTIONAL whether a main layer or not. true = main layer
         */
        this.addLayer = function(idName, label, category, theme, minScale, maxScale, geometryType, index, position, priority) {
            var layer = new Layer(idName, label, category, theme, minScale, maxScale, geometryType, index, position, priority);
            this.layersArray.push(layer);
        };

    }
    else {
        alert("Error in the map constructor: wrong number of arguments! You have to pass over " + nrArguments + " parameters.");
    }
}


/**
 * Create a Layer Object, called by the addLayer() method in the Map object
 * @constructor
 * @param {string} idName       layerName as used by the WMS
 * @param {string} label        label of the layer used for display
 * @param {string} category     category of the layer: physical, cultural, thematic, map
 * @param {string} theme        theme of the layer
 * @param {number} minScale     minimal scale at which the layer should be used
 * @param {number} maxScale     maximal scale at which the layer should be used
 * @param {string} geometryType type of geometries in the layer: [point | line | polygon | raster]
 * @param {number} index        index number of the layer in the stack: 0 = first layer drawn on the canvas
 * @param {string} position     OPTIONAL: [background | middleground | foreground]
 * @param {boolean} priority     OPTIONAL whether a main layer or not. true = main layer
 */
function Layer(idName, label, category, theme, minScale, maxScale, geometryType, index, position, priority) {
    var nrArguments = 10;
    if (arguments.length == nrArguments) {
        this.idName = idName;
        this.label = label;
        this.theme = theme;
        this.category = category;
        this.minScale = minScale;
        this.maxScale = maxScale;
        if (!priority) { // whether a main layer or not
            this.priority = false;
        }
        else {
            this.priority = priority;
        }
        if (!position) { // position in one of the ground
            this.position = ""; // values defined later: background, middleground, foreground
        }
        else {
            this.position = position;
        }
        this.opacity = 1; // 1 = fully opaque, 0 = fully transparent
        this.geometryType = geometryType; //
        this.index = index; //
        this.attributeArray = []; // array holding the attributes objects
        /**
         * Create and add an attribute object to the layer
         * @param {[string} name name of the attribute – label
         * @param {string} type type [nominal | ordinal | interval | ratio]
         */
        this.addAttribute = function(name, type) {
            var attribute = new Attribute(name, type);
            this.attributeArray.push(attribute);
        };
        this.style = {};
        /**
         * Create and assign a style object to the layer !! not implemented yet
         * @param {string} type       classification used for the style [unique value | categories | graduated]
         * @param {object} symbolizer [description]
         * @param {object} rules [description]
         */
        this.addStyle = function(type, symbolizer, rules) { // TO DO: fully implement
            this.style = new Style(type, symbolizer, rules);
        };
    }
    else {
        alert("Error in the layer constructor: wrong number of arguments! You have to pass over " + nrArguments + " parameters.");
    }
}



/**
 * Create an attribue (called by the addAttribute()  method in the Layer object)
 * @constructor
 * @param {string} name name of the attribute – label
 * @param {string} type type [nominal | ordinal | interval | ratio]
 */
function Attribute(name, type) {
    var nrArguments = 2;
    if (arguments.length == nrArguments) {
        this.name = name;
        this.type = type;
        //this.value = [];           // array of all the unique value; for the thematic module
        var attribute = {
            name: name,
            type: type
        }; // TO DO: create an object with the value
    }
    else {
        alert("Error in the attribute constructor: wrong number of arguments! You have to pass over " + nrArguments + " parameters.");
    }
}

/**
 * Create a style object (called by the addStyle() method in the Layer object) !! not implemented yet
 * @constructor
 * @param {string} type        classification used for the style: unique value, categories, graduated
 * @param {string} symbolizer type of symbolizer: point, line, polygon
 * @param  {object}  rules      rules to assign symbolizer to features [not implemented yet]
 */
function Style(type, symbolizer, rules) {
    var nrArguments = 3;
    if (arguments.length == nrArguments) {
        this.classificationType = type;
        this.symbolizer = symbolizer;
        if (!rules) {
            this.rules = "";
        }
        else {
            this.rules = rules;
        }
    }
    else {
        alert("Error in the attribute constructor: wrong number of arguments! You have to pass over " + nrArguments + " parameters.");
    }
}

/**
 * Get information about the map
 * @return {object} return the main parameters of the map
 */
function getMapInfo() {
    var map = smartSymbo.myMap;
    var layerList = [];
    for (var i = 0, len = map.layersArray.length; i < len; i++) {
        layerList.push(map.layersArray[i].label);
    }
    var mapInfo = {
        "map_type": map.type,
        "map_scale": map.scale,
        "map_extent": map.extent,
        "reference_system": map.referenceSystem,
        "main_layers": map.mainLayersArray,
        "layer_list": layerList,
        "foreground_layers": map.foreGround,
        "middleground_layers": map.middleGround,
        "background_layers": map.backGround
    };
    //console.log(mapInfo);
    return mapInfo;
}

/**
 * Get information about a specific layer
 * @param  {string|number} val Either the idName, label or index of the layer
 * @return {object}     return the main parameters of the layer
 */
function getLayerInfo(val) {
    var layersArray = smartSymbo.myMap.layersArray;
    var layer;
    if (typeof val === "number") {
        // match to the attribute
        layer = layersArray[val];
    }
    if (typeof val === "string") {
        // match to the idName or label
        var labelIdx = findWithAttr(layersArray, "label", val);
        var idNameIdx = findWithAttr(layersArray, "idName", val);
        if (labelIdx === false && idName === true) {
            layer = layersArray[idNameIdx];
        }
        else if (labelIdx === true && idName === false) {
            layer = layersArray[labelIdx];
        }
        else {
            return "Could not find this layer. This function supports the index, label and idName of the layer.";
        }
    }
    var layerInfo = {
        "layer_idName": layer.idName,
        "layer_label": layer.label,
        "layer_category": layer.category,
        "layer_theme": layer.theme,
        "layer_geometry": layer.geometryType,
        "layer_position": layer.position,
        "layer_priority": layer.priority
    };
    //console.log(layerInfo);
    return layerInfo;
}
