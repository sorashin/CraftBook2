import ReactDOM from "react-dom"
import lerp from "lerp"
import React, { Suspense, useRef, useEffect } from "react"
import { Canvas, Dom, useFrame, useLoader } from "react-three-fiber"
import {TextureLoader, LinearFilter } from "three"
import { Text, MultilineText } from "./components/Text"
import { Block, useBlock } from "./blocks"
import Diamonds from "./diamonds/Diamonds"
import state from "./store"
import "./CustomMaterial"
import "./styles.css"

function Plane({ color = "white", map, ...props }) {
  const { viewportHeight, offsetFactor } = useBlock()
  const material = useRef()
  let last = state.top.current
  useFrame(() => {
    const { pages, top } = state
    material.current.scale = lerp(material.current.scale, offsetFactor - top.current / ((pages - 1) * viewportHeight), 0.1)
    material.current.shift = lerp(material.current.shift, (top.current - last) / 150, 0.1)
    last = top.current
  })
  return (
    <mesh {...props}>
      <planeBufferGeometry attach="geometry" args={[1, 1, 32, 32]} />
      <customMaterial ref={material} attach="material" color={color} map={map} />
    </mesh>
  )
}


function Hero({ children, map }) {
  const { contentMaxWidth, canvasWidth, margin } = useBlock()
  const aspect = 1.75
  const alignCenter = (canvasWidth - contentMaxWidth) / 2
  return (
    <group position={[alignCenter, 0, 0]}>
      <Text center size={contentMaxWidth * 0.08} position={[-5, 1.5, -1]} color="#eeeeee">
        Making of
      </Text>
      <Text center size={contentMaxWidth * 0.08} position={[-5, -1.5, -1]} color="#eeeeee">
        Echizen Shikki
      </Text>
    </group>
  )
}

function Content({ left, children, map }) {
  const { contentMaxWidth, canvasWidth, margin } = useBlock()
  const aspect = 1.75
  const alignRight = (canvasWidth - contentMaxWidth - margin) / 2
  return (
    <group position={[alignRight * (left ? -1 : 1), 0, 0]}>
      <Plane scale={[contentMaxWidth, contentMaxWidth / aspect, 1]} color="#bfe2ca" map={map} />
      {children}
    </group>
  )
}



function Stripe() {
  const { contentMaxWidth } = useBlock()
  return <Plane scale={[100, contentMaxWidth, 1]} rotation={[0, 0, Math.PI / 4]} position={[0, 0, -1]} color="#171725" />
}

function Pages() {
  const textures = useLoader(TextureLoader, state.images)
  const [img1, img2, img3, img4, img5, img6] = textures.map(texture => ((texture.minFilter = LinearFilter), texture))
  const { contentMaxWidth, mobile, canvasWidth, canvasHeight } = useBlock()
  const aspect = 1.75
  const pixelWidth = contentMaxWidth * state.zoom
  return (
    <>
      {/* Title Section */}
      <Block factor={1.5} offset={0}>
        <Hero/>
        {/* <Dom style={{ 
            // width: pixelWidth / (mobile ? 1 : 2), 
            textAlign: "center",
            fontSize:'72px'
            }} 
            position={[0.3, -1, 1]}>
            Making of Echizen Shikki
        </Dom> */}
      </Block>
      {/* First section */}
      <Block factor={2.0} offset={1}>
        <Content left map={img1}>
          <Dom style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "left" }} position={[-contentMaxWidth / 2, -contentMaxWidth / 2 / aspect - 0.4, 1]}>
            The substance can take you to heaven but it can also take you to hell.
          </Dom>
        </Content>
      </Block>
      {/* Second section */}
      <Block factor={2.0} offset={2}>
        <Content map={img2}>
          <Dom style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "right" }} position={[mobile ? -contentMaxWidth / 2 : 0, -contentMaxWidth / 2 / aspect - 0.4, 1]}>
            We’ve found that the people whose EEG doesn’t show any alpha-wave activity when they’re relaxed aren’t likely to respond significantly to the substance.
          </Dom>
        </Content>
      </Block>
      {/* Second section */}
      <Block factor={2.0} offset={3}>
        <Content map={img3}>
          <Dom style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "right" }} position={[mobile ? -contentMaxWidth / 2 : 0, -contentMaxWidth / 2 / aspect - 0.4, 1]}>
            We’ve found that the people whose EEG doesn’t show any alpha-wave activity when they’re relaxed aren’t likely to respond significantly to the substance.
          </Dom>
        </Content>
      </Block>
      {/* Second section */}
      <Block factor={2.0} offset={4}>
        <Content map={img4}>
          <Dom style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "right" }} position={[mobile ? -contentMaxWidth / 2 : 0, -contentMaxWidth / 2 / aspect - 0.4, 1]}>
            We’ve found that the people whose EEG doesn’t show any alpha-wave activity when they’re relaxed aren’t likely to respond significantly to the substance.
          </Dom>
        </Content>
      </Block>

      {/* Stripe */}
      <Block factor={-1.0} offset={4}>
        <Stripe />
      </Block>
      {/* Last section */}
      <Block factor={1.5} offset={5}>
        <Content left map={img5}>
          <Dom style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "left" }} position={[-contentMaxWidth / 2, -contentMaxWidth / 2 / aspect - 0.4, 1]}>
            Education and enlightenment.
          </Dom>
        </Content>
      </Block>
    </>
  )
}

function Startup() {
  const ref = useRef()
  useFrame(() => (ref.current.material.opacity = lerp(ref.current.material.opacity, 0, 0.025)))
  return (
    <mesh ref={ref} position={[0, 0, 200]} scale={[100, 100, 1]}>
      <planeBufferGeometry attach="geometry" />
      <meshBasicMaterial attach="material" color="#070712" transparent />
    </mesh>
  )
}

function App() {
  const scrollArea = useRef()
  const onScroll = e => (state.top.current = e.target.scrollTop)
  useEffect(() => void onScroll({ target: scrollArea.current }), [])
  return (
    <>
      <Canvas orthographic camera={{ zoom: state.zoom, position: [0, 0, 500] }}>
        <Suspense fallback={<Dom center className="loading" children="Loading..." />}>
          <Pages />
          <Diamonds />
          <Startup />
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        {/* <div style={{ height: `${state.pages * 100}vh` }} /> */}
        {new Array(state.sections).fill().map((_, index) => (
          index == 0?(
            <div key={index} id={"0" + index} style={{ height: `${(state.pages / state.sections) * 100}vh` }} >
              {/* <h1>Making of EchizenShilkki</h1> */}
            </div>
          ):(
            <div key={index} id={"0" + index} style={{ height: `${(state.pages / state.sections) * 100}vh` }} />
          )
        ))}
      </div>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
