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
 *  If you use these the CartoWiz library, please link to the CartoWiz project (https://npanchaud.github.io/cartowiz/)
 *  somewhere in the source-code-comment or the "about" of your project and give credits, thanks!
 *
 *  Please report bugs and send improvement suggestions to <nadia.panchaud@alumni.ethz.ch>
 *
 **********************************************************************************************************************/

/**********************************************************************************************************************/
/******************************* Export Functions & other map-objected related ****************************************/

 /**
 * Export the map description (JSON object) in a text format in a new browser window
 */
function exportMapDescription() {
    var description = JSON.stringify(smartSymbo.myMap);
    console.log(description);
    var uriContent = "data:text/plain;charset=utf-8," + encodeURIComponent(description);
    newWindow = window.open(uriContent, '_blank');
}

/**
 * Empty the map object (not destroy or remove, just empty)
 * @param  {object} map map object that needs to be cleared
 */
function emptyMapObject(map){
  if(map){
             map = new Map("", "", "","");
        }
}
