import * as React from "react"
import Svg, { Path } from "react-native-svg"
const RightArrowSVG = () => (
  <Svg
    width={40}
    height={40}
    fill="none"
  >
    <Path
      fill="#00B837"
      fillRule="evenodd"
      d="M11.25 18.75h13.233L19.33 13.6a1.252 1.252 0 1 1 1.769-1.775L28.17 18.9c.299.3.392.713.324 1.1.069.387-.025.8-.324 1.1l-7.071 7.075a1.252 1.252 0 0 1-1.769 0 1.26 1.26 0 0 1 0-1.775l5.153-5.15H11.25c-.69 0-1.25-.563-1.25-1.25 0-.688.56-1.25 1.25-1.25ZM20 40c11.045 0 20-8.95 20-20S31.045 0 20 0 0 8.95 0 20s8.955 20 20 20Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default RightArrowSVG
