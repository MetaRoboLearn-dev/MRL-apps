import { createFileRoute } from '@tanstack/react-router'
import BrokerTestPage from '../pages/BrokerTestPage'

export const Route = createFileRoute('/test_broker')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BrokerTestPage />
}
