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
/******************************************* Layer Order **************************************************************/


/**
 * Add the explanation code to the log of explanation
 * @param {string} layerI   layer(below) to whicht the code pertain
 * @param {string} code     code of the explanation
 */
function addToLog(layerI, code, log) {
    console.log(layerI +"  " + code +"  "+ log);
    if (smartSymbo[log][layerI]) {
        smartSymbo[log][layerI].push(code);
    }
    else {
        smartSymbo[log][layerI] = [];
        smartSymbo[log][layerI].push(code);
    }
}

/**
 * Reverse the layer order between two layers in the Map object
 * @param  {number} i      index of layer 1 (below originally)
 * @param  {array} layerI   layer 1 array
 * @param  {number} k      index of layer 2 (on top originally)
 * @param  {array} layerK   layer 2 array
 */
function reverseLayerOrder(i, layerI, k, layerK) {
    var layersArray = smartSymbo.myMap.layersArray;
    // reverse layer order
    layersArray[i] = layerK;
    layersArray[k] = layerI;
    // update index value
    layersArray[i].index = i;
    layersArray[k].index = k;
}


/**
 * Analyze and reorder the layer in the Map object
 * @return {boolean}    return true when finished
 */
function orderLayers() {
    var layersArray = smartSymbo.myMap.layersArray;

    for (var i = 0, len = layersArray.length; i < len; i++) {
        for (k = i + 1; k < len; k++) {

            //  *** vector < raster
            if (layersArray[i].geometryType != "raster" && layersArray[k].geometryType == "raster") {
                addToLog(layersArray[i].label, "010", "orderLog");
                reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                console.log(i + ", " + k + " done: VECTOR and RASTER _ change order and reset");
                orderLayers(); // restart the function
                break;
            }

            //  *** raster < vector
            if (layersArray[i].geometryType == "raster" && layersArray[k].geometryType != "raster") { ///** 0xx-1xx 0xx-2x 0xx-3xx **////
                addToLog(layersArray[i].label, "100", "orderLog");
                console.log(i + ", " + k + " done: RASTER below _ do nothing");
                break;
            }

            //  *** polygon < polygon => break !! exceptions: WATER, BOUNDARY
            if (layersArray[i].geometryType == "polygon" && layersArray[k].geometryType == "polygon") {
                if (layersArray[i].theme == "water" && (layersArray[k].theme != "water" && layersArray[k].theme != "admin" && layersArray[k].theme != "building" && layersArray[k].category != "thematic")) { // assume that the water polygons are polygons and not a background
                    addToLog(layersArray[i].label, "220", "orderLog");
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: polygon WATER and polygon !WATER & !ADMIN _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }
                else if (layersArray[i].theme == "admin" && (layersArray[k].theme != "admin" && layersArray[k].theme != "building")) { // if the bottom layer is boundary and the other not, then the boundary gets up
                    addToLog(layersArray[i].label, "221", "orderLog");
                    console.log(layersArray[i]);
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: polygon ADMIN and polygon _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }
                else if (layersArray[i].theme == "nature" && (layersArray[k].theme == "landuse" || layersArray[k].theme == "landcover")) { // nature layers should be above landcover/landuse
                    addToLog(layersArray[i].label, "222", "orderLog");
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: polygon NATURE and polygon LANDUSE/LANDCOVER _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }
                else if (layersArray[i].theme == "building" && layersArray[k].theme != "building" && layersArray[k].category != "thematic") { // building layers should be above
                    addToLog(layersArray[i].label, "223", "orderLog");
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: polygon BUILDINGS and polygon _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }

                /**** Category-based rule if none of the above apply ****/
                // if the cultural/natural layer is on top and thematic below, then thematic gets up
                else if (layersArray[i].category == "thematic" && (layersArray[k].category == "cultural" || layersArray[k].category == "natural")) {
                    if (layersArray[k].theme == "admin") { // special exception for boundary that should always be on top
                        addToLog(layersArray[i].label, "225", "orderLog");
                        console.log(i + ", " + k + " done: 2 polygons (1 boundary) _ do nothing");
                        break;
                    }
                    else if (layersArray[i].theme == "landuse" || layersArray[i].theme == "landcover") { // special exception for landuse that should always be below
                        addToLog(layersArray[i].label, "226");
                        console.log(i + ", " + k + " done: 2 polygons (1 landuse/landcover) _ do nothing");
                        break;
                    }
                    else {
                        addToLog(layersArray[i].label, "224", "orderLog");
                        reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                        console.log(i + ", " + k + " done: polygon THEMATIC and polygon different _ change order and reset");
                        orderLayers(); // restart the function
                        break;
                    }
                }
                else {
                    addToLog(layersArray[i].label, "227", "orderLog");
                    console.log(i + ", " + k + " done: 2 polygons _ do nothing");
                    break;
                }
            }

            //  *** polygon < line  => break  !! exceptions WATER, BOUNDARY, THEMATIC
            else if (layersArray[i].geometryType == "polygon" && layersArray[k].geometryType == "line") {
                if (layersArray[i].theme == "water" && layersArray[i].category == "natural" && layersArray[k].theme == "water" && layersArray[k].category == "natural") { // to solve the issue with waterways going thorough lakes
                    addToLog(layersArray[i].label, "230", "orderLog");
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: polygon and line WATER-NATURAL _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }
                else if (layersArray[i].theme == "admin" && layersArray[k].theme == "water") { // to solve the issue of boundary lines along rivers
                    addToLog(layersArray[i].label, "231", "orderLog");
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: polygon ADMIN and line WATER _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }
                else if (layersArray[i].category == "thematic" && layersArray[i].theme != "landcover" && layersArray[k].category != "thematic") {
                      addToLog(layersArray[i].label, "233", "orderLog");
                    // Only works if there is some transparency involved -> in the visual hierarchy module
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: polygon THEMATIC and line _ change order and reset");
                    orderLayers(); // restart the function
                    break;

                }
                else {
                    addToLog(layersArray[i].label, "232", "orderLog");
                    console.log(i + ", " + k + " done: polygon and line _ do nothing");
                    break;
                }
            }

            //  *** polygon < point => break
            else if (layersArray[i].geometryType == "polygon" && layersArray[k].geometryType == "point") {
                addToLog(layersArray[i].label, "240", "orderLog");
                console.log(i + ", " + k + " done: polygon and point _ do nothing");
                break;
            }

            //  *** line < polygon => move up/down and restart !! exception WATER, BOUNDARY
            else if (layersArray[i].geometryType == "line" && layersArray[k].geometryType == "polygon") {
                if (layersArray[i].theme == "water" && layersArray[i].category == "natural" && layersArray[k].theme == "water" && layersArray[k].category == "natural") { // to solve the issue with waterways going thorough lakes
                    addToLog(layersArray[i].label, "320", "orderLog");
                    console.log(i + ", " + k + " done: line and polygon WATER NATURAL _ do nothing");
                    break;
                }
                else if (layersArray[i].theme == "water" && layersArray[k].theme == "admin") { // to solve the issue of boundary lines along rivers
                    addToLog(layersArray[i].label, "321", "orderLog");
                    console.log(i + ", " + k + " done: line WATER and polygon ADMIN _ do nothing");
                    break;
                }
                else if (layersArray[i].category != "thematic" && layersArray[k].category == "thematic" && layersArray[k].theme != "landcover") {
                     addToLog(layersArray[i].label, "323", "orderLog");
                    //Only works if there is some transparency involved -> in the visual hierarchy module
                    console.log(i + ", " + k + " done: line and polygon THEMATIC _ do nothing");
                    break;
                }
                else {
                    addToLog(layersArray[i].label, "322", "orderLog");
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: line and polygon _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }
            }

            //  *** point < polygon => move up/down and restart
            else if (layersArray[i].geometryType == "point" && layersArray[k].geometryType == "polygon") {
                addToLog(layersArray[i].label, "420", "orderLog");
                reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                console.log(i + ", " + k + " done: point and polygon _ change order and reset");
                orderLayers(); // restart the function
                break;
            }

            //  *** line < line => break !! exception ROAD/RAIL vs WATER, ROAD/RAIL vs BOUNDARY
            else if (layersArray[i].geometryType == "line" && layersArray[k].geometryType == "line") {
                if (layersArray[i].theme == "transport" && layersArray[k].theme == "water") {
                    addToLog(layersArray[i].label, "330", "orderLog");
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: line TRANSPORT and line WATER _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }
                else if (layersArray[i].theme == "transport" && layersArray[k].theme == "admin") {
                    addToLog(layersArray[i].label, "331", "orderLog");
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: line TRANSPORT and line ADMIN _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }

                /**** Category-based rule if none of the above apply ****/
                // if the cultural/natural layer is on top and thematic below, then thematic gets up
                else if (layersArray[i].category == "thematic" && (layersArray[k].category == "cultural" || layersArray[k].category == "natural")) {
                    addToLog(layersArray[i].label, "332", "orderLog");
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: line THEMATIC and line different _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }
                else if (layersArray[i].category == "cultural" && layersArray[k].category == "natural") {
                    addToLog(layersArray[i].label, "333", "orderLog");
                    reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                    console.log(i + ", " + k + " done: line CULTURAL and line NATURAL _ change order and reset");
                    orderLayers(); // restart the function
                    break;
                }
                else {
                    addToLog(layersArray[i].label, "333", "orderLog");
                    console.log(i + ", " + k + " done: 2 lines _ do nothing");
                    break;
                }
            }

            //  *** line < point => break
            else if (layersArray[i].geometryType == "line" && layersArray[k].geometryType == "point") {
                addToLog(layersArray[i].label, "340", "orderLog");
                console.log(i + ", " + k + " done: line and point _ do nothing");
                break;
            }

            //  *** point < line => move up/down and restart
            else if (layersArray[i].geometryType == "point" && layersArray[k].geometryType == "line") {
                addToLog(layersArray[i].label, "430", "orderLog");
                reverseLayerOrder(i, layersArray[i], k, layersArray[k]);
                console.log(i + ", " + k + " done: point and line _ change order and reset");
                orderLayers(); // restart the function
                break;
            }

            //  *** point < point => break !! No additional rules based on category
            else if (layersArray[i].geometryType == "point" && layersArray[k].geometryType == "point") {
                addToLog(layersArray[i].label, "440", "orderLog");
                console.log(i + ", " + k + " done: 2 points _ do nothing");
                break;
            }
        }
    }
    return true;
}
