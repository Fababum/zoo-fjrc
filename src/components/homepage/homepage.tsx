import "./homepage.css"
import NewArticles from "./newArticlesTemplate"
import { ZooVisitPlannerWidget, WhatsNewWidget } from "./zoo-widgets"



function Homepage() {
  return <div className="background">

      <div className="flex items-start gap-8">
        <ZooVisitPlannerWidget />
        <WhatsNewWidget />
      </div>
      </div>

}

export default Homepage;
