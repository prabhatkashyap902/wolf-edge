import React from "react";

function Square({ value, onClick }) {
  return (
    <button className="w-full h-full text-4xl bg-white border border-gray-400" onClick={onClick}>
      {value}
    </button>
  );
}

export default Square;
