import React from 'react'

function Form({handleLocation, locationRef, formStyle}) {
  return (
    <form onSubmit={handleLocation} style={formStyle}>
        <label htmlFor="location">Enter A Location : </label>
        <input type="text" name="location" id="location" ref={locationRef} required />
        <button type='submit' id='submit'>Submit</button>
    </form>
  )
}

export default Form