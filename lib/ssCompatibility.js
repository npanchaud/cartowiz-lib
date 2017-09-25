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



/**********************************************************************************************************************/
/****************************** Warning  Lists from the Compatibility Checks ******************************************/

//  Warning lists where the warning are saved
smartSymbo.warningListLayersSel = []; // save as global object for easier later access
smartSymbo.warningListMapType = []; // save as global object for easier later access
smartSymbo.warningListMainlayers = []; // save as global object for easier later access
smartSymbo.warningListScale = []; // save as global object for easier later access



/**********************************************************************************************************************/
/*********************************** Compatibility Layer List *********************************************************/

/**
 * Check whether there is too many or too few layers to make a map. !! If return errors, the process cannot go on.
 * @param {array}    myLayersArray   array of layers to analyze
 * @return {boolean|object}          true if no error, which allow to go to the next step. Otherwise, object with error type and explanatory text
 */
function checkLayersNumber(layersArray) {
    var obj = {};
    if (layersArray.length > 12) { // checking if more than 12 layers
        obj = {
            "type": "error",
            "text": "You have selected more than 12 layers. Reduce your selection to 12 layers in the User Map by clicking on the red cross to remove layers."
        };
        return obj;
    }
    else if (layersArray.length < 1) { // checking if no layer
        obj = {
            "type": "error",
            "text": "Please select layers in order to use the wizard.\nClick on the + sign next to a layer to add it to the selection of the User Map.\nThe User Map becomes then available in the Map Category selection list."
        };
        return obj;
    }
    else {
        console.log(layersArray);
        return true;
    }
}


/**
 * Check compatibility between layers. Return only warnings, the process can go on with warnings.
 * @param  {object} layersArray  object array of layer in the map to check for warning
 * @return {object}             object array of all the warning found during the check
 */
function checkLayerList(layersArray) {
    console.log("called checkLayerList");
    var layerlistWarning = smartSymbo.warningListLayersSel;
    layerlistWarning.length = 0;

    // gather the category of all the layers -> check for category "thematic"
    var categoryList = [];
    for (var j = 0, len = layersArray.length; j < len; j++) {
        var category = layersArray[j].category;
        categoryList.push(category);
    }
    var categoryOccurences = countOccurences(categoryList); // calculate occurence of each category in the layer selection

    //
    var thematicArray = layersArray.filter(filterCategoryThematic);
    var labelThematic ="";
    for (var k=0, lenK = thematicArray.length; k<lenK;k++){
        var label =JSON.stringify(thematicArray[k].label);
        if (k===0){
            labelThematic += label;
        }
        else{
            labelThematic+=", "+ label;
        }
    }

    // gather the water layers
    var hydrography = layersArray.filter(filterHydrography);
    var hydroLine = hydrography.filter(function(obj) {
        return obj.geometryType === "line";
    });
    var hydroPolygon = hydrography.filter(function(obj) {
        return obj.geometryType === "polygon";
    });

    // gather polygon layer either landuse or thematic
    var landPolygon = layersArray.filter(filterThemeLandPolygon);
    var thematicPolygon = layersArray.filter(filterCategoryThematicPolygon);

    // gather map images
    var mapImages = layersArray.filter(filterCategoryMapImages);

    // check for only a few layers
    if (layersArray.length >= 1 && layersArray.length <= 2) {
        // push to the array: [id, short text, long text] in an array themselves
        layerlistWarning.push(["warningFewLayers", "Warning", "Only a few layers", "You only have selected a few layers, are you sure all the information for the map are present?"]);
    }

    // check for concurrent presence of river and lake
    if (hydrography) {
        if (hydroLine.length > 0 && hydroPolygon.length < 1) {
            layerlistWarning.push(["warningNoLake", "Warning", "No lakes?", "It seems that you might have selected rivers but no lakes."]);
        }
        else if (hydroLine.length < 1 && hydroPolygon.length > 0) {
            layerlistWarning.push(["warningNoRiver", "Warning", "No rivers?", "It seems that you might have selected lakes but no rivers."]);
        }
        else {
            // do nothing
        }
    }

    // check for presence of thematic layer
    if (categoryOccurences.thematic > 0) {
        if (categoryOccurences.thematic <= 3) {
            //  thematic not supported
            layerlistWarning.push(["warningThematic", "Warning", "Thematic layer(s)", "The wizard does not support thematic layers yet. They will not be taken into account for the symbolization: "  +labelThematic]);

        }
        else {
            // thematic not supported & too many
            layerlistWarning.push(["warningTooManyThematic", "Warning", "Too many thematic layers", "You should not select so many thematic layers for a single map. Pick 3 or less. Additionally, thematic layers are not supported yet and will not be taken into acocunt for the symblization."]);
        }
    }

    // check for landuse and thematic polygon layers combination
    if (landPolygon.length > 0 && thematicPolygon.length > 0) {
        layerlistWarning.push(["warningLanduseThematic", "Warning", "Thematic and landuse overlaps", "Combining polygonal layers representing landuse and thematic data will lead to overlapping features and lesser readability of the map."]);
    }

    // check for category=mapimage layers
    if (mapImages.length > 0) {
        layerlistWarning.push("warningMapImage", "Warning", "Maps as images are difficult to combine", "Maps as images are difficult to use in combination with other layers and lead to overlaps.");
    }

    //console.log(layerlistWarning);
    return layerlistWarning;
}



/**********************************************************************************************************************/
/*********************************** Compatibility Map Type ***********************************************************/

/**
 * Check whether warnings are necessayry based on the map definition and save the warning in an array
 * @param  {array} layersArray  object array of layers
 * @param  {object} map         map object to be inspected
 * @return {object}         object array of the warnings detected during the check
 */
function checkMapType(layersArray, map) {
    console.log("called checkMapType");
    var mapTypeWarning = smartSymbo.warningListMapType; // access array to save the warning
    mapTypeWarning.length = 0; //empty array from previous values
    var mapType = map.type;

    // gather layers in specific lists
    var listThematic = layersArray.filter(filterCategoryThematic);
    var listNatural = layersArray.filter(filterCategoryNatural);
    var listCultural = layersArray.filter(filterCategoryCultural);
    var listMapImages = layersArray.filter(filterCategoryMapImages);
    var boundary = listCultural.filter(function(obj) {
        return obj.theme === "admin";
    });
    var water = listNatural.filter(function(obj) {
        return obj.theme === "water";
    });

    // Get the labels of the thematic alyers
     var labelThematic ="";
    for (var k=0, lenK = listThematic.length; k<lenK;k++){
        var label =JSON.stringify(listThematic[k].label);
        if (k===0){
            labelThematic += label;
        }
        else{
            labelThematic+=", "+ label;
        }
    }

    // Get the labels for physical and non water
    var labelNaturalNonHydro="";
        for (var l=0, lenL = listNatural.length; l<lenL;l++){
        var labelN =JSON.stringify(listNatural[l].label);

        if(listNatural[l].theme != "water"){
            if (l===0){
                    labelNaturalNonHydro += labelN;
                }
                else{
                    labelNaturalNonHydro+=", "+ labelN;
                }
            }
            console.log(labelNaturalNonHydro);
        }

    // Start checking according to map type
    if (mapType == "General") {
        if (listThematic.length >= 2) {
            mapTypeWarning.push(["errorTooManyThematic", "Error", "Too many thematic layers", "In a general map, you cannot have 2 or more thematic layers. Either change the map type or remove one thematic layer: "+ labelThematic]);
        }
    }
    else if (mapType == "Physical") {
        if (listNatural.length < 1) {
            mapTypeWarning.push(["errorNoNatural", "Error", "There is no natural layer", "In a physical map, you need at least one natural layer of information, which you have not here."]);
        }
        if (listThematic.length > 0) {
            mapTypeWarning.push(["errorThematic", "Error", "Thematic layer present", "In a physical map, you cannot have a thematic layer, which you have here: " +labelThematic]);
        }

        if (listCultural.length < 1) {
            // comment form previous version:  error: but I dont remember why or what -> admin theme allowed? TO DO
        }
    }
    else if (mapType == "Political") {
        if (boundary.length < 1) {
            mapTypeWarning.push(["errorNoBoundary", "Error", "Administrative boundaries absent", "In a political map, you need administrative boundaries, which you do not have here."]);
        }
        if (listThematic.length > 0) {
            mapTypeWarning.push(["errorThematic", "Error", "Thematic layer present", "In a political map, you cannot have a thematic layer, which you have here: " + labelThematic]);
        }
        if (listNatural.length > water.length) {
            mapTypeWarning.push(["warningNatural", "Warning", "Too many natural layers", "Traditionally, in a political map, there is little information about the physical landscape, except for rivers and lakes. You might have too much such information here: " +labelNaturalNonHydro]);
        }
    }
    else if (mapType == "Thematic") {
        if (listThematic < 1) {
            mapTypeWarning.push(["errorNoThematic", "Error", "Thematic layer needed", "In a thematic map, you need at least one thematic layer, which you do not have here."]);
        }
        if (listCultural.length + listNatural.length >= 5) {
            mapTypeWarning.push(["warningTooManyAdd", "Warning", "Too many non thematic layers", "In a thematic map, the focus is on the thematic information. You might have too many additional information and this might clutter your map."]);
        }
    }
    return mapTypeWarning;
}



/**********************************************************************************************************************/
/*********************************** Compatibility Main Layer *********************************************************/

/**
 * Check whether warnings are necessayry based on the main layers and save the warning in an array
 * @param {array} listMainLayers array of idName of the main layers
 * @return {object} object array of the warning found in the check
 */
function checkMainLayers(listMainLayers) {
    console.log("called checkMainLayers");
    var mainLayersWarning = smartSymbo.warningListMainlayers; // access array to save the warning
    mainLayersWarning.length = 0; // empty array
    if (!listMainLayers[0] && !listMainLayers[1]) { // no main layers
        //warning
        mainLayersWarning.push(["warningNoMainLayer", "Warning", "No main layer", "You haven't selected any main layer. Are you sure you want to go on without any main layer?"]);
    }
    else if (listMainLayers[0] == listMainLayers[1] && listMainLayers[0] != "none") { // Same layer twice
        //error
        mainLayersWarning.push(["errorSameMainLayers", "Error", "Twice same main layer", "You have selected twice the same layer as main layer. Pick two different layers, only one, or none."]);
    }
    else if (!listMainLayers[1]) { // warning: there is the possibility to have more than one main layer
        //warning
        mainLayersWarning.push(["warningOneMainLayer", "Warning", "Only one main layer", "You only selected one main layer for your map. If you are sure, ignore this warning"]);
    }
    console.log(mainLayersWarning);
    return mainLayersWarning;
}



/**********************************************************************************************************************/
/*********************************** Compatibility Scale **************************************************************/

/**
 * Check whether warnings are necessary based on the map and layers scales and save the warning in an array
 * @param  {number} mapScale    current map scale, only the divisor
 * @param  {object} layersArray array of alyers to be checked against the map scale
 * @return {object}              object array of the warning found in the check
 */
function checkScale(mapScale, layersArray) {
    console.log("called checkScale");
    smartSymbo.myMap.scale = parseFloat(mapScale); // update scale in the map object
    var scaleWarning = smartSymbo.warningListScale; // access array to save the warning
    scaleWarning.length = 0; // empty array

    var tooDetailedArray = [];
    var tooGeneralizedArray = [];

    for (var i = 0; i < layersArray.length; i++) {
        var minScale = parseFloat(layersArray[i].minScale);
        var maxScale = parseFloat(layersArray[i].maxScale);
        var layerLabel = layersArray[i].label;
        if (mapScale < minScale) {
            tooGeneralizedArray.push(layerLabel);
        }
        else if (mapScale > maxScale) {
            tooDetailedArray.push(layerLabel);
        }
        else {
            // do nothing
        }
    }

    // check whether 1 or more layers are too generalized
    if (tooGeneralizedArray.length > 1) {
        scaleWarning.push(["warningTooGenX", "Warning", "", "The following layers have a smaller scale than the map. Thus they might be not detailed enough: " + tooGeneralizedArray.toString() + ". "]);
    }
    if (tooGeneralizedArray.length == 1) {
        scaleWarning.push(["warningTooGen", "Warning", "", "The following layer has a smaller scale than the map. Thus it might be not detailed enough: " + tooGeneralizedArray[0] + ". "]);
    }
    // check whether 1 or more layers are too detailed
    if (tooDetailedArray.length > 1) {
        scaleWarning.push(["warningTooDetX", "Warning", "", "The following layers have a larger scale than the map. Thus they might be too detailed: " + tooDetailedArray.toString() + ". "]);
    }
    if (tooDetailedArray.length == 1) {
        scaleWarning.push(["warningTooDet", "Warning", "", "The following layer has a larger scale than the map. Thus it might be too detailed: " + tooDetailedArray[0] + ". "]);
    }
    console.log(scaleWarning);
    return scaleWarning;
}


/**********************************************************************************************************************/
/*********************************** Compatibilty Check all functions *************************************************/

/**
 * Call all the checkWarning functions to be sure there is no error left
 * @return {string|boolean} error description or true if no error
 */
function checkErrorMapDef() {
    console.log("called checkErrorMapDef");
    var listMT = smartSymbo.warningListMapType;
    var listML = smartSymbo.warningListMainlayers;
    var listS = smartSymbo.warningListScale;
    var list = listMT.concat(listML);
    var listWarnings = list.concat(listS);

    console.log(listWarnings);

    for (var i = 0, len = listWarnings.length; i < len; i++) {
        if (listWarnings[i][1] == "Error") {
            var string = listWarnings[i][3];
            return string;
        }
    }
    return true;
}
