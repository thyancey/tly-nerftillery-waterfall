import { initStore } from 'react-waterfall';
import {fromJS, Map, List} from 'immutable';

const refreshLocations = function(mapData, locations){
  return locations.map((location, idx) => {
    return (
      location.merge({
        x: (location.get('percX') || 0) * mapData.get('width'),
        y: (location.get('percY') || 0) * mapData.get('height')
      })
    )
  });
}

const refreshMapData = function(mapData, scale){
  return mapData.merge({
    scale: scale,
    width: scale * mapData.get('origWidth'),
    height: scale * mapData.get('origHeight')
  });
}

const getLocationWithId = function(locations, id){
  const location = locations.filter((loc, idx) => idx === id).first();
  if(!location){
    console.warn('could not find location with id ' + id);
  }
  return location;
}
const getLocationX = function(orig, mapData){
  return roundTo((orig / (mapData.get('origWidth') * mapData.get('scale'))), SNAP_SENSITIVITY);
}

const getLocationY = function(orig, mapData){
  return roundTo((orig / (mapData.get('origHeight') * mapData.get('scale'))), SNAP_SENSITIVITY);
}


const store = {
  initialState: {
    debugMode:false,
    allPlayAreaData: List([
      // {
      //   id: 'pirate',
      //   title: 'Pirate map',
      //   image: 'maps/map-pirate.jpg',
      //   data:{
      //     origHeight: 736,
      //     origWidth: 554,
      //     scale: 1 
      //   },
      //   locations: [
      //     {
      //       description: 'Yarr.. this be a cyclone turret'
      //       percX: 0.1718
      //       percY: 0.1185
      //       title: 'Cyclone Turret'
      //       turretId: 'turret1'
      //       type: 'turret'
      //     }
      //   ]
      // }
    ]),
    playAreaData: Map({
      // height: 736
      // id: 'pirate'
      // image: 'maps/map-pirate.jpg'
      // origHeight: 736
      // origWidth: 554
      // scale: 1
      // title: 'Pirate map'
      // width: 554
    }),
    locations: List([
      // {
      //   description: 'Yarr.. this be a cyclone turret',
      //   percX: 0.1718,
      //   percY: 0.1185,
      //   title: 'Cyclone Turret',
      //   turretId: 'turret1',
      //   type: 'turret',
      //   x: 95.1772,
      //   y: 87.216
      // }
    ])
  },
  actions: {
    toggleLoaded: ({ loaded }) => ({ loaded: !loaded }),
    setPlayAreaScale: ({}, playAreaScale) =>{

    },
    setPlayAreaData: ({}, playAreaData) => {
      const playAreaMap = fromJS(playAreaData);

      const mapId = playAreaMap.get('defaultId');
      const allMapData = playAreaMap.get('maps');

      const foundMap = allMapData.filter(md => md.get('id') === mapId).first();
      if(!foundMap){
        //- some kind of default stuff so error can render out nicely
        return {};
      }

      const scale = foundMap.get('data').scale || 1;

      //- do any scaling and mutate saved format into a more usable flat object
      const mapData = refreshMapData(foundMap.get('data'), scale).merge({
        id: foundMap.get('id'),
        title: foundMap.get('title'),
        image: foundMap.get('image')
      });

      //- get updated scaled position for all locaiton markers
      const locations = refreshLocations(mapData, foundMap.get('locations'));

      return {
        allPlayAreaData: playAreaMap,
        playAreaData: mapData,
        locations: locations
      };
    },
    setPlayAreaScale: ({ playAreaData, locations }, mapScale) => {
      const newMapData = refreshMapData(playAreaData, mapScale);

      return{
        playAreaData: newMapData,
        locations: refreshLocations(newMapData, locations)
      }
    },
    updateLocation: ({ playAreaData, locations }, locationData) => {
      const location = getLocationWithId(state.get('locations'), locationData.id);

      if(location){
        const fixedLocation = refreshLocation(playAreaData, location.merge({
          percX: getLocationX(locationData.x, playAreaData),
          percY: getLocationY(locationData.y, playAreaData)
        }));
        const locations = locations.set(locationData.id, fixedLocation);

        return {
          locations: locations
        }
      }else{
        return {};
      }
    },
    // loadLocationSettings: ({ locations }, locationData) => {
    //   let location;
    //   if(locationData === null){
    //     location = null;
    //   }
    //   else{
    //     location = getLocationWithId(locations, locationData);
    //   }

    //   return {
    //     curLocation: location
    //   }
    // }
  }
};
 
export const { Provider, connect } = initStore(store);