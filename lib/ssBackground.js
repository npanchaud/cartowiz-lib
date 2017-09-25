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
/******************************* Background Functions******************************************************************/


/**
 * Turn the color scheme into a GRAYSCALE
 * @param  {string} cssParam    which css parameter the color is refereing to. for now:[stroke | fill]
 * @param  {string} color       hex code for the color to be changed
 * @param  {string} layerIdName idName of the layer from which the color originates
 * @return {string}             new hex code for the now modified color
 */
function changeToGrayscale(cssParam, color, layerIdName) {
    color = chroma.hex(color);
    var rgbCol = color.rgb();

    var r = rgbCol[0];
    var g = rgbCol[1];
    var b = rgbCol[2];

    /* Average method */
    var grayAverage = (r + g + b) / 3;

    /*  Luminance correction method */
    var grayLuminance;
    if (r == g && g == b) {
        grayLuminance = r;
    } else {
        grayLuminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /*  Desaturation method */
    var grayDesaturation = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;

    /* Comment and uncomment to switch between grayscale method (default: Luminance) */
    var grayRGB = chroma(grayLuminance, grayLuminance, grayLuminance);
    //var grayRGB = chroma(grayAverage,grayAverage,grayAverage);
    //var grayRGB = chroma(grayDesaturation,grayDesaturation,grayDesaturation);

    var gray = grayRGB.hex();
    return (gray);
}


/**
 * Turn the color scheme into a SMART BACKGROUND
 * @param  {string} cssParam    which css parameter the color is refereing to. for now:[stroke|fill]
 * @param  {string} color       hex code for the color to be changed
 * @param  {string} layerIdName idName of the layer from which the color originates
 * @param  {number} maxLum      maximal luminance value of the color scheme
 * @param  {number} maxC        maximal chroma value of the color scheme
 * @param  {number maxL         maximal lightness value of the color schem
 * @param  {number} coef        transparency coefficient
 * @return {string}             new hex code for the now modified color
 */
function changeToSmartBG(cssParam, color, layerIdName, maxLum, maxC, maxL, coef) {
    // set the parameters for modification of Chroma, Lightness, and Luminance
    var parLum = 0.6;
    var parL = 0.8; // original in paper 2: 0.6
    var parC = 0.6; // original in paper 2: 0.7

    /* Luminance change */
    var lum = chroma(color).luminance(); // get the luminance down (smaller range toward higher luminance value)
    var lumFactor;
    if (lum == maxLum) { // special case, usually when only one color to transform
        lumFactor = 1 - (parLum * (1 - lum));
        console.log('maxLum same as lum');
    } else { // normal case, take the maximal value to calibrate the change
        lumFactor = maxLum - parLum * (maxLum - lum);
    }

    newCol = chroma(color).luminance(coef * lumFactor);
    console.log(newCol + ' ' + ' (after new luminance)');

    /* Increase lightness (add white) */
    var lightness = chroma(newCol).get('lab.l');
    var newLightness;
    if (lightness == maxL) {
        newLightness = 1 - parL * (1 - lightness);
        console.log('maxL same as L');
    } else {
        newLightness = maxL - parL * (maxL - lightness);
    }
    newCol = chroma(newCol).brighten(coef * (newLightness - lightness) / 18);

    /* Desaturate slightly (desaturate chroma that are too high) */
    chromaValue = chroma(newCol).get('lch.c');
    var vC; // amount to desaturate
    if (chromaValue < 1) {
        vC = 0;
    } else {
        vC = coef * (Math.pow(chromaValue, parC)) / 18; // TO DO: adapt the power based on the chroma max of the scheme
    }
    newCol = chroma(newCol).desaturate(vC);

    newCol = chroma(newCol).hex();
    console.log(newCol);

    return (newCol);
}


/**
 * Turn the color scheme into a LESS SATURATED version
 * @param  {string} cssParam     which css parameter the color is refereing to. for now:[stroke|fill]
 * @param  {string} color       hex code for the color to be changed
 * @param  {string} layerIdName idName of the layer from which the color originates
 * @return {string}             new hex code for the now modified color
 */
function changeToLessSaturation(cssParam, color, layerIdName) {
    color = chroma.hex(color);
    var hslCol = color.hsl();
    var h = hslCol[0];
    var s = hslCol[1] * 0.4; // Reduce saturation
    var l = hslCol[2];
    var newCol = chroma.hsl(h, s, l);
    newCol = newCol.hex();

    return (newCol);
}
