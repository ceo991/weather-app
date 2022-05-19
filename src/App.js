import React,{useState,useEffect,useRef,useLayoutEffect} from 'react';
import Favorite from './components/Favorite'
import { motion } from "framer-motion"
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {

  const[lon,setLon]=useState(0);
  const[lat,setLat]=useState(0);
  const[width,setWidth]=useState(window.innerWidth);
  const[location,setLocation]=useState("");
  const[dragDirection,setDragDirection]=useState("x");
  const[weather,setWeather] = useState(null);
  const[favorite,setFavorite] = useState([]);
  const[hideUI,setHideUI] = useState(false);
  const[isDragging,setIsDragging] = useState(false);
  const locationRef = useRef("");
  const carouselRef = useRef();
  const Weather_Key="FAV_WEATHER";
  //let favWeather = undefined;

useEffect(()=>{
  window.addEventListener("resize",()=>{setWidth(window.innerWidth);})
  let favWeather = JSON.parse(localStorage.getItem(Weather_Key));
  console.log(favWeather)
  if(favWeather.length>0){
    favWeather.map((fav)=>{
       fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${fav.latitude}&lon=${fav.longitude}&units=metric&appid=7d2e6b6e789a35974f922c6c41c0d301`)
        .then( res => res.json()).then(data=>{
          // console.log(data.main);
          // console.log(data.wind);
          //  console.log(data);
          //setLocation(fav.location)
          const weatherData = {
            location:fav.location[0].toUpperCase().concat(fav.location.slice(1,fav.location.length).toLocaleLowerCase()),
            temp:data.main.temp,
            weatherCondition:data.weather[0].main,
            weatherIcon:"http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
            longitude:data.coord.lon,
            latitude:data.coord.lat,
            id:data.name.concat(data.sys.country)
          }
          //setWeatherSimple(weatherData);
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
      // console.log(data.main);
      // console.log(data.wind);
      //console.log(data);
      const weatherData = {
        location:location[0].toUpperCase().concat(location.slice(1,location.length).toLocaleLowerCase()),
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

// useLayoutEffect(() =>{
//   setWidth(window.innerWidth)
// })

useEffect(() => {
  //setWidth(window.innerWidth)
  // console.log(width)
  // updateDragDirection(width)
  if(carouselRef.current){
    console.log(carouselRef.current.scrollWidth)
  }
})

function updateDragDirection(w){
  w <= 900 ? setDragDirection("x"): setDragDirection("y")
}

function updateWidth(){
  setWidth(window.innerWidth)
}

  function handleLocation(e){
    e.preventDefault();
    setLocation(locationRef.current.value)
    if(favorite.length>0){
      favorite.map((fav)=>{
  
          fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${fav.latitude}&lon=${fav.longitude}&units=metric&appid=7d2e6b6e789a35974f922c6c41c0d301`)
          .then(res => res.json()).then(data=>{
            // console.log(data.main);
            // console.log(data.wind);
            // console.log(data);
            //setLocation(fav.location)
            const weatherData = {
              location:fav.location[0].toUpperCase().concat(fav.location.slice(1,fav.location.length).toLocaleLowerCase()),
              temp:data.main.temp,
              weatherCondition:data.weather[0].main,
              weatherIcon:"http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
              longitude:data.coord.lon,
              latitude:data.coord.lat,
              id:data.name.concat(data.sys.country)
            }
            //setWeatherSimple(weatherData);
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
            // console.log(data.main);
            // console.log(data.wind);
            // console.log(data);
            //setLocation(fav.location)
            const weatherData = {
              location:fav.location[0].toUpperCase().concat(fav.location.slice(1,fav.location.length).toLocaleLowerCase()),
              temp:data.main.temp,
              weatherCondition:data.weather[0].main,
              weatherIcon:"http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
              longitude:data.coord.lon,
              latitude:data.coord.lat,
              id:data.name.concat(data.sys.country)
            }
            //setWeatherSimple(weatherData);
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
      alert("maximum 10 favorites are allowed")
      return
    }
    setFavorite(prevFav=>{         
      let arr = [...prevFav,weather]
      let uniqArr=arr.reduce((map,obj)=>map.set(obj.id,obj),new Map()).values()
      return [...uniqArr]
    });
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
    
    
    return weather !== null ?
     (
       
      <div className="App-header">
        {
          favorite.length > 0  &&
            <div className={width <= 900 ?"fav-holder":"fav-holder-used"}>
              <div  className="flex-dir">
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
          <button className='add-fav-button' onClick={addToFavorites}>Add To Favorites</button>
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

  // let overFlowProperty = width<=900 ? "overflowX: scroll":"overflow: hidden"
  // let overFlowValue = !hideUI ? "scroll" : "hide"

  const style={
    display: !hideUI? "flex" : "",
    flexDirection: !hideUI? "row" : "",
    gap: !hideUI ? "10px" : "",
    // width: !hideUI ? "1620px"  :"",
    // height: !hideUI ? "" : "",
    // transform: !hideUI ? `translateX(${(((width <= 900?102:232)*favorite.length+10*favorite.length-(width <= 900?width:600))/2)+10}px)` : "",
    transform: !hideUI ? `translateX(${(((width <= 900?102:232)*favorite.length+10*favorite.length-(width <= 900?width:600))/2)+10}px)` : "",
    // overFlowProperty
}

  return (
    <div className="App">
    <form onSubmit={handleLocation}>
      <label htmlFor="location">Enter A Location:</label>
      <input type="text" name="location" id="location" ref={locationRef} required />
      <button type='submit'>Submit</button>
    </form>
      {(favorite.length>0 && !hideUI) &&       
         <div  className={width <= 900 ? "fav-holder" :"fav-holder-nonused"}>
           <div ref={carouselRef} className="flex-dir" style={style}>
            {fav}
           </div>
         </div>
       }
      {location.length>0 && weatherElements()}
    </div>
  );
}

export default App;