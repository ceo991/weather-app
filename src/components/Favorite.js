import { motion } from "framer-motion";
import "./Favorite.css";

function Weather(props) {
  return (
      <div className="favorite" onClick={() => props.setFav(props.index)}>
        <h1>{props.location}</h1>
        <h1>
          <span>{Math.round(props.temp).toString()} &#8451;</span>
        </h1>
        <img src={props.icon} alt="" />
        <button
          className="delete-btn"
          onClick={(e) => props.deleteFav(e, props.index)}
        >
          X
        </button>
      </div>
  );
}

export default Weather;
