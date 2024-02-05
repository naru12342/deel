import React from "react";
import { Day } from "./components/Day";

export const Week = ({ week }) => {
  return (
    <div className="week">
      {week.map((day, idx) => (
        <div key={idx}>
          {/* <h2>{day.format("DD")}</h2> */}
          <Day day={day} />
        </div>
      ))}
    </div>
  );
};