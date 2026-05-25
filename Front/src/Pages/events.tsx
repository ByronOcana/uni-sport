import EventsForm from "../Components/EventsForm"
import Menu from "../Components/Menu"
import "./DashboardPage.css"

function EventsPage() {
    return (
        <div className="dashboard-layout">
            <Menu />
            <EventsForm />
        </div>
    )
}

export default EventsPage