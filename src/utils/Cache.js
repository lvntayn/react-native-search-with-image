import { AsyncStorage } from 'react-native';
import moment from 'moment';


export var Cache = {


  get: async function(key){
    try {
      var value = await AsyncStorage.getItem(key);
      if (value !== null){
        var cache = JSON.parse(value);
        if (cache.date.length != 0){
          if (cache.expired == -1){
            return cache.value;
          }else{
            var now = moment().unix();
            var diff = (now - cache.date) / 60;
            if (diff > cache.expired){
              try {
                await AsyncStorage.removeItem(key);
                return false;
              } catch (error) {
                return false;
              }
              return false;
            }else{
              return cache.value;
            }
          }
        }else{
          return false;
        }
      }else{
        return false;
      }
    } catch (error) {
      return false;
    }
  },

  remove: async function(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  },

  remember: async function(key, minutes, options, callback){

    try{
      var cache = await this.get(key);
      if (cache){
        return cache;
      }else{
        try{
          var value = await callback(options);
          if (value){
            cache = {
              expired: minutes,
              date: moment().unix(),
              value: value
            };
            var a = await AsyncStorage.setItem(key, JSON.stringify(cache));
            return cache.value;
          }else{
            return false;
          }
        }catch(e){
          return false;
        }
      }
    }catch(e){
      return false;
    }
  }



};
