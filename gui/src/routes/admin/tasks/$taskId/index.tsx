import { createFileRoute } from '@tanstack/react-router'
import CodeScreen from "../../../../components/CodeEditor/CodeScreen.tsx";
import SimScreen from "../../../../components/Simulator/SimScreen.tsx";
import Footer from "../../../../components/UI/Footer.tsx";
import {useEffect} from "react";
import {TextureLoader} from "three";
import {useGLTF} from "@react-three/drei";

function AssetPreload() {
  useEffect(() => {
    const loader = new TextureLoader()
    loader.load('/textures/fountain.png')
    loader.load('/textures/lake.png')
  }, [])

  useGLTF('/models/Tree_big.glb')
  useGLTF('/models/Tree_medium.glb')
  useGLTF('/models/Tree_small.glb')

  return null
}

export const Route = createFileRoute('/admin/tasks/$taskId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AssetPreload />
      <div className="flex-1 w-full flex min-h-0 h-180">
        <CodeScreen/>
        <SimScreen/>
      </div>
      <Footer/>
    </>
  )
}
