import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const BackArrowSVG = () => (
  <Svg
    width={40}
    height={40}
    fill="none"
  >
    <G clipPath="url(#a)">
      <Path
        fill="#0FD"
        fillRule="evenodd"
        d="M28.75 21.25H15.518l5.152 5.15a1.252 1.252 0 1 1-1.769 1.775L11.83 21.1c-.299-.3-.393-.713-.324-1.1-.069-.387.025-.8.324-1.1l7.071-7.075a1.252 1.252 0 0 1 1.769 0 1.26 1.26 0 0 1 0 1.775l-5.153 5.15H28.75c.69 0 1.25.563 1.25 1.25 0 .688-.56 1.25-1.25 1.25ZM20 0C8.955 0 0 8.95 0 20s8.955 20 20 20 20-8.95 20-20S31.045 0 20 0Z"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h40v40H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default BackArrowSVG
