import Menu from "../Components/Menu"
import BetHistory from "../Components/BetHistory"
import "./DashboardPage.css"

function BetsPage() {
  return (
    <div className="dashboard-layout">
      <Menu />
      <BetHistory />
    </div>
  )
}

export default BetsPage