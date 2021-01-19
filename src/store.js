import { createRef } from "react"
import { Vector3 } from "three"

const state = {
  sections: 7,
  pages: 7,
  zoom: 75,
  images: ["/001.jpg", "/002.jpg", "/003.jpg", "/004.jpg", "/005.jpg", "/006.jpg"],
  diamonds: [
    { x: 0, offset: 1.1, pos: new Vector3(), factor: 1.25 },
    { x: 0, offset: 2.1, pos: new Vector3(), factor: 1.5 },
    { x: 0, offset: 3.1, pos: new Vector3(), factor: 1.75 },
    { x: 0, offset: 4.1, pos: new Vector3(), factor: 2.00 }
  ],
  top: createRef()
}

export default state
