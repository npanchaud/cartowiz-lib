# cartowiz-lib
This is the library of the CartoWiz framework.
A framework that support formalization of cartographic knowledge into cartographic functions.





# Documentation
### Table of Contents

-   [changeToGrayscale](#changetograyscale)
-   [changeToSmartBG](#changetosmartbg)
-   [changeToLessSaturation](#changetolesssaturation)
-   [checkLayersNumber](#checklayersnumber)
-   [checkLayerList](#checklayerlist)
-   [checkMapType](#checkmaptype)
-   [checkMainLayers](#checkmainlayers)
-   [checkScale](#checkscale)
-   [checkErrorMapDef](#checkerrormapdef)
-   [returnMapTypeExplanation](#returnmaptypeexplanation)
-   [returnMainLayersExplanation](#returnmainlayersexplanation)
-   [orderLayers](#orderlayers)
-   [smartSymbo](#smartsymbo)
    -   [orderLog](#orderlog)
    -   [groundLog](#groundlog)
-   [Map](#map)
    -   [addLayer](#addlayer)
-   [Layer](#layer)
    -   [addAttribute](#addattribute)
    -   [addStyle](#addstyle)
-   [Attribute](#attribute)
-   [Style](#style)
-   [assignToGroundGeneral](#assigntogroundgeneral)
-   [assignToGroundSpecific](#assigntogroundspecific)
-   [addToGround](#addtoground)
-   [removeFromGround](#removefromground)
-   [applyBGMethod](#applybgmethod)
-   [dealWithOpacity](#dealwithopacity)
-   [callSmartBG](#callsmartbg)
-   [calculateFillStrokeContrast](#calculatefillstrokecontrast)
-   [callGrayscaleBG](#callgrayscalebg)
-   [callLessSaturated](#calllesssaturated)
-   [callLessOpacity](#calllessopacity)
-   [applySmartBG](#applysmartbg)
-   [applyGrayscaleBG](#applygrayscalebg)
-   [applyLessSaturated](#applylesssaturated)
-   [applyLessOpacity](#applylessopacity)
-   [setOpacity](#setopacity)
-   [callOriginalStyle](#calloriginalstyle)
-   [applyOriginalStyle](#applyoriginalstyle)

Made with [http://documentation.js.org|documentation.js]

## changeToGrayscale

Turn the color scheme into a GRAYSCALE

**Parameters**

-   `cssParam` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** which css parameter the color is refereing to. for now:[stroke | fill]
-   `color` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** hex code for the color to be changed
-   `layerIdName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** idName of the layer from which the color originates

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** new hex code for the now modified color

## changeToSmartBG

Turn the color scheme into a SMART BACKGROUND

**Parameters**

-   `cssParam` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** which css parameter the color is refereing to. for now:[stroke|fill]
-   `color` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** hex code for the color to be changed
-   `layerIdName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** idName of the layer from which the color originates
-   `maxLum` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** maximal luminance value of the color scheme
-   `maxC` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** maximal chroma value of the color scheme
-   `maxL`
-   `coef` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** transparency coefficient

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** new hex code for the now modified color

## changeToLessSaturation

Turn the color scheme into a LESS SATURATED version

**Parameters**

-   `cssParam` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** which css parameter the color is refereing to. for now:[stroke|fill]
-   `color` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** hex code for the color to be changed
-   `layerIdName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** idName of the layer from which the color originates

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** new hex code for the now modified color

## checkLayersNumber

Check whether there is too many or too few layers to make a map. !! If return errors, the process cannot go on.

**Parameters**

-   `layersArray`
-   `myLayersArray` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** array of layers to analyze

Returns **([boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) \| [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))** true if no error, which allow to go to the next step. Otherwise, object with error type and explanatory text

## checkLayerList

Check compatibility between layers. Return only warnings, the process can go on with warnings.

**Parameters**

-   `layersArray` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object array of layer in the map to check for warning

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object array of all the warning found during the check

## checkMapType

Check whether warnings are necessayry based on the map definition and save the warning in an array

**Parameters**

-   `layersArray` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** object array of layers
-   `map` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** map object to be inspected

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object array of the warnings detected during the check

## checkMainLayers

Check whether warnings are necessayry based on the main layers and save the warning in an array

**Parameters**

-   `listMainLayers` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** array of idName of the main layers

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object array of the warning found in the check

## checkScale

Check whether warnings are necessary based on the map and layers scales and save the warning in an array

**Parameters**

-   `mapScale` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** current map scale, only the divisor
-   `layersArray` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** array of alyers to be checked against the map scale

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object array of the warning found in the check

## checkErrorMapDef

Call all the checkWarning functions to be sure there is no error left

Returns **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean))** error description or true if no error

## returnMapTypeExplanation

Return a map type explanation, either about one map type or about all of them. Output it to the console as well

**Parameters**

-   `mapType` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** mapType map type that needs to be explained.Valid input: general, physical, political, thematic, all (optional, default `all`)

Returns **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array))** Return a string or an array describing / explaining the map type requested.

## returnMainLayersExplanation

Return the main layers explanation. Output it to the console as well

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Return a string describing/explaning the main layers concept


## orderLayers

Analyze and reorder the layer in the Map object

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** return true when finished

## smartSymbo

Main object, holding the contextual map model, linked to the window element because it's declared as global

### orderLog

Object to hold the log of the layerOrder function

### groundLog

Object to hold the log of the assignGround function

## Map

Create a Map Object

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** type of map: general, physical, political, thematic
-   `scale` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** calculated from the ratio map image width/coordinates width
-   `extent` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** read from the selection frame
-   `refSys` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** epsg code of the reference system

### addLayer

Create and assign Layer object

**Parameters**

-   `idName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layerName as used by the WMS
-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** label of the layer used for display
-   `category` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** category of the layer: physical, cultural, thematic, map
-   `theme` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** theme of the layer
-   `minScale` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** minimal scale at which the layer should be used
-   `maxScale` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** maximal scale at which the layer should be used
-   `geometryType` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** type of geometries in the layer: [point | line | polygon | raster]
-   `index` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index number of the layer in the stack: 0 = first layer drawn on the canvas
-   `position` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** OPTIONAL: [background | middleground | foreground]
-   `priority` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** OPTIONAL whether a main layer or not. true = main layer

## Layer

Create a Layer Object, called by the addLayer() method in the Map object

**Parameters**

-   `idName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layerName as used by the WMS
-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** label of the layer used for display
-   `category` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** category of the layer: physical, cultural, thematic, map
-   `theme` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** theme of the layer
-   `minScale` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** minimal scale at which the layer should be used
-   `maxScale` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** maximal scale at which the layer should be used
-   `geometryType` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** type of geometries in the layer: [point | line | polygon | raster]
-   `index` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index number of the layer in the stack: 0 = first layer drawn on the canvas
-   `position` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** OPTIONAL: [background | middleground | foreground]
-   `priority` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** OPTIONAL whether a main layer or not. true = main layer

### addAttribute

Create and add an attribute object to the layer

**Parameters**

-   `name`
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** type [nominal | ordinal | interval | ratio]

### addStyle

Create and assign a style object to the layer !! not implemented yet

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** classification used for the style [unique value | categories | graduated]
-   `symbolizer` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** [description]
-   `rules` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** [description]

## Attribute

Create an attribue (called by the addAttribute()  method in the Layer object)

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of the attribute – label
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** type [nominal | ordinal | interval | ratio]

## Style

Create a style object (called by the addStyle() method in the Layer object) !! not implemented yet

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** classification used for the style: unique value, categories, graduated
-   `symbolizer` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** type of symbolizer: point, line, polygon
-   `rules` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** rules to assign symbolizer to features [not implemented yet]

## assignToGroundGeneral

Assign the different layers to either back-, middle-, or foreground

Returns **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** array of the back-, middle-, and foreground layers

## assignToGroundSpecific

Assign the layers to the different ground based on specific parameters linked to specific map types

## addToGround

Help adding a label to a ground

**Parameters**

-   `ground` **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** ground to which to add the label
-   `label`

## removeFromGround

Help removing label from all the ground lists

**Parameters**

-   `label` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** label to be removed

## applyBGMethod

Asses the mehtod chosen and call the nmethod function

**Parameters**

-   `grId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** ID of the group in which the button is
-   `evt` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** event that call teh callback function
-   `text` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** text on the button

## dealWithOpacity

Deal with the opacity of the different layers based on background content and geometries

## callSmartBG

Call the function to apply the smart BG for each layer in the abckground

**Parameters**

-   `index` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of the layer in the layer stack
-   `idName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** idName of the layer
-   `rasterTransparency` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether we need transparency to adapt to a raster background

Returns **\[type]** [description]

## calculateFillStrokeContrast

TO DO : test if it works
Test if stroke and fill available, calculate contrast and add to the style info

**Parameters**

-   `index` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of the layer being analyzed

## callGrayscaleBG

Call the apply\*\* function for each layer in the background array

**Parameters**

-   `index` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of the layer
-   `idName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** id name of the layer

## callLessSaturated

Call the apply\*\* function for each layer in the background array

**Parameters**

-   `index` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of the layer
-   `idName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** id name of the layer

## callLessOpacity

Call the apply\*\* function for each layer in the background array

**Parameters**

-   `index` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of the layer
-   `idName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** id name of the layer

## applySmartBG

Calculate a smart background style to the layer

**Parameters**

-   `layerId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer id name to which apply the style
-   `i` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer index to which apply the style
-   `stats` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object containg the color stats
-   `coef` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** coef for  transparency

Returns **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** newSldValues

## applyGrayscaleBG

Calculate a grayscale style to the layer

**Parameters**

-   `layerId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer id name to which apply the style
-   `i` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer index to which apply the style

Returns **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** new sld values

## applyLessSaturated

Calculate a less saturated style to the layer

**Parameters**

-   `idName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer id name to which apply the style
-   `i`
-   `index` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer index to which apply the style

Returns **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** new sld values

## applyLessOpacity

Apply some opacity  to the layer

**Parameters**

-   `idName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer id name to which apply the opacity
-   `index` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer index to which apply the opacity

## setOpacity

Change the opacity of the layer and slider

**Parameters**

-   `index` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** index of the layer
-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** idName of the layer
-   `value` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** value on which the opacity has to be set (between 0 and 1)

## callOriginalStyle

Call the method to change the style

**Parameters**

-   `idName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer id name concerned
-   `index` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer index concerned

## applyOriginalStyle

Apply the original style to the layer

**Parameters**

-   `idName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer id name to which apply the style
-   `index` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** layer index to which apply the style

Returns **[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** orsiginal sld values
