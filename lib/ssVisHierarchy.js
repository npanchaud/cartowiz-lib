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
/******************************* Helper functions *********************************************************************/

/*
 * Write in the console a validation message when a layer has been evaluated by the assignToGround function. For debugging
 * @param  {string} name     idName of the layer
 * @param  {number} position index of the layer in the stack
 */
function writeValidation(name, position) { // output the validation that the layer has been evaluated
    console.log(name + " (#" + position + ") has been evaluated");
}

/*
 * Check whether a string is one item of an array
 * @param  {[array} arr array to search
 * @param  {string} str string to search for in the array
 * @return {boolean}     return true if found, otherwise false
 */
function contains(arr, str) { // check whether a string is in an array
    var i = arr.length;
    for (i in arr) {
        if (arr[i] == str) return true;
    }
    return false;
}

/*
 * Find index of an item with given key=value from an object array
 * @param  {array} array   array to search
 * @param  {string} key   key
 * @param  {string} value value of the key to search
 * @return {integer}       if the item is found, return the index  of the item
 */
function findIndexByKeyValue(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            return i;
        }
    }
    return null;
}

/**********************************************************************************************************************/
/***************************** GROUND ASSIGNMENT: background, middleground, foreground ********************************/

/**
 * Assign the different layers to either back-, middle-, or foreground
 * @return {array} array of the back-, middle-, and foreground layers
 */
function assignToGroundGeneral() {
    // Set variables
    var map = smartSymbo.myMap;
    var mainLayersArray = map.mainLayersArray;
    var layersArray = map.layersArray;
    var mainLayer1;
    var mainLayer2;
    var groundLog = smartSymbo.groundLog;

    // empty grounds in the map object
    map.foreGround = [];
    map.middleGround = [];
    map.backGround = [];

    if (mainLayersArray[0] != "none") {
        mainLayer1 = mainLayersArray[0];
    }
    if (mainLayersArray[1] != "none") {
        mainLayer2 = mainLayersArray[1];
    }
    // This should go within the black box switch afterwards
    for (var i = 0; i < layersArray.length; i++) { // go through the layers array
        var layerIdName = layersArray[i].idName;
        var layerLabel = layersArray[i].label;
        var geometryType = layersArray[i].geometryType;
        var layerPriority = layersArray[i].priority;
        var layerTheme = layersArray[i].theme;
        var layerCategory = layersArray[i].category;
        var layerPosition = layersArray[i].index;

        // General Rules
        if (layerLabel == mainLayer1 || layerLabel == mainLayer2) { // assign main layer(s) to the forground
            console.log(layerLabel + " is assigned to the foreground because it is one of the main layers.");
            map.foreGround.push(layerLabel);
            map.layersArray[i].position = "foreground";
            //writeValidation(layerLabel,layerPosition); // debbuging purpose
            addToLog(layerLabel, "G0001", "groundLog");
        }
        else if (geometryType == "raster" || layerCategory == "readymap") { // raster and ready-to-use map -> background (as long as not main layer)
            // assumption is: if not main layer, then background
            map.backGround.push(layerLabel);
            map.layersArray[i].position = "background";
            //writeValidation(layerLabel,layerPosition);
            console.log(layerLabel + " is a raster or ready-to-use map layer and assigned to the background.");
            addToLog(layerLabel, "G0002", "groundLog");
        }
        else if (geometryType == "polygon" && layerTheme != "water") { // assume that a polygon layer not as a main layer is in the background
            map.backGround.push(layerLabel);
            map.layersArray[i].position = "background";
            //writeValidation(layerLabel,layerPosition);
            console.log(layerLabel + " is assigned to the background because of its geometry type polygon.");
            addToLog(layerLabel, "G0003", "groundLog");
        }
        else { //if doesn't qualify for any of the above, assign to middle ground by default
            map.middleGround.push(layerLabel);
            map.layersArray[i].position = "middleground";
            //writeValidation(layerLabel,layerPosition);
            console.log(layerLabel + " is assigned to the middleground by default");
            addToLog(layerLabel, "G0004", "groundLog");
        }
    }
    var specific = assignToGroundSpecific();
    return specific;
}


/**
 * Assign the layers to the different ground based on specific parameters linked to specific map types
 */
function assignToGroundSpecific() {
    // assign variables
    var map = smartSymbo.myMap;
    var layersArray = map.layersArray;
    var foreground = map.foreGround; // assiging the arrays to the Map object
    var background = map.backGround;
    var middleground = map.middleGround;

    // make a second round through the layers, but map type  specific rules
    for (var k = 0; k < layersArray.length; k++) { // go through the layers array
        var layerIdName = layersArray[k].idName;
        var layerLabel = layersArray[k].label;
        var geometryType = layersArray[k].geometryType;
        var layerPriority = layersArray[k].priority;
        var layerTheme = layersArray[k].theme;
        var layerCategory = layersArray[k].category;
        var layerPosition = layersArray[k].index;
        var layerBackground = contains(background, layerLabel); // true if the layer ended up in background
        var layerMiddleground = contains(middleground, layerLabel); // true if the layer ended up in middleground
        var layerForeground = contains(foreground, layerLabel); // true if the layer ended up in foreground

        if (map.type == "General") {
            // so far, no extra rules
        }
        else if (map.type == "Thematic") {
            // if thematic layers ended up in the background -> send back to foreground
            if (layerCategory == "thematic" && (layerBackground)) {
                var index = background.indexOf(layerLabel); // ge the index of the element
                if (index >= 0) {
                    background.splice(index, 1);
                } // remove the element from the array "background"
                foreground.push(layerLabel); // add layer to the array "foreground"
                map.layersArray[k].position = "foreground";
                console.log(layerLabel + " is assigned to foreground because it is a thematic layer in a thematic map.");
                addToLog(layerLabel, "S0401", "groundLog");
            }
        }
        else if (map.type == "Physical") {}
        else if (map.type == "Political") {
            // if there is an admin layer, set as foreground
            if (layerTheme == "admin") {
                if (layerForeground) {
                    // correct, do nothing
                    addToLog(layerLabel, "S0301", "groundLog");
                }
                else if (layerMiddleground) {
                    var indexM = middleground.indexOf(layerLabel); // ge the index of the element
                    if (indexM >= 0) {
                        middleground.splice(indexM, 1);
                    } // remove the element from the array "background"
                    foreground.push(layerLabel); // add layer to the array foreground"
                    map.layersArray[k].position = "foreground";
                    console.log(layerLabel + " is assigned to the foreground because it is a political map");
                    addToLog(layerLabel, "S3401", "groundLog");
                }
                else if (layerBackground) {
                    var indexB = background.indexOf(layerLabel); // get the index of the element
                    if (indexB >= 0) {
                        background.splice(indexB, 1);
                    } // remove the element from the array "background"
                    foreground.push(layerLabel); // add layer to the array "foreground"
                    map.layersArray[k].position = "foreground";
                    console.log(layerLabel + " is assigned to the foreground because it is a political map");
                    addToLog(layerLabel, "S3401", "groundLog");
                }
                else {
                    alert("something went wrong. the layer should have been assigned during the previous step.");
                }
            }
        }
        else {
            // do nothing more
        }
    }
    //console.log("F: " + foreground + "   M: " + middleground + "   B: " + background);
    return [background, middleground, foreground];
}


/**
 * Help adding a label to a ground
 * @param {array} ground    ground to which to add the label
 * @param {string) label  the label to be added
 */
function addToGround(ground, label) { //
    ground.push(label);
    console.log(label + " moved to new grounds");
}

/**
 * Help removing label from all the ground lists
 * @param  {string} label label to be removed
 */
function removeFromGround(label) {
    var background = smartSymbo.myMap.backGround;
    var middleground = smartSymbo.myMap.middleGround;
    var foreground = smartSymbo.myMap.foreGround;

    if (contains(background, label)) {
        var posB = background.indexOf(label);
        background.splice(posB, 1);
        console.log(label + " removed from BG");
    }
    else if (contains(middleground, label)) {
        var posM = middleground.indexOf(label);
        middleground.splice(posM, 1);
        console.log(label + " removed from MG");
    }
    else if (contains(foreground, label)) {
        var posF = foreground.indexOf(label);
        foreground.splice(posF, 1);
        console.log(label + " removed from FG");
    }
}


/**********************************************************************************************************************/
/***************************** BACKGROUND METHODS: Grayscale and Smart ***********************************************/

/**
 * Asses the mehtod chosen and call the nmethod function
 * @param  {string} grId ID of the group in which the button is
 * @param  {object} evt  event that call teh callback function
 * @param  {string} text text on the button
 */
function applyBGMethod(grId, evt, text) {
    console.log("called applyBGMethod");

    // Grab variables
    var background = smartSymbo.myMap.backGround;
    var middleground = smartSymbo.myMap.middleGround;
    var foreground = smartSymbo.myMap.foreGround;
    var layersArray = smartSymbo.myMap.layersArray;
    //var method = myMapApp.selectionLists.bgSymbo.getCurrentSelectionElement();
    var method = text;

    if (background.length < 1) { // if no layer in the background, state that nothing will change
            alert("no backgroud layer in the model");
    }
    else {
        // loop through the layers in the background array
        for (var i = 0; i < background.length; i++) {
            //get the variable matching the label in the background array
            var label = background[i];
            var index = findIndexByKeyValue(layersArray, "label", label);
            var idName = layersArray[index].idName;
            var rasterOp = false;

            var rasterBackgroundCollection = layersArray.filter(filterRasterBackground);
            if (rasterBackgroundCollection.length > 0) {
                rasterOp = true; // if there is a raster background -> vector layers on top should not be too pale
            }
            // if raster, we don't want to apply the vector method
            if (layersArray[index].geometryType == "raster") {}
            else {

                if (method == "Smart") {
                    //alert(rasterOp);
                    callSmartBG(index, idName, rasterOp);
                }
                else if (method == "Grayscale") {
                    callGrayscaleBG(index, idName);
                }
                else if (method == "Desaturation") {
                    callLessSaturated(index, idName);
                }
                else if (method == "Opacity") {
                    callLessOpacity(index, idName);
                }
                else if (method == "none") {
                    callOriginalStyle(idName, index);
                }
                else {
                    //do nothing
                }
            }
        }
    }

}

/**
 * Deal with the opacity of the different layers based on background content and geometries
 */
function dealWithOpacity() {
    console.log("called dealWithOpacity");
    var layersArray = smartSymbo.myMap.layersArray;
    var rasterBackgroundCollection = layersArray.filter(filterRasterBackground);
    var thematicPolCollection = layersArray.filter(filterCategoryThematicPolygon);
    console.log(rasterBackgroundCollection);

    // start with setting back all the layers on full opacity =1
    for (var j=0,lenJ=layersArray.length;j<lenJ;j++){
        smartSymbo.myMap.layersArray[j].opacity=1;
    }



    if (rasterBackgroundCollection.length > 0) { // if there is a raster in background, we might need to reduce opacity
        for (var i = 0, len = layersArray.length; i < len; i++) {
            var idName = layersArray[i].idName;
            var label = layersArray[i].label;
            if (layersArray[i].geometryType == 'raster' && layersArray[i].position == 'background') {
                //setOpacity(i, idName, 0.5);
                layersArray[i].opacity = 0.5;
                console.log("changed opacity " + label + " because it is a raster in the background.");
            }
            else if (layersArray[i].geometryType == 'polygon' && layersArray[i].position == 'background' && layersArray[i].theme != 'water') {
                //setOpacity(i, idName, 0.7);
                layersArray[i].opacity = 0.7;
                console.log("changed opacity  " + label + " because it is a polygon in the background and there is a raster background as well.");
            }
            else if (layersArray[i].geometryType == 'polygon' && layersArray[i].position == 'foreground' && layersArray[i].category == 'thematic') {
                //setOpacity(i, idName, 0.85);
                layersArray[i].opacity = 0.85;
                console.log("changed opacity  " + label + " because it is a polygon in the foreground and there is a raster background.");
            }
            else {
                //do nothing
            }
        }
    }
    else if (thematicPolCollection.length > 0) {
        for (var k = 0, lenK = layersArray.length; k < lenK; k++) {
            if (layersArray[k].geometryType == 'polygon' && layersArray[k].category == 'thematic') {
                //setOpacity(k, layersArray[k].idName, 0.85);
                layersArray[k].opacity = 0.85;
            }
        }
    }
}

/**
 * Call the function to apply the smart BG for each layer in the abckground
 * @param  {number} index              index of the layer in the layer stack
 * @param  {string} idName             idName of the layer
 * @param  {boolean} rasterTransparency whether we need transparency to adapt to a raster background
 * @return {[type]}                    [description]
 */
function callSmartBG(index, idName, rasterTransparency) {
        dealWithOpacity();
    // access to variables
    var background = smartSymbo.myMap.backGround;
    var layersArray = smartSymbo.myMap.layersArray;
    var sldValues = window.sldOrigValue["defaultV_" + idName];
    var geom = layersArray[index].geometryType;
    var coef;

    // Define placeholder for values
    var fillArray = [];
    var strokeArray = [];

    // Switch according to geometry type
    switch (geom) {
        //*** POLYGON ***//
        case 'polygon':
            //console.log('polygon ->fill analysed');

            Object.keys(sldValues).forEach(function(val, idx, array) { // callback with the following three args: element value, element index, array being traversed
                var col = sldValues[val];
                if (/fill.*/.test(val) && !/fillopacity.*/.test(val)) {
                    fillArray.push(col);
                }
                if (/stroke.*/.test(val) && !/strokewidth.*/.test(val)) {
                    strokeArray.push(col);
                }
            });
            break;
            //*** LINE ***//
        case 'line':
            console.log('line ->stroke analysed');
            // gather stats

            Object.keys(sldValues).forEach(function(val, idx, array) { // callback with the following three args: element value, element index, array being traversed
                //console.log(val)
                if (/stroke.*/.test(val) && !/strokewidth.*/.test(val)) {
                    var col = sldValues[val];
                    strokeArray.push(col);
                }
            });
            break;
    }

    // Different stats for fill and stroke. especially important for polygon layers, where the stroke are much darker than the fill
    var statsFill = {};
    var statsStroke = {};
    if (fillArray.length > 0) {
        statsFill = getColorsStats(fillArray);
    }
    if (strokeArray.length > 0) {
        statsStroke = getColorsStats(strokeArray);
    }

    var stats = {
        'fillStats': statsFill,
        'strokeStats': statsStroke
    };
    //console.log(stats);

    // Define a parameter so that the change are not too strong if the background layers are on top of a raster and with some transparency
    if (rasterTransparency) {
        //TO DO: check if the parameter is ok
        coef = 0.9;
    }
    else {
        coef = 1;
    }

    // apply the changes to the layer
    applySmartBG(idName, index, stats, coef);

}



/**
 * Call the apply** function for each layer in the background array
 * @param  {number} index  index of the layer
 * @param  {string} idName id name of the layer
 */
function callGrayscaleBG(index, idName) {
    dealWithOpacity();
    applyGrayscaleBG(idName, index);
}


/**
 * Call the apply** function for each layer in the background array
 * @param  {number} index  index of the layer
 * @param  {string} idName id name of the layer
 */
function callLessSaturated(index, idName) {
    dealWithOpacity();
    applyLessSaturated(idName, index);

}


/**
 * Call the apply** function for each layer in the background array
 * @param  {number} index  index of the layer
 * @param  {string} idName id name of the layer
 */
function callLessOpacity(index, idName) {
    applyLessOpacity(idName, index);
}



/**
 * Calculate a smart background style to the layer
 * @param  {string} layerId layer id name to which apply the style
 * @param  {string} i  layer index to which apply the style
 * @param  {object} stats   object containg the color stats
 * @param  {number} coef    coef for  transparency
 * @return {array} newSldValues
 */
function applySmartBG(layerId, i, stats, coef) {
    console.log("called applySmartBG");

    // duplicate original values in new object
    var sldOriginalValues = window.sldOrigValue["defaultV_" + layerId];
    var sldValues = JSON.parse(JSON.stringify(sldOriginalValues));

    // get the stats
    var maxLumFill = stats.fillStats.maxLum;
    var maxLumStroke = stats.strokeStats.maxLum;
    var maxCFill = stats.fillStats.maxC;
    var maxCStroke = stats.strokeStats.maxC;
    var maxLFill = stats.fillStats.maxLightness;
    var maxLStroke = stats.strokeStats.maxLightness;

    // save the original value
    var sldOriginals = sldValues;
    console.log(sldOriginals);

    // switch according to polygon/line geometries
    var geometry = smartSymbo.myMap.layersArray[i].geometryType;
    switch (geometry) {
        /****** POlYGON *****/
        case 'polygon':

            // Look for the original value and call function to transform them
            Object.keys(sldValues).forEach(function(val, idx, array) {
                // if FILL parameter found, change its value
                if (/fill.*/.test(val) && !/fillopacity.*/.test(val)) {
                    var newCol = changeToSmartBG(val, sldValues[val], layerId, maxLumFill, maxCFill, maxLFill, coef);
                    sldValues[val] = newCol;
                }
                // if STROKE parameter found, change its value
                if (/stroke.*/.test(val) && !/strokewidth.*/.test(val) && !/strokeopacity.*/.test(val)) {

                    // calculate new stroke color
                    var newColS = changeToSmartBG(val, sldValues[val], layerId, maxLumStroke, maxCStroke, maxLStroke, coef);
                    sldValues[val] = newColS;

                    // Check contrast issues
                    var originalContrast, newContrast;
                    var symboProp = val.slice(6); // get the name of the category. ex: wald

                    if (smartSymbo.myMap.layersArray[i].style.symbolizer) {

                        // calculate the original contrast
                        var originalFill = smartSymbo.myMap.layersArray[i].style.symbolizer[symboProp][0].fill;
                        var originalStroke = smartSymbo.myMap.layersArray[i].style.symbolizer[symboProp][0].stroke;
                        originalContrast = chroma.contrast(originalFill, originalStroke);

                        //calculate new contrast
                        var newFill = sldValues['fill' + symboProp];
                        var newStroke = newColS;
                        newContrast = chroma.contrast(newFill, newStroke);
                        console.log(symboProp + ": org " + originalContrast + ", new " + newContrast + " (" + newFill + ", " + newStroke + ")");
                    }

                    if (originalContrast == 1) { // the contrast was 1 originally (same color - no contrast)
                        // because single color, and color scheme are handle a bit differently,it can be that after transformation,
                        // they are different ->  here we check and go get the fill color so that it stays the same
                        sldValues[val] = sldValues['fill' + symboProp];
                        console.log("the contrast was 1 originally (=same color)");
                        //console.log(val+':  '+ sldValues[val]);
                    } else if (originalContrast > newContrast) {
                        //console.log("original contrast higher: good");

                        //if contrast goes below 1.25, not enought anymore
                        if (1.245 > newContrast) {
                            var loopColorStroke = sldValues[val]; // new color that will be resaturate/darken in loop
                            var newLoopColor;
                            var loopContrast = newContrast;
                            var vC = 0.3;
                            var vL = 0.1;
                            while (loopContrast < 1.245) {
                                newLoopColor = chroma(loopColorStroke).saturate(vC).hex();
                                newLoopColor = chroma(newLoopColor).darken(vL).hex();
                                loopContrast = chroma.contrast(sldValues['fill' + symboProp], newLoopColor);
                                vC += 0.1;
                                vL += 0.1;
                                console.log(sldValues[val] + ' and now: ' + newLoopColor);
                                console.log("contrast: " + loopContrast);
                            }
                            sldValues[val] = chroma(newLoopColor).hex();

                        }

                    } else if (originalContrast < newContrast) { // should not happen
                        console.log("there must be a mistake");
                    }
                }

            });
            break;
            /****** LINE *****/
        case 'line':
            // Look for the original value and call function to transform them
            Object.keys(sldValues).forEach(function(val, idx, array) {
                // if STROKE parameter found, change its value
                if (/stroke.*/.test(val) && !/strokewidth.*/.test(val) && !/strokeopacity.*/.test(val)) {
                    var newLineCol = changeToSmartBG(val, sldValues[val], layerId, maxLumStroke, maxCStroke, maxLStroke, coef);
                    sldValues[val] = newLineCol;
                }
            });
            break;
        default:
            // point geometries, not supported, nothing happen
    }

    // update the sld
    updateSLD(layerId, i, sldValues);
    return sldValues;
}


/**
 * Calculate a grayscale style to the layer
 * @param  {string} layerId layer id name to which apply the style
 * @param  {string} i  layer index to which apply the style
 * @return {array} new sld values
 */
function applyGrayscaleBG(layerId, i) {
    console.log("called applySGrayscaleBG");
    // duplicate the original values
    var sldValues = JSON.parse(JSON.stringify(window.sldOrigValue["defaultV_" + layerId]));

    // Look for the original value and call function to transform them
    Object.keys(sldValues).forEach(function(val, idx, array) {
        // if FILL parameter found, change its value
        if (/fill.*/.test(val) && !/fillopacity.*/.test(val)) {
            var newColorFill = changeToGrayscale(val, sldValues[val], layerId);
            sldValues[val] = newColorFill;

        }
        // if STROKE parameter found, change its value
        if (/stroke.*/.test(val) && !/strokewidth.*/.test(val) && !/strokeopacity.*/.test(val)) {
            var newColorStroke = changeToGrayscale(val, sldValues[val], layerId);
            sldValues[val] = newColorStroke;
        }
        else {
            //alert("not fill");
        }
        return;
    });
    updateSLD(layerId, i, sldValues);
    return sldValues;
}

/**
 * Calculate a less saturated style to the layer
 * @param  {string} idName layer id name to which apply the style
 * @param  {string} index  layer index to which apply the style
 * @return {array} new sld values
 */
function applyLessSaturated(idName, i) {
    console.log("called applyLessSaturated");
    // Duplicate the original values
    var sldValues = JSON.parse(JSON.stringify(window.sldOrigValue["defaultV_" + idName]));

    // Look for the original value and call function to transform them
    Object.keys(sldValues).forEach(function(val, idx, array) {
        // if FILL parameter found, change its value
        if (/fill.*/.test(val) && !/fillopacity.*/.test(val)) {
            var newColorFill = changeToLessSaturation(val, sldValues[val], idName);
            sldValues[val] = newColorFill;
        }
        // if STROKE parameter found, change its value
        if (/stroke.*/.test(val) && !/strokewidth.*/.test(val) && !/strokeopacity.*/.test(val)) {
            var newColorStroke = changeToLessSaturation(val, sldValues[val], idName);
            sldValues[val] = newColorStroke;
        }
        else {
            //alert("not fill");
        }
        return;
    });
    updateSLD(idName, i, sldValues);
        return sldValues;
}

/**
 * Apply some opacity  to the layer
 * @param  {string} idName layer id name to which apply the opacity
 * @param  {string} index  layer index to which apply the opacity
 */
function applyLessOpacity(idName, index) {
    //setOpacity(index, idName, 0.5); remove because GUI
    smartSymbo.myMapApp.layersArray[index].opacity = 0.6;
    var sldValues = JSON.parse(JSON.stringify(window.sldOrigValue["defaultV_" + idName]));
    updateSLD(idName,index,sldValues);
}



/**
 * Call the method to change the style
 * @param  {string} idName layer id name concerned
 * @param  {string} index  layer index concerned
 */
function callOriginalStyle(idName, index) {
     //dealWithOpacity();
    applyOriginalStyle(idName, index);
}

/**
 * Apply the original style to the layer
 * @param  {string} idName layer id name to which apply the style
 * @param  {string} index  layer index to which apply the style
 * @return {array} orsiginal sld values
 */
function applyOriginalStyle(idName, index) {
    console.log("called applyOriginalStyle");
    // duplicate original values
    var sldValues = JSON.parse(JSON.stringify(window.sldOrigValue["defaultV_" + idName]));
    smartSymbo.myMap.layersArray[index].opacity=1;
    updateSLD(idName, index, sldValues);
    return sldValues;
}
