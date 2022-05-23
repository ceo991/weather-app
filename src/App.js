import React,{useState,useEffect,useRef} from 'react';
import Favorite from './components/Favorite'
import { motion } from "framer-motion"
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudSun, faHeart} from '@fortawesome/free-solid-svg-icons';
import 'animate.css';

function App() {

  const[lon,setLon]=useState(0);
  const[lat,setLat]=useState(0);
  const[width,setWidth]=useState(window.innerWidth);
  const[location,setLocation]=useState("");
  const[weather,setWeather] = useState(null);
  const[firstWeather,setFirstWeather] = useState(null);
  const[favorite,setFavorite] = useState([]);
  const[hideUI,setHideUI] = useState(false);
  const[isDragging,setIsDragging] = useState(false);
  const[playAnim,setPlayAnim] = useState(false);
  const[renderCount,setRenderCount] = useState(0);
  const[screenInfo,setScreenInfo] = useState({});
  const locationRef = useRef("");
  const carouselRef = useRef();
  const outerRef = useRef();
  const Weather_Key="FAV_WEATHER";

useEffect(()=>{
  window.addEventListener("resize",()=>{setWidth(window.innerWidth);})

  navigator.geolocation.getCurrentPosition((position)=>{
    // setLat(position.coords.latitude)
    // setLon(position.coords.longitude)

    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=7d2e6b6e789a35974f922c6c41c0d301`)
    .then(res => res.json()).then(data=>{
      const weatherData = {
        location:data.name,
        country:data.sys.country,
        temp:data.main.temp,
        feelsLike:data.main.feels_like,
        tempMin:data.main.temp_min,
        tempMax:data.main.temp_max,
        pressure:data.main.pressure,
        windSpeed:data.wind.speed,
        windDegrees:data.wind.deg,
        weatherCondition:data.weather[0].main,
        weatherDescription:data.weather[0].description,
        weatherIcon:"http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
        longitude:data.coord.lon,
        latitude:data.coord.lat,
        id:data.name.concat(data.sys.country)
      }
      setFirstWeather(weatherData);

    });

    // console.log(position.coords.latitude)
    // console.log(position.coords.longitude)
  })

  let favWeather = JSON.parse(localStorage.getItem(Weather_Key));
  console.log(favWeather)
  if(favWeather.length>0){
    favWeather.map((fav)=>{
       fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${fav.latitude}&lon=${fav.longitude}&units=metric&appid=7d2e6b6e789a35974f922c6c41c0d301`)
        .then( res => res.json()).then(data=>{

          const weatherData = {
            location:fav.location[0].toUpperCase().concat(fav.location.slice(1,fav.location.length).toLocaleLowerCase()),
            temp:data.main.temp,
            weatherCondition:data.weather[0].main,
            weatherIcon:"http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
            longitude:data.coord.lon,
            latitude:data.coord.lat,
            id:data.name.concat(data.sys.country)
          }

           setFavorite(prevFav=>{         
                let arr = [...prevFav,weatherData]
                let uniqArr=arr.reduce((map,obj)=>map.set(obj.id,obj),new Map()).values()
                return [...uniqArr]
              });
          });
    })
    
  }
  
  return () => {
    window.removeEventListener("resize",()=>{setWidth(window.innerWidth);})
  }
},[])

useEffect(() => {
  if((carouselRef.current && outerRef.current && renderCount <= 50)){
    setScreenInfo({carouselWidth: carouselRef.current.scrollWidth  ,
                    outerWidth: outerRef.current.offsetWidth,
                    carouselHeight: carouselRef.current.scrollHeight,
                    outerHeight: outerRef.current.offsetHeight
                  })
    setRenderCount(prev => prev+1 )
  }else{
    return false
  }
})

useEffect(() => {

  if((carouselRef.current && outerRef.current)){
    setScreenInfo({carouselWidth: carouselRef.current.scrollWidth  ,
                    outerWidth: outerRef.current.offsetWidth,
                    carouselHeight: carouselRef.current.scrollHeight,
                    outerHeight: outerRef.current.offsetHeight
                  })
                  // console.log(carouselRef.current.scrollHeight,outerRef.current.offsetHeight)
  }
  
},[width,weather,favorite])


useEffect(() =>{
  if(location.length>0){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=7d2e6b6e789a35974f922c6c41c0d301`)
    .then(res => res.json()).then(data=>{
      setLat(data[0].lat);
      setLon(data[0].lon);
    }).catch((err)=>{
        alert("enter a proper location " + err)
        setWeather(null)
        setLocation("")
        setHideUI(false)
        setIsDragging(false)
        if((carouselRef.current && outerRef.current)){
          setScreenInfo({carouselWidth: carouselRef.current.scrollWidth  ,
                          outerWidth: outerRef.current.offsetWidth,
                          carouselHeight: carouselRef.current.scrollHeight,
                          outerHeight: outerRef.current.offsetHeight
                        })
                        // console.log(carouselRef.current.scrollHeight,outerRef.current.offsetHeight)
        }  
      }
    );
  }
  
},[location])

useEffect(() =>{
  localStorage.setItem(Weather_Key,JSON.stringify(favorite))
  
},[favorite])

useEffect(() =>{
  if(location.length>0){
    setWeather(null)
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=7d2e6b6e789a35974f922c6c41c0d301`)
    .then(res => res.json()).then(data=>{

      const weatherData = {
        location:location ? location[0].toUpperCase().concat(location.slice(1,location.length).toLocaleLowerCase()) : "",
        country:data.sys.country,
        temp:data.main.temp,
        feelsLike:data.main.feels_like,
        tempMin:data.main.temp_min,
        tempMax:data.main.temp_max,
        pressure:data.main.pressure,
        windSpeed:data.wind.speed,
        windDegrees:data.wind.deg,
        weatherCondition:data.weather[0].main,
        weatherDescription:data.weather[0].description,
        weatherIcon:"http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
        longitude:data.coord.lon,
        latitude:data.coord.lat,
        id:data.name.concat(data.sys.country)
      }
      setWeather(weatherData);

    });
  }
},[lon])

  function handleLocation(e){
    e.preventDefault();
    setLocation(locationRef.current.value)
    if(favorite.length>0){
      favorite.map((fav)=>{
  
          fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${fav.latitude}&lon=${fav.longitude}&units=metric&appid=7d2e6b6e789a35974f922c6c41c0d301`)
          .then(res => res.json()).then(data=>{
            const weatherData = {
              location:fav.location[0].toUpperCase().concat(fav.location.slice(1,fav.location.length).toLocaleLowerCase()),
              temp:data.main.temp,
              weatherCondition:data.weather[0].main,
              weatherIcon:"http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
              longitude:data.coord.lon,
              latitude:data.coord.lat,
              id:data.name.concat(data.sys.country)
            }

            setFavorite(prevFav=>{         
                  let arr = [...prevFav,weatherData]
                  let uniqArr=arr.reduce((map,obj)=>map.set(obj.id,obj),new Map()).values()
                  return [...uniqArr]
                });
            });
        
      })
    }
    locationRef.current.value = ""
    setHideUI(true)
  }

  function setFavoriteWeather(index){ 
    if(isDragging) return
    setLocation(favorite[index].location)
    if(favorite.length>0){
      
      favorite.map((fav)=>{
  
          fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${fav.latitude}&lon=${fav.longitude}&units=metric&appid=7d2e6b6e789a35974f922c6c41c0d301`)
          .then(res => res.json()).then(data=>{
            const weatherData = {
              location:fav.location[0].toUpperCase().concat(fav.location.slice(1,fav.location.length).toLocaleLowerCase()),
              temp:data.main.temp,
              weatherCondition:data.weather[0].main,
              weatherIcon:"http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
              longitude:data.coord.lon,
              latitude:data.coord.lat,
              id:data.name.concat(data.sys.country)
            }

            setFavorite(prevFav=>{         
                  let arr = [...prevFav,weatherData]
                  let uniqArr=arr.reduce((map,obj)=>map.set(obj.id,obj),new Map()).values()
                  return [...uniqArr]
                });
            });
      })  
    }
    setHideUI(true)
  }

  function addToFavorites(){
    if(favorite.length>=10){
      //alert("maximum 10 favorites are allowed")
      return
    }
    setFavorite(prevFav=>{         
      let arr = [...prevFav,weather]
      let uniqArr=arr.reduce((map,obj)=>map.set(obj.id,obj),new Map()).values()
      setPlayAnim(true)
      return [...uniqArr]
    });
    setTimeout(()=>{
      setPlayAnim(false)
    },3000)
  }

  function deleteFavorite(e,index){
    e.stopPropagation();
    let tempArr=[...favorite];
    tempArr.splice(index,1)
    setFavorite(tempArr)
  }

  const fav=favorite.map((f,index)=>{
    return <Favorite key={uuidv4()} 
            location={f.location} 
            temp={f.temp}
            icon={f.weatherIcon}  
            index={index}
            setFav={setFavoriteWeather}
            deleteFav={deleteFavorite}
            />
  })
  function weatherElements(){
    const variants = {
      hidden: { scale: 0.75 },
      visible: { scale: 1 },
    }
    
    const style={
      transform: (hideUI&&screenInfo) ?( width > 900 ? `translateY(${((screenInfo.carouselHeight-screenInfo.outerHeight)/2)+15}px)` : `translateX(${((screenInfo.carouselWidth-screenInfo.outerWidth)/2)+15}px)`):"",
      paddingBottom: (hideUI && width > 900) ?   "15px" :"",
      paddingRight: (hideUI && width <= 900) ?   "15px" :"",
    }
    
    const holderStyle = {marginBottom:"25px"}

    return weather !== null ?
     (
       
      <div className="App-header">
        {
          favorite.length > 0  &&
            <div ref={outerRef}  className={width <= 900 ?"fav-holder":"fav-holder-used"} style={holderStyle}>
              <div ref={carouselRef} style={style}  className="flex-dir">
                  {fav}
              </div>
            </div>
        }
        <motion.div className='info-container' initial="hidden" animate="visible" variants={variants}>
          <h1>{weather.location},{weather.country}</h1>
          <hr/>
          <h2>General Weather Information</h2>
          <hr/>
          <h4>Temperature: <span>{Math.round(weather.temp).toString()} &#8451;</span></h4>
          <h4>Feels Like: <span>{Math.round(weather.feelsLike).toString()} &#8451;</span></h4>
          <h4>Minimum Temperature: <span>{Math.round(weather.tempMin).toString()} &#8451;</span></h4>
          <h4>Maximum Temperature: <span>{Math.round(weather.tempMax).toString()} &#8451;</span></h4>     
          <h4>Pressure: <span>{Math.round(weather.pressure).toString()} hPa</span></h4>
          <hr/>
          <h2>Wind Information</h2>
          <hr/>
          <h4>Wind Speed: <span>{Math.round(weather.windSpeed).toString()} m/s</span></h4>
          <h4>Wind Direction: <span>{Math.round(weather.windDegrees).toString()} deg</span></h4>
          <hr/>
          <h2>Weather Condition</h2>
          <hr/>
          <h4><span>{weather.weatherCondition} </span></h4>
          <h4><span>{weather.weatherDescription}</span></h4>
          <img src={weather.weatherIcon} alt="" />
          <hr/>
          <button className='add-fav-button' onClick={addToFavorites}><FontAwesomeIcon icon={faHeart} size="2x" color={favorite.length>=10 ? "darkgrey" : '#f5aa1f'} className={playAnim?'animate__animated animate__tada':""}/></button>
        </motion.div>
      </div>
     )
    : 
      (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const style={
    display: !hideUI? "flex" : "",
    flexDirection: !hideUI? "row" : "",
    gap: !hideUI ? "10px" : "",
    paddingRight: (!hideUI ) ?   "15px" :"",

    transform: (!hideUI&&screenInfo) ? `translateX(${((screenInfo.carouselWidth-screenInfo.outerWidth)/2)+15}px)` : "",
}

  const formStyle= (hideUI) ? {margin: (width <= 900) ? "25px" : "25px 0 25px 0"} :{margin: (width > 900) ? "" : "25px"}

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }
  let element 

  if(firstWeather && !hideUI){
    element = (
      <div className='info-container'>
              <h1>{firstWeather.location},{firstWeather.country}</h1>
              <hr/>
              <h2>General Weather Information</h2>
              <hr/>
              <h4>Temperature: <span>{Math.round(firstWeather.temp).toString()} &#8451;</span></h4>
              <h4>Feels Like: <span>{Math.round(firstWeather.feelsLike).toString()} &#8451;</span></h4>
              <h4>Minimum Temperature: <span>{Math.round(firstWeather.tempMin).toString()} &#8451;</span></h4>
              <h4>Maximum Temperature: <span>{Math.round(firstWeather.tempMax).toString()} &#8451;</span></h4>     
              <h4>Pressure: <span>{Math.round(firstWeather.pressure).toString()} hPa</span></h4>
              <hr/>
              <h2>Wind Information</h2>
              <hr/>
              <h4>Wind Speed: <span>{Math.round(firstWeather.windSpeed).toString()} m/s</span></h4>
              <h4>Wind Direction: <span>{Math.round(firstWeather.windDegrees).toString()} deg</span></h4>
              <hr/>
              <h2>Weather Condition</h2>
              <hr/>
              <h4><span>{firstWeather.weatherCondition} </span></h4>
              <h4><span>{firstWeather.weatherDescription}</span></h4>
              <img src={firstWeather.weatherIcon} alt="" />
              <hr/>
              <button className='add-fav-button' onClick={addToFavorites}><FontAwesomeIcon icon={faHeart} size="2x" color={favorite.length>=10 ? "darkgrey" : '#f5aa1f'} className={playAnim?'animate__animated animate__tada':""}/></button>
            </div>
      )
  }

  return (
    <motion.div className="App" initial="hidden" animate="visible" variants={variants}>
    <h1 className='title'><FontAwesomeIcon icon={faCloudSun} color={'#f5aa1f'}/> Weather App </h1>
    <form onSubmit={handleLocation} style={formStyle}>
      <label htmlFor="location">Enter A Location : </label>
      <input type="text" name="location" id="location" ref={locationRef} required />
      <button type='submit' id='submit'>Submit</button>
    </form>
      {(favorite.length>0 && !hideUI) &&       
         <div ref={outerRef}  className={width <= 900 ? "fav-holder" :"fav-holder-nonused"} style={{marginBottom:"25px"}}>
           <div ref={carouselRef} className="flex-dir" style={style}>
            {fav}
           </div>
         </div>
       }
      {element}
      {location.length>0 && weatherElements()}
    </motion.div>
  );
}

export default App;