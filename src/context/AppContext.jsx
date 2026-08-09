import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getAppData, saveAppData, DEFAULT_DATA, normalizeData } from "../utils/storage.js";
import { updateStreak, getDayCompletedToday } from "../utils/progress.js";
import { ROADMAP } from "../data/roadmap.js";
import { todayDateKey, uid } from "../utils/helpers.js";
import { toast } from "../utils/toast.js";

const AppContext = createContext(null);

const bump = (next) => ({ ...next, _meta: { lastModifiedAt: Date.now() } });

export function AppProvider({ children }) {
  const [data, setData] = useState(() => getAppData());
  const dataRef = useRef(data);

  useEffect(() => {
    saveAppData(data);
    dataRef.current = data;
  }, [data]);

  const setProblemSolved = useCallback((progressKey, solved) => {
    const current = dataRef.current;
    const progress = { ...current.progress };
    if (solved) progress[progressKey] = "solved";
    else delete progress[progressKey];
    let next = { ...current, progress };

    let dayBlocked = false;
    const match = /^day(\d+)-problem\d+$/.exec(progressKey);
    if (match && solved) {
      const dayNumber = Number(match[1]);
      const day = ROADMAP.find((d) => d.day === dayNumber);
      if (
        day &&
        day.problems &&
        day.problems.length > 0 &&
        day.problems.every((problem) => progress[problem.progressKey])
      ) {
        const completedToday = getDayCompletedToday(next);
        if (completedToday === null || completedToday === dayNumber) {
          next = {
            ...next,
            days: {
              ...next.days,
              [dayNumber]: { completed: true, completedDate: todayDateKey(), mode: "auto" }
            },
            todayCompleted: { day: dayNumber, date: todayDateKey() },
            streak: updateStreak(next.streak)
          };
        } else {
          dayBlocked = true;
        }
      }
    }
    setData(bump(next));
    if (dayBlocked) {
      toast(`You already completed Day ${getDayCompletedToday(next)} today — come back tomorrow to keep your streak alive!`, "warning");
    } else {
      toast(solved ? "Marked as solved" : "Marked as not solved", solved ? "success" : "info");
    }
  }, []);

  const setProblemReview = useCallback((progressKey, review) => {
    setData((current) => {
      const reviews = { ...current.reviews };
      if (review) reviews[progressKey] = "needs-review";
      else delete reviews[progressKey];
      return bump({ ...current, reviews });
    });
    toast(review ? "Added to revision" : "Removed from revision", review ? "warning" : "info");
  }, []);

  const markUnderstood = useCallback((progressKey) => {
    setData((current) => {
      const reviews = { ...current.reviews };
      delete reviews[progressKey];
      return bump({ ...current, reviews });
    });
    toast("Marked as understood");
  }, []);

  const saveNote = useCallback((progressKey, text) => {
    setData((current) =>
      bump({
        ...current,
        notes: { ...current.notes, [progressKey]: text.trim() }
      })
    );
  }, []);

  const completeDay = useCallback((dayNumber, mode = "auto") => {
    const current = dataRef.current;
    if (current.days[dayNumber]?.completed) return;
    const completedToday = getDayCompletedToday(current);
    if (completedToday !== null && completedToday !== Number(dayNumber)) {
      toast(`Day ${completedToday} already completed today — come back tomorrow to keep your streak alive!`, "warning");
      return;
    }
    const streak = updateStreak(current.streak);
    setData(
      bump({
        ...current,
        days: {
          ...current.days,
          [dayNumber]: { completed: true, completedDate: todayDateKey(), mode }
        },
        todayCompleted: { day: dayNumber, date: todayDateKey() },
        streak
      })
    );
    toast(`Day ${dayNumber} completed! 🔥 ${streak.current}-day streak`, "success");
  }, []);

  const uncompleteDay = useCallback((dayNumber) => {
    setData((current) => {
      const days = { ...current.days };
      delete days[dayNumber];
      return bump({ ...current, days });
    });
    toast(`Day ${dayNumber} reopened`, "info");
  }, []);

  const recordSimulation = useCallback((result) => {
    setData((current) =>
      bump({
        ...current,
        simulations: [
          {
            id: uid(),
            date: todayDateKey(),
            ...result
          },
          ...(current.simulations || [])
        ]
      })
    );
  }, []);

  const setTheme = useCallback((theme) => {
    setData((current) =>
      bump({
        ...current,
        settings: { ...current.settings, theme }
      })
    );
  }, []);

  const resetProgress = useCallback(() => {
    setData((current) =>
      bump({
        ...DEFAULT_DATA,
        settings: current.settings,
        simulations: current.simulations
      })
    );
  }, []);

  const resetPlan = useCallback(() => {
    setData((current) =>
      bump({
        ...DEFAULT_DATA,
        settings: current.settings
      })
    );
  }, []);

  const importData = useCallback((raw) => {
    let parsed;
    if (typeof raw === "string") {
      parsed = JSON.parse(raw);
    } else {
      parsed = raw;
    }
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid data file");
    }
    const normalized = normalizeData(parsed);
    setData(bump(normalized));
    return true;
  }, []);

  const value = {
    data,
    setProblemSolved,
    setProblemReview,
    markUnderstood,
    saveNote,
    completeDay,
    uncompleteDay,
    recordSimulation,
    setTheme,
    resetProgress,
    resetPlan,
    importData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
