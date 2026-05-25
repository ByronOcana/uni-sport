import Menu from "../Components/Menu"
import BetsDashboard from "../Components/BetsDashboard"
import "./DashboardPage.css"

function OnlinePage() {
  return (
    <div className="dashboard-layout">
      <Menu />
      <BetsDashboard />
    </div>
  )
}

export default OnlinePage