import "./homepage.css"
import React from "react"
import { ZooVisitPlannerWidget, WhatsNewWidget, WeatherWidget, DailyScheduleWidget } from "./zoo-widgets"
import { TranslationsContext } from "../TranslationsContext"

function Homepage() {
  const context = React.useContext(TranslationsContext)
  if (!context) return null

  const { translations, lang } = context
  const t = translations.homepage
  const langKey = lang as keyof typeof t.kicker
  const schedule = {
  day: { start: "08:00", end: "18:00" },
  slots: {
    "08:00": [
      { key: "gatesOpen", start: "08:00", end: "08:30", locationKey: "mainEntrance", kind: "info" }
    ],
    "09:00": [
      { key: "morningWalk", start: "09:00", end: "09:30", locationKey: "panoramaTrail", kind: "tour" }
    ],
    "09:30": [
      { key: "kidsQuiz", start: "09:30", end: "10:00", locationKey: "educationCorner", kind: "kids" }
    ],
    "10:30": [
      { key: "feedingSavannah", start: "10:30", end: "11:00", locationKey: "savannahArea", kind: "feeding" },
      { key: "foxTalk", start: "10:30", end: "11:00", locationKey: "foxEnclosure", kind: "talk" }
    ],
    "12:00": [
      { key: "keeperTalk", start: "12:00", end: "12:30", locationKey: "elephantHouse", kind: "talk" }
    ],
    "14:00": [
      { key: "behindScenes", start: "14:00", end: "14:30", locationKey: "meetingPoint", kind: "tour" }
    ],
    "15:00": [
      { key: "craftCorner", start: "15:00", end: "15:30", locationKey: "kidsZone", kind: "kids" }
    ],
    "15:30": [
      { key: "feedingSavannah", start: "15:30", end: "16:00", locationKey: "savannahArea", kind: "feeding" }
    ],
    "17:30": [
      { key: "gatesClose", start: "17:30", end: "18:00", locationKey: "mainEntrance", kind: "info" }
    ]
  }
}


  return (
    <div className="background">
      <div className="home-content">
        <div className="home-title">
          <div className="home-kicker">{t.kicker[langKey]}</div>
          <h1>{t.title[langKey]}</h1>
          <p>{t.subtitle[langKey]}</p>
        </div>
        <div className="home-widgets">
          <ZooVisitPlannerWidget />
          <WhatsNewWidget />
          <DailyScheduleWidget schedule={schedule} />
          <WeatherWidget />
        </div>
      </div>
    </div>
  )
}

export default Homepage
