import React from "react";

const LoadingSpinner = ({ size = 200 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width={size}
      height={size}
      style={{
        shapeRendering: "auto",
        display: "block",
        background: "transparent",
      }}
    >
      <g>
        <g transform="translate(50,50)">
          <g transform="scale(0.92)">
            <circle fill="#ffffff" r="50" cy="0" cx="0"></circle>
            <circle fill="#000000" r="15" cy="-28" cx="0">
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="1s"
                repeatCount="indefinite"
                keyTimes="0;1"
                values="0 0 0;360 0 0"
              ></animateTransform>
            </circle>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default LoadingSpinner;
