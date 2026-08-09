import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getAppData, saveAppData, DEFAULT_DATA } from "../utils/storage.js";
import { updateStreak } from "../utils/progress.js";
import { ROADMAP } from "../data/roadmap.js";
import { todayDateKey, uid } from "../utils/helpers.js";
import { toast } from "../utils/toast.js";

const AppContext = createContext(null);

const bump = (next) => ({ ...next, _meta: { lastModifiedAt: Date.now() } });

export function AppProvider({ children }) {
  const [data, setData] = useState(() => getAppData());

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const setProblemSolved = useCallback((progressKey, solved) => {
    setData((current) => {
      const progress = { ...current.progress };
      if (solved) progress[progressKey] = "solved";
      else delete progress[progressKey];
      let next = { ...current, progress };

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
          next = {
            ...next,
            days: {
              ...next.days,
              [dayNumber]: { completed: true, completedDate: todayDateKey(), mode: "auto" }
            },
            streak: updateStreak(next.streak)
          };
        }
      }
      return bump(next);
    });
    toast(solved ? "Marked as solved" : "Marked as not solved", solved ? "success" : "info");
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
    setData((current) => {
      if (current.days[dayNumber]?.completed) return current;
      return bump({
        ...current,
        days: {
          ...current.days,
          [dayNumber]: { completed: true, completedDate: todayDateKey(), mode }
        },
        streak: updateStreak(current.streak)
      });
    });
    toast(`Day ${dayNumber} completed!`);
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
    resetPlan
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
