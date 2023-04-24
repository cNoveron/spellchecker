import { set } from "lodash";
import React, { useState, useEffect } from "react";
import Search from "react-searchbox-awesome";

function App() {
  const [filtered, setFiltered] = useState([]);
  const [previousEvent, setPreviousEvent] = useState(null);

  // here the data is filtered as you search
  const inputHandler = e => {
    if (previousEvent) previousEvent.preventDefault();
    setPreviousEvent(e)
    const input = e.target.value;
    if (input.length < 3) {
      setFiltered([]);
    } else {
      setTimeout(() => {
        fetch(`http://localhost:31337/spellcheck/${input}`)
          .then(async response => {
              return await response.json()
          })
          .then(r => {
            setFiltered(r.suggestions.map(s => ({'name': s})))
          })
        },
        500
      )
    }
  };

  /*
    here you define what happens when you press enter. 
    note that the data that is passed to the list element, is stored in the data-set attribute.
  */
  const enterHandler = e => {
    const searchitem = JSON.parse(e.target.dataset.searchitem);
    console.log("Enter pressed", searchitem);
  };

  // same as above
  const clickHandler = e => {
    inputHandler(e)
  };

  // this is to close the searchlist when you click outside of it.
  const clickOutsideHandler = e => {
    console.log(e.target);
    if (!e.target.closest(".ReactSearchboxAwesome")) {
      setFiltered([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickOutsideHandler);
    return () => document.removeEventListener("click", clickOutsideHandler);
  }, []);

  /* the style defined here is passed to child elements
  note: children inherit some styles like font size, color, line-height...
  there are some default styles as well.
  */
  const style = {
    width: "calc(80% + (100vw - 100%))",
    color: "#333", // children inherit
    backgroundColor: "white", // children inherit
    fontSize: "2.5rem", // children inherit
    position: "absolute",
    top: "3rem",
    boxShadow: "0 0 28px 2px rgba(0,0,0,0.1)",
    border: "none",
    overflow: "hidden"
  };

  const style1 = {
    ...style,
    borderRadius: "15px",
    backgroundColor: "rgba(250,250,250,0.2)"
  };

  // thats the style for the active element (hover, focus)
  const activeStyle = {
    backgroundColor: "pink"
  };

  const activeStyle1 = {
    backgroundImage:
      "linear-gradient(319deg, #bbff99 0%, #ffec99 37%, #ff9999 100%)"
  };

  const activeStyle2 = {
    backgroundColor: "rgba(255,230,230,.3)"
  };

  return (
    <div className={"App"}>
      <Search
        data={filtered} // array of the objects is passed here. []{title: string}. each object is saved in dataset of the correspondent element.
        mapping={{ title: "name" }} // when they don't correspond, allows to map the title of the search item and the name property in the filtered data.
        style={style1} // child elements inherit some styles.
        activeStyle={activeStyle2} // hover, focus, active color.
        placeholder={"Type your words here."} // input placeholder.
        shortcuts={true} // hide or show span elements that display shortcuts.
        // onEnter={enterHandler} // applies only to the list "li" element
        onInput={inputHandler}
        onClick={clickHandler} // applies only to the list "li" element
      />
    </div>
  );
}

export default App;
