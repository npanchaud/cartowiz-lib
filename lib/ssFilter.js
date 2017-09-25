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
/*********************************** Filter functions for Compatibility Check *****************************************/

/**
 * Push all the layer that have category = thematic to a new array for evaluation.
 * Use with array.filter(filterCategoryThematic)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that have category=thematic
 */
function filterCategoryThematic(obj) {
    if (obj.category == "thematic") {
        return true;
    }
    else {}
}

/**
 * Push all the layer that have category = mapimage to a new array for evaluation.
 * Use with array.filter(filterCategoryMapImages)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that have category=readymap
 */
function filterCategoryMapImages(obj) {
    if (obj.category == "mapimage") {
        return true;
    }
    else {}
}

/**
 * Push all the layer that have category = physical to a new array for evaluation.
 * Use with array.filter(filterCategoryPhysical)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that have category=physical
 */
function filterCategoryNatural(obj) {
    if (obj.category == "natural") {
        return true;
    }
    else {}
}

/**
 * Push all the layer that have category = cultural to a new array for evaluation.
 * Use with array.filter(filterCategoryCultural)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that have category=cultural
 */
function filterCategoryCultural(obj) {
    if (obj.category == "cultural") {
        return true;
    }
    else {}
}


/**
 * Filter layers that follow the condition and save them in a new array
 * Use with array.filter(filterThemeLandPolygon)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     [array of objects that follow the condition
 */
function filterThemeLandPolygon(obj) {
    if ((obj.theme == "landuse" || obj.theme == "landcover") && obj.geometryType == "polygon" && obj.category != "thematic") {
        return true;
    }
    else {}
}

/**
 * Filter layers that follow the condition and save them in a new array
 * Use with array.filter(filterCategoryThematicPolygon)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that follow the condition
 */
function filterCategoryThematicPolygon(obj) {
    if (obj.category == "thematic" && obj.geometryType == "polygon") {
        return true;
    }
    else {}
}

/**
 * Filter layers that follow the condition and save them in a new array
 * Use with array.filter(filterHydrography)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that follow the condition
 */
function filterHydrography(obj) {
    if (obj.category == "natural" && obj.theme == "water") {
        return true;
    }
    else {}
}

/**
 * Filter layers that follow the condition and save them in a new array
 * Use with array.filter(filterRelief)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that follow the condition
 */
function filterRelief(obj) {
    if (obj.theme == "relief") {
        return true;
    }
    else {}
}


/**
 * Filter layers that follow the condition and save them in a new array
 * Use with array.filter(filterPolygon)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that follow the condition
 */
function filterPolygon(obj) {
    if (obj.geometryType == "polygon" && obj.theme != "admin") {
        return true;
    }
    else {}
}

/**
 * Filter layers that follow the condition and save them in a new array
 * Use with array.filter(filterRaster)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that follow the condition
 */
function filterRaster(obj) {
    if (obj.geometryType == "raster") {
        return true;
    }
    else {}
}

/**
 * Filter layers that follow the condition and save them in a new array
 * Use with array.filter(filterRasterBackground)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that follow the condition
 */
function filterRasterBackground(obj) {
    if (obj.geometryType == "raster" && obj.position == "background") {
        return true;
    }
}

/**
 * Filter layers that follow the condition and save them in a new array
 * Use with array.filter(filterBoundary)
 * @param  {object} obj objects contained in the array. part of the callback from filter()
 * @return {object}     array of objects that follow the condition
 */
function filterBoundary(obj) {
    if (obj.theme == "admin") {
        return true;
    }
}
