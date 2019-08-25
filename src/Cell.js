import React from "react";

const Cell = ({ isInitial, number, onChange }) => (
  <div
    onClick={ e => {
      if(isInitial)
      {
        return;
      }
      onChange((number + 1 ) %5);
    }}
    className={`cell ${isInitial ? "initial" : ""}`}
  >
    {number !== 0 && number}
  </div>
);

export default Cell;