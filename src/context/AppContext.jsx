import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getAppData, saveAppData, DEFAULT_DATA, normalizeData } from "../utils/storage.js";
import { updateStreak, getDayCompletedToday } from "../utils/progress.js";
import { getCourse } from "../data/roadmap.js";
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

    const course = getCourse(current.settings.course);
    let dayBlocked = false;
    const match = /^(?:(\w+):)?day(\d+)-problem\d+$/.exec(progressKey);
    if (match && solved) {
      const courseId = match[1] || "dsa";
      const dayNumber = Number(match[2]);
      const day = course.roadmap.find((d) => d.day === dayNumber);
      if (
        day &&
        day.problems &&
        day.problems.length > 0 &&
        day.problems.every((problem) => progress[problem.progressKey])
      ) {
        const completedToday = getDayCompletedToday(next, courseId);
        if (completedToday === null || completedToday === dayNumber) {
          next = {
            ...next,
            days: {
              ...next.days,
              [day.dayKey]: { completed: true, completedDate: todayDateKey(), mode: "auto" }
            },
            todayCompleted: { course: courseId, day: dayNumber, date: todayDateKey() },
            streak: updateStreak(next.streak)
          };
        } else {
          dayBlocked = true;
        }
      }
    }
    setData(bump(next));
    if (dayBlocked) {
      toast(`You already completed Day ${getDayCompletedToday(next, course.id)} today — come back tomorrow to keep your streak alive!`, "warning");
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
    const course = getCourse(current.settings.course);
    const day = course.roadmap.find((d) => d.day === dayNumber);
    if (!day) return;
    if (current.days[day.dayKey]?.completed) return;
    const completedToday = getDayCompletedToday(current, course.id);
    if (completedToday !== null && completedToday !== dayNumber) {
      toast(`Day ${completedToday} already completed today — come back tomorrow to keep your streak alive!`, "warning");
      return;
    }
    const streak = updateStreak(current.streak);
    const progress = { ...current.progress };
    const isDynamic = day.type === "mixed" || day.type === "simulation";
    let marked = 0;
    if (!isDynamic) {
      (day.problems || []).forEach((problem) => {
        if (!progress[problem.progressKey]) {
          progress[problem.progressKey] = "solved";
          marked += 1;
        }
      });
    }
    setData(
      bump({
        ...current,
        progress,
        days: {
          ...current.days,
          [day.dayKey]: { completed: true, completedDate: todayDateKey(), mode }
        },
        todayCompleted: { course: course.id, day: dayNumber, date: todayDateKey() },
        streak
      })
    );
    toast(
      marked > 0
        ? `Day ${dayNumber} completed! ${marked} ${course.unit.toLowerCase()} marked done. 🔥 ${streak.current}-day streak`
        : `Day ${dayNumber} completed! 🔥 ${streak.current}-day streak`,
      "success"
    );
  }, []);

  const uncompleteDay = useCallback((dayNumber) => {
    const current = dataRef.current;
    const course = getCourse(current.settings.course);
    const day = course.roadmap.find((d) => d.day === dayNumber);
    if (!day) return;
    const days = { ...current.days };
    delete days[day.dayKey];
    setData(bump({ ...current, days }));
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

  const setCourse = useCallback((courseId) => {
    setData((current) =>
      bump({
        ...current,
        settings: { ...current.settings, course: courseId }
      })
    );
  }, []);

  const startCourse = useCallback((courseId) => {
    setData((current) =>
      bump({
        ...current,
        settings: {
          ...current.settings,
          started: { ...current.settings.started, [courseId]: true }
        }
      })
    );
    toast("Challenge started — Day 1 unlocked! 🔥", "success");
  }, []);

  const resetProgress = useCallback(() => {
    setData((current) =>
      bump({
        ...DEFAULT_DATA,
        settings: {
          ...current.settings,
          started: { dsa: false, react: false }
        },
        simulations: current.simulations
      })
    );
  }, []);

  const resetPlan = useCallback(() => {
    setData((current) =>
      bump({
        ...DEFAULT_DATA,
        settings: {
          ...current.settings,
          started: { dsa: false, react: false }
        }
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
    setCourse,
    startCourse,
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
