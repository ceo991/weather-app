import { motion } from "framer-motion";
import "./Favorite.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faTrashCan } from '@fortawesome/free-solid-svg-icons';

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
         <FontAwesomeIcon icon={faTrashCan} size="2x" color={'#e78181'} />
        </button>
      </div>
  );
}

export default Weather;
