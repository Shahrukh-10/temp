import React from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const state = {
    name: "srk",
    class: "5b",
  };
  return (
      <NoteContext.Provider value={state}>
        {props.chlidren}
      </NoteContext.Provider>
  );
};

export default NoteState;
