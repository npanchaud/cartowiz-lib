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

var explanations= {};
/**********************************************************************************************************************/
/**************************************** Map Types Explanations ******************************************************/

explanations.mapType=[
        "General-purpose maps focus on displaying the main feature of an area, both physical and man-made. They helps with orientation and understanding the spatial organization of a territory.",
        "Physical maps focus on displaying the topographic features of the landscape, such as mountains, rivers and lakes. They might also show a few cultural information to help with the orientation",
        "Political maps focus on showing administrative boundaries (national, regional, and/or local) and labelling places (cities, regions, countries, etc). They rarely show details of the topography, but might display rivers and water bodies to help with the orientation.",
        "Thematic maps focus on a specific topic and display thematic data, such as statistics for administrative units or pollution values for a stream. They show some geographic and cultural features for orientation purposes but focus on spatial data with z (or attribute values)."
    ];
explanations.mainLayers =["The main layers on the map are the ones that are central to the meaning and theme of your map. They are the one that should be displayed prominently to the user."," Other layers are either secondarily important to the map or they are \'only\' on the map as supporting information in the background."];

/**********************************************************************************************************************/
/**************************************** Layer Order Explanations ****************************************************/
explanations.orderGeneralRules =["Layers on top might hide layers below, which is why as a general rule, point layers are on top of line layers, which are themselves on top of polygon layers. However there are exceptions."];


explanations.orderExplanation = {
    "010": "a vector layer should be above a raster layer because we assume that raster layers cover the whole extent, whereas vector layers can more localized. To guarantee that both are visible, a further step might introduce different opacity parameters.",
    "100": "a vector layer should be above a raster layer because we assume that raster layers cover the whole extent, whereas vector layers can more localized. To guarantee that both are visible, a further step might introduce different opacity parameters.",
    "220": "a water polygon layer should be above other polygon layers, except if they are building, administrative or other water layers.",
    "221": "an administrative polygon layer should be above other polygon layers, except if they are buildings or other administrative layers.",
    "222": "a natural polygon layer should be above a landuse or landcover polygon layer.",
    "223": "a building layer should be above other polygon layers, expect if they are thematic layers.",
    "224": "a thematic polygon layer should be above a cultural or natural polygon layer if none of the more specific rules with the theme of the layers applies.",
    "225": "a thematic polygon layer should be above a cultural or natural polygon layer if none of the more specific rules with the theme of the layers applyies. Except for an administrative layer that should stay above.",
    "226": "a thematic polygon layer should be above a cultural or natural polygon layer if none of the more specific rules with the theme of the layers applies. Except for a landuse or landcover layer that should stay below.",
    "227": "a polygon layer stay below another polygon layer if no exception is detected.",
    "230": "a water natural polygon layer should be above a water natural line layer. This avoids issues with the river centerlines that go through lakes.",
    "320": "a water natural line layer should be below a water natural polygon layer. This avoids issues with the river centerlines  that go through lakes.",
    "231": "an administrative polygon layer should be above a water natural line layer. This allows to show the administrative border above the rivers.",
    "321": "an administrative polygon layer should be above a water natural line layer. This allows to show the administrative border above the rivers.",
    "232": "a polygon layer should be below a line polygon.",
    "322": "a polygon layer should be below a line polygon.",
    "233": "if a thematic polygon layer is somewhat transparent, it can be above a non-thematic line layer.",
    "323": "if a thematic polygon layer is somewhat transparent, it can be above a non-thematic line layer.",
    "240": "a point layer should be above a polygon layer.",
    "420": "a point layer should be above a polygon layer.",
    "330": "a transport line layer should be above a water line layer.",
    "331": "a transport line layer should be above an administrative line layer",
    "332": "a thematic line layer should be above a cultural or natural line layer if none of the more specific rules with the theme of the layers applies.",
    "333": "a cultural line layer should be above a natural line layer if none of the more specific rules with the theme of the layers applies.",
    "334": "a line layer stay below another line layer if no exception is detected.",
    "340": "a line layer should be below a point layer.",
    "430": "a line layer should be below a point layer.",
    "440": "no specific rules are defined between two point layers.",
    "999": "no explanations, sorry."
};

explanations.orderExplanationImg ={
    "010": "010_100_relief_thematic_polygon.png",
    "100": "010_100_relief_thematic_polygon.png",
    "220": "220_water_polygon_above_others.png",
    "221": "221_admin_above_polygon_except_building.png",
    "222": "222_nature_above_landuse_with_forest.png",
    "223": "223_building_polygon_over_other.png",
    "224": "224_thematic_polygon_above_other_polygon.png",
    "225": "225_thematic_polygon_above_other_polygon_except_admin.png",
    "226": "226_thematic_polygon_above.png",
    "227": "999_no_image.png",
    "230": "230_320_waterway_centerline_issue.png",
    "320": "230_320_waterway_centerline_issue.png",
    "231": "231_321_admin_polygon_above_water_line.png",
    "321": "231_321_admin_polygon_above_water_line.png",
    "232": "232_322_polygon_below_line.png",
    "322": "232_322_polygon_below_line.png",
    "233":"233_323_thematic_above_non_thematic_transparency.png",
    "323":"233_323_thematic_above_non_thematic_transparency.png",
    "240": "240_420_pol_ln_pt_geometry_order.png",
    "420": "240_420_pol_ln_pt_geometry_order.png",
    "330": "330_transport_line_above_water.png",
    "331": "331_transport_line_above_admin_line.png",
    "332": "999_no_image.png",
    "333": "333_cultural_line_above_natural_line.png",
    "334": "999_no_image.png",
    "340": "340_430_line_below_point.png",
    "430": "340_430_line_below_point.png",
    "440": "999_no_image.png",
    "999":"999_no_image.png"
};



/**********************************************************************************************************************/
/**************************************** Visual Hierarchy Explanations  **********************************************/



explanations.groundAssignmentExplanation = {
    "G0001": "is assigned to the foreground because it is one of the main layers.",
    "G0002": "is assigned to the background because of its is a raster or ready-to-use map layer.",
    "G0003": "is assigned to the background because of its geometry type polygon.",
    "G0004": "is assigned to the middleground by default.",
    "S0301": "is assigned to the foreground because it is an administrative layer in a political map.",
    "S0401": "is assigned to foreground because it is a thematic layer in a thematic map."
};



explanations.backgroundSymbo = ["You can pick among several options for the symbolization of the background layers.",
    "1. You can use our Smart function, which includes also changes in opacity.",
    "2. You can use the Grayscale method to turn the layer into a grayscale equivalent of the original symbolization.",
    "3. You can use a simple desaturation method for less flashy colors.",
    "4. You can also only apply an opacity function.",
    "5. You can also choose not to apply any change in symbolization to your background layers."
];

explanations.visualHierarchy = [{
    "What is visual hierarchy?": ["Well-designed maps display a visual hierarchy among the map information, which allow the users to perceive a difference between the main topic of the map and information that support it by offering a background context.",
        "Information in the background should be less visually prominent (i.e. important) so that the main topic of the map can better \"catch\" the eye of the map users.",
        "Thus, we provide here functions to help with assigning layers to fore-, middle- and background. Then you can change the background layer symbolization into a less visually catchy style."
    ]
}, {
    "How does it work?": ["The function assigns the layers to the different grounds based on the information you provided before and the type of layers and map type you selected.", "First, some general rules are apply to assign layers to background and foreground. Then, based on the map type you chose, additional specific rules are used."]
}, {
    "General rules": [
        "- All main layers are assigned to the foreground.",
        "- Raster and ready-to-use maps are then assigned to the background.",
        "- Polygon layers that are not water-themed nor main layers are assigned to the background.",
        "- The rest of the layers are assigned to the middle ground."
    ]
}, {
    "Specific rules": [
        "- In thematic maps , thematic layers are assigned to the foreground.",
        "- In political maps, administrative layers are assigned to the foreground."
    ]
}];



/**********************************************************************************************************************/
/**************************************** Return/Print Explanations  **************************************************/

/**
 * Return a map type explanation, either about one map type or about all of them. Output it to the console as well
 *  @param {string}[mapType = all] mapType map type that needs to be explained.Valid input: general, physical, political, thematic, all
 *  @return {string|array}    Return a string or an array describing / explaining the map type requested.
 */
function returnMapTypeExplanation(mapType) {
    var explanations = explanations.mapType;
    var expl = "";
    // if no input parameter: all
    if (!mapType) {
        mapType = "all";

    }
    // Test for the right explanation
    if (mapType == "all") {
        expl = explanations;
    }
    else if (mapType == "general") {
        expl = explanations[0];
    }
    else if (mapType == "physical") {
        expl = explanations[1];
    }
    else if (mapType == "political") {
        expl = explanations[2];
    }
    else if (mapType == "thematic") {
        expl = explanations[3];
    }
    //print and return
    console.log(expl);
    return expl;
}

/**
 * Return the main layers explanation. Output it to the console as well
 * @return {string}  Return a string describing/explaning the main layers concept
 */
function returnMainLayersExplanation(){
  var explanations = explanations.mainLayers[0];
        //print and return
    console.log(explanations);
    return explanations;
}








