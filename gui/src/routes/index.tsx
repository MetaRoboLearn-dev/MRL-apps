import { createFileRoute } from '@tanstack/react-router'
import ActivityContainer from "../components/Landing/ActivityContainer.tsx";
import {Suspense} from "react";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="relative w-4/5 min-w-200 mx-auto font-display p-10 min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <ActivityContainer />
      </Suspense>
    </div>
  )
}