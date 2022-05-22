import { motion } from "framer-motion";
import "./Favorite.css";

function Weather({index,location,setFav,temp,icon,deleteFav}) {
  return (
      <div className="favorite" onClick={() => setFav(index)}>
        <h1>{location}</h1>
        <h1>
          <span>{Math.round(temp).toString()} &#8451;</span>
        </h1>
        <img src={icon} alt="" />
        <button
          className="delete-btn"
          onClick={(e) => deleteFav(e, index)}
        >
          X
        </button>
      </div>
  );
}

export default Weather;
