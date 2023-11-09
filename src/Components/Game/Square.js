import React from "react";

function Square({ value, onClick,makeUnClickable  }) {
  return (
    <button className="w-full h-full text-4xl bg-white border border-gray-400" onClick={onClick} disabled={makeUnClickable}>
      {value}
    </button>
  );
}

export default Square;
