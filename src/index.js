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
      <Text center size={contentMaxWidth * 0.08} position={[-contentMaxWidth / 3, contentMaxWidth / 12.4, -1]} color="#eeeeee">
        Making of
      </Text>
      <Text center size={contentMaxWidth * 0.08} position={[-contentMaxWidth / 3, -contentMaxWidth / 12.4, -1]} color="#eeeeee">
        Shikki
      </Text>
      {/* <Plane scale={[contentMaxWidth/10, contentMaxWidth / 10, 1]} color="#bfe2ca" map={map} /> */}
    </group>
  )
}

function Footer({ left, children, map }) {
  const { contentMaxWidth, canvasWidth, margin } = useBlock()
  const aspect = 1.75
  const alignRight = (canvasWidth - contentMaxWidth - margin) / 2
  return (
    <group position={[alignRight * (left ? -1 : 1), 0, 0]}>
      {children}
    </group>
  )
}

function Content({ left, children, map }) {
  const { contentMaxWidth, canvasWidth, margin } = useBlock()
  const aspect = 1.75
  const alignRight = (canvasWidth - contentMaxWidth - margin) / 2
  return (
    <group position={[alignRight * (left ? -1 : 1), 0, 0]}>
      <Plane scale={[contentMaxWidth, contentMaxWidth / aspect, 1]} map={map} />
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
          {/* <MultilineText top left size={contentMaxWidth * 0.05} lineHeight={contentMaxWidth / 5} position={[-contentMaxWidth / 2.0, 0, -1]} color="#2fe8c3" text={"four\nzero\nzero"} font = "/Fraunces_Regular.json" /> */}
          <Dom top style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "left", fontSize:'64px', fontWeight:'bold' }} position={[-contentMaxWidth / 2.0, -contentMaxWidth / 3.2, 1]}>
            木地
          </Dom>
          <Dom top style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "left" }} position={[-contentMaxWidth / 2.0, -contentMaxWidth / 2.3, 1]}>
            木地の仕事は、乾燥した木材を切り、削り、加工して漆器のカタチを作ります。
            木地師さんは、お椀などをつくる「丸物木地師」と、重箱やお盆など箱物をつくる「角物木地師」に分かれています。丸物と角物では、それぞれ使われる木材や道具が違います。木地師さんの仕事は下仕事ですが、漆器をつくる最初の仕事なのでとても大切な役割をになっています。
          </Dom>
        </Content>
      </Block>
      {/* Second section */}
      <Block factor={2.0} offset={2}>
        <Content map={img2} >
          <Dom top style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "right", fontSize:'64px', fontWeight:'bold'}} position={[mobile ? -contentMaxWidth / 2 : 0, -contentMaxWidth / 2 / aspect - 0.4, 1]}>
            下地
          </Dom>
          <Dom top style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "right" }} position={[mobile ? -contentMaxWidth / 2 : 0, -contentMaxWidth / 2.3, 1]}>
            「下地師」の仕事は、漆器を丈夫にする大切な仕事です。下地の方法には「本堅地」と「渋下地」という二つの方法があります。どちらも木の割れやすいところに布を着せて補強します。「本堅地」は、生漆（きうるし）と米のり、地の粉をまぜたものを何回も塗り重ねます。「渋下地」は、越前漆器の伝統的な下地方法で丸物におこなわれてきました。渋柿の汁「柿渋」に地炭粉を混ぜ、何度も塗り重ねます。漆も柿渋も乾くと堅くなり、何度も塗りと研ぎをくり返すことで、丈夫な漆器が作られます。
          </Dom>
        </Content>
      </Block>
      {/* Second section */}
      <Block factor={2.0} offset={3}>
        <Content left map={img3}>
          <Dom top style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "left", fontSize:'64px', fontWeight:'bold' }} position={[-contentMaxWidth / 2.0, -contentMaxWidth / 3.2, 1]}>
            中塗り
          </Dom>
          <Dom top style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "left" }} position={[-contentMaxWidth / 2.0, -contentMaxWidth / 2.3, 1]}>
            下地の工程を終了した木地に、刷毛で漆を塗っていきます。使用する漆はどのような加飾・仕上げをするかによって使い分けることになります。中塗りでは、中塗漆が用いられます。黒で仕上げる場合は黒中塗漆、その他は透中塗漆となります。漆ムロで乾燥させた後、炭で水研ぎを行い表面を平らにします
          </Dom>
        </Content>
      </Block>
      {/* Second section */}
      <Block factor={2.0} offset={4}>
        <Content map={img4}>
          <Dom top style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "right", fontSize:'64px', fontWeight:'bold' }} position={[mobile ? -contentMaxWidth / 2 : 0, -contentMaxWidth / 2 / aspect - 0.4, 1]}>
            上塗り
          </Dom>
          <Dom top style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "right" }} position={[mobile ? -contentMaxWidth / 2 : 0, -contentMaxWidth / 2.3, 1]}>
            上塗りでは、上塗漆が用いられます。黒で仕上げる場合は黒中塗漆、その他は透中塗漆となります。色漆は透中塗漆と顔料を混ぜて練り合わせ用いられます。上塗漆は精製の段階で油分が混入されており中塗よりもツヤのある塗り上がりとなります。呂色漆は精製の段階で油分は混入されていません
          </Dom>
        </Content>
      </Block>

      {/* Second section */}
      <Block factor={2.0} offset={5}>
        <Content left map={img5}>
          <Dom top style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "left", fontSize:'64px', fontWeight:'bold' }} position={[-contentMaxWidth / 2.0, -contentMaxWidth / 3.2, 1]}>
            加飾
          </Dom>
          <Dom top style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: "left" }} position={[-contentMaxWidth / 2.0, -contentMaxWidth / 2.3, 1]}>
            うるしを塗った器物に文様など装飾することを加飾と言います。代表的な蒔絵（まきえ）や螺鈿（らでん）をはじめ芸術性の高い多くの加飾法で飾られ、重要文化財（国宝）に指定された作品などは美しい絵柄が楽しめます
          </Dom>
        </Content>
      </Block>

      {/* Stripe */}
      <Block factor={-1.0} offset={4}>
        <Stripe />
      </Block>
      {/* Last section */}
      <Block factor={1.5} offset={6}>
        <Footer left map={img5}>
          <MultilineText top left size={contentMaxWidth * 0.015} lineHeight={contentMaxWidth * 0.02} position={[-contentMaxWidth / 2.0, 0, -1]} color="#cccccc" font = "/Inter.json" 
            text={
              "Source : \nhttp://ichirin.hateblo.jp/entry/2014/06/26/234303\nhttps://hidehiranuri.jp/craftmanship.html\nhttp://ichirin.hateblo.jp/entry/2014/06/27/163217\nhttps://dearfukui.jp/industry/1615"
            } 
          />
        </Footer>
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
          <Diamonds />
          <Pages />
          <Startup />
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        {/* <div style={{ height: `${state.pages * 100}vh` }} /> */}
        {new Array(state.sections).fill().map((_, index) => (
          index == 0?(
            <div key={index} id={"0" + index} style={{ height: `${(state.pages / state.sections) * 100}vh` }} >
              <div>
                <div class="mouse"><span></span></div>
              </div>
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
