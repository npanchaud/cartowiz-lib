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
/******************************* Chroma Helper functions **************************************************************/

/**
 * Calculate the average of a series of values
 * @param  {array} array  series of values, here pertaining to colro characteristics
 * @return {number}       average value of the array
 */
function getAverage(array) {
    var sum = 0;
    var average;
    for (var i = 0; i < array.length; i++) {
        val = array[i];
        sum += parseFloat(val);
    }
    average = sum / array.length;
    return average;
}

/**
 * Calculate the range of a series of values
 * @param  {array} array  series of values, here pertaining to color characteristics
 * @return {array}       range value as [min,max,range]
 */
function getRange(array) {
    var range;
    var min;
    var max;
    max = Math.max.apply(null, array);
    min = Math.min.apply(null, array);
    range = max - min;
    var result = [min, max, range];
    return result;
}

/**
 * Calculate a statistical overview of color characteristics from a series of colors
 * @param  {array} colors  series of colors to analyze
 * @return {object}  array of statistics: min chroma value, max chroma value, chroma range, chroma average, min luminance value, max luminance value, max lightness value
 */
function getColorsStats(colors) {
    //console.log(colors);
    var luminance = [];
    var hue = [];
    var chrome = [];
    var lightness = [];
    var LiChHu = [];
    var summary = [];

    for (var i = 0; i < colors.length; i++) {
        var color = chroma(colors[i]);
        var cLuminance = chroma(color).luminance();
        var cLCH = chroma(color).lch();
        var cLightness = cLCH[0];
        var cChrome = cLCH[1];
        var cHue = cLCH[2];
        luminance.push(cLuminance);
        lightness.push(cLightness);
        chrome.push(cChrome);
        hue.push(cHue);

        var cHEX = chroma(color).hex();
        summary.push([cHEX, cLuminance, cLightness, cChrome, cHue]);
    }

    var rangeChroma = getRange(chrome);
    var averageChroma = getAverage(chrome);
    var rangeLum = getRange(luminance);
    var rangeLightness = getRange(lightness);
    var stats = {
        "minC": rangeChroma[0],
        "maxC": rangeChroma[1],
        "rangeC": rangeChroma[2],
        "averageC": averageChroma,
        "minLum": rangeLum[0],
        "maxLum": rangeLum[1],
        "maxLightness": rangeLightness[1]
    };
    //console.log(stats);
    return stats;
}
