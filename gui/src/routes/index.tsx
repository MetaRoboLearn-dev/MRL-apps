import { createFileRoute } from '@tanstack/react-router'
import CodeScreen from "../components/CodeEditor/CodeScreen.tsx";
import SimScreen from "../components/Simulator/SimScreen.tsx";
import Footer from "../components/UI/Footer.tsx";
import {useGLTF} from "@react-three/drei";
import {TextureLoader} from "three";
import {useEffect} from "react";

export const Route = createFileRoute('/')({
  component: Index,
})

function AssetPreload() {
  useEffect(() => {
    const loader = new TextureLoader()
    loader.load('textures/fountain.png')
    loader.load('textures/lake.png')
  }, [])

  // drei caches these; calling in a component is fine
  useGLTF('models/Tree_big.glb')
  useGLTF('models/Tree_medium.glb')
  useGLTF('models/Tree_small.glb')

  return null
}

function Index() {
  return (
    <>
      <AssetPreload />
      <div className="flex-1 w-full flex min-h-0">
        <CodeScreen/>
        <SimScreen/>
      </div>
      <Footer/>
    </>
  )
}