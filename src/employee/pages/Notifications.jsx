import { useState, useEffect } from "react";
import { Pin, Bell } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { getNotifications, markAsRead } from "../services/notificationsService";

const categories = ["All", "Event", "Policy", "Holiday", "HR", "IT"];

function Notifications() {
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      setNotificationsList(res.data);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleCardClick = async (n) => {
    if (n.unread && n.id) {
      try {
        await markAsRead(n.id);
        fetchNotifs();
      } catch (err) {}
    }
  };

  const filtered = notificationsList.filter((n) => cat === "All" || n.tag === cat);
  const pinned = filtered.filter((n) => n.pinned);
  const rest = filtered.filter((n) => !n.pinned);

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle="Stay up to date with important updates" />

      <div className="flex flex-wrap gap-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              cat === c
                ? "bg-primary text-primary-foreground"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading notifications...</p>
      ) : (
        <>
          {pinned.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <Pin className="h-3.5 w-3.5" /> Pinned
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {pinned.map((n, idx) => (
                  <NotificationCard key={n.id || idx} a={n} onClick={() => handleCardClick(n)} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Bell className="h-3.5 w-3.5" /> Recent
            </h3>
            <div className="space-y-3">
              {rest.length > 0 ? (
                rest.map((a, idx) => (
                  <NotificationCard key={a.id || idx} a={a} onClick={() => handleCardClick(a)} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent notifications.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationCard({ a, onClick }) {
  return (
    <article
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-muted-foreground">
          {a.tag}
        </span>
        <div className="flex items-center gap-2 text-muted-foreground">
          {a.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
          {a.time}
        </div>
      </div>
      <h4 className="mt-3 text-base font-semibold">{a.title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
    </article>
  );
}

export default Notifications;