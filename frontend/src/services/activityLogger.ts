export interface Activity {
  type: string;
  game?: string;
  score?: number;
  result?: "Victory" | "Defeat";
  metadata?: any;
  timestamp: string;
}

export async function logActivity(activity: Activity, isAuthenticated: boolean) {
  if (isAuthenticated) {
    try {
      await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(activity)
      });
      console.log(`[DB RECORDED] (Auth=True) Logged via API endpoint: /api/activities`, activity);
    } catch (error) {
      console.warn("Failed to reach DB API, it might not be built yet.", error);
    }
  } else {
    const CACHE_KEY = "pixelops_guest_activities";
    const cache = localStorage.getItem(CACHE_KEY);
    const activities = cache ? JSON.parse(cache) : [];
    
    activities.unshift(activity);
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(activities));
    console.log(`[CACHE SAVED] (Auth=False) Saved activity into LocalStorage -> ${CACHE_KEY}`, activity);
  }
}
