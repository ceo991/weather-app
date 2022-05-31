import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart} from '@fortawesome/free-solid-svg-icons';
import 'animate.css';
import { motion } from "framer-motion"
import '../App.css';

function WeatherCard(props) {


  return (
    <motion.div className='info-container'  initial="hidden" animate="visible" variants={props.variants}>
    <h1>{props.location},{props.country}</h1>
    <hr/>
    <h2>General Weather Information</h2>
    <hr/>
    <h4>Temperature: <span>{Math.round(props.temp).toString()} &#8451;</span></h4>
    <h4>Feels Like: <span>{Math.round(props.feelsLike).toString()} &#8451;</span></h4>
    <h4>Minimum Temperature: <span>{Math.round(props.tempMin).toString()} &#8451;</span></h4>
    <h4>Maximum Temperature: <span>{Math.round(props.tempMax).toString()} &#8451;</span></h4>     
    <h4>Pressure: <span>{Math.round(props.pressure).toString()} hPa</span></h4>
    <hr/>
    <h2>Wind Information</h2>
    <hr/>
    <h4>Wind Speed: <span>{Math.round(props.windSpeed).toString()} m/s</span></h4>
    <h4>Wind Direction: <span>{Math.round(props.windDegrees).toString()} deg</span></h4>
    <hr/>
    <h2>Weather Condition</h2>
    <hr/>
    <h4><span>{props.weatherCondition} </span></h4>
    <h4><span>{props.weatherDescription}</span></h4>
    <img src={props.weatherIcon} alt="" />
    <hr/>
    <button className='add-fav-button' onClick={props.addToFavorites}><FontAwesomeIcon icon={faHeart} size="2x" color={props.favorite.length>=10 ? "darkgrey" : '#f5aa1f'} className={props.playAnim?'animate__animated animate__tada':""}/></button>
  </motion.div>
  )
}

export default WeatherCard