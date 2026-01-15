import "./homepage.css"
import { ZooVisitPlannerWidget, WhatsNewWidget, WeatherWidget } from "./zoo-widgets"



function Homepage() {
  return (
    <div className="background">
      <div className="home-content">
        <div className="home-title">
          <div className="home-kicker">ZOO FJRC</div>
          <h1>Willkommen im Zoo</h1>
          <p>Plane deinen Besuch und entdecke die neuesten Highlights.</p>
        </div>
        <div className="home-widgets">
          <ZooVisitPlannerWidget />
          <WhatsNewWidget />
          <WeatherWidget />
        </div>
      </div>
    </div>
  )
}

export default Homepage;
