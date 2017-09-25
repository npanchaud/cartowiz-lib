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


// Global Object holding the model
// TO DO: impplement parametrization of global parameters
// DISCLAIMER: these parameters are for now only as information: not linked to the library yet.

// Gloabl restrictions on map content
// For different types of applications, it might make sense to adjust them
map_content_global ={
	// maximum and minimum numbers of layers in a map
	// default values are max<=12 and min=>2
	"max_layers_in_map" :12,
	"min_layers_in_map":2,

	// maximum and minimum numbers of main layers in a map
	// default values are max<=2 and min=0
	"max_main_layers":2,
	"min_main_layers":0,

	// default map type: general
	"default_map_type":"general"
};

// Specific restrictions associated with different map types
// WE STRONGLY SUGGEST THAT YOU DO NOT CHANGE THESE PARAMETERS
general_map_constraints ={
	// maximum number of thematic layers allowed in a general map
	"max_thematic_layer":2,
};

physical_map_constraints={
	// thematic layers are not allowed in a physical map.
	"max_thematic_layer":0,
};

political_map_constraints={
	// thematic layers are not allowed in a political map
	"max_thematic_layer":0,
};


thematic_map_constraints={
	// minimum number of thematic layers in a thematic map
	"min_thematic_layer":1,
};



// Parameters that are assumptions from the cartographer. Can be modified for different applications.
specificParameters ={ "maxMainLayers" : 2, "maxThematic":3, "maxThematicGeneral":1};
