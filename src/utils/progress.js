import { DSA, getAllProblems, getDayProblems, DIFFICULTY_ORDER, TOPICS } from "../data/roadmap.js";
import { todayDateKey, yesterdayDateKey, clamp } from "./helpers.js";

export function isProblemSolved(data, key) {
  return Boolean(data.progress[key]);
}

export function isProblemReview(data, key) {
  return data.reviews[key] === "needs-review";
}

export function isCourseStarted(data, courseId = data.settings.course) {
  if (data.settings?.started?.[courseId]) return true;
  const prefix = courseId === "dsa" ? "" : `${courseId}:`;
  const hasDays = Object.keys(data.days || {}).some(
    (key) => key.startsWith(prefix) && data.days[key]?.completed
  );
  const hasProblems = Object.keys(data.progress || {}).some((key) => key.startsWith(prefix));
  return hasDays || hasProblems;
}

export function isDayCompleted(data, day) {
  return Boolean(data.days?.[day.dayKey]?.completed);
}

export function getDayCompletedToday(data, courseId = "dsa", today = todayDateKey()) {
  const marker = data.todayCompleted;
  const markerCourse = marker?.course || "dsa";
  if (marker && markerCourse === courseId && marker.date === today) {
    return marker.day;
  }
  const prefix = courseId === "dsa" ? "" : `${courseId}:`;
  for (const [dayKey, info] of Object.entries(data.days || {})) {
    if (!dayKey.startsWith(prefix)) continue;
    if (info.completed && info.completedDate === today) {
      const parsed = courseId === "dsa" ? Number(dayKey) : Number(dayKey.slice(prefix.length).replace(/^day-/, ""));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

export function canStartDay(data, day) {
  const courseId = day.courseId || "dsa";
  const completedToday = getDayCompletedToday(data, courseId);
  if (completedToday === null) return true;
  return day.day <= completedToday;
}

export function isDayCompleteFromProblems(data, day) {
  if (!day.problems || day.problems.length === 0) return false;
  return day.problems.every((problem) => isProblemSolved(data, problem.progressKey));
}

export function getDayProblemStats(data, day) {
  const problems = getDayProblems(day);
  const solved = problems.filter((prob) => isProblemSolved(data, prob.progressKey)).length;
  return { total: problems.length, solved, percent: problems.length ? (solved / problems.length) * 100 : 0 };
}

export function updateStreak(streak) {
  const today = todayDateKey();
  const yesterday = yesterdayDateKey();
  let current = streak.current || 0;
  if (streak.lastCompletedDate === today) {
    return { ...streak, longest: Math.max(streak.longest || 0, current) };
  }
  current = streak.lastCompletedDate === yesterday ? current + 1 : 1;
  return {
    current,
    longest: Math.max(streak.longest || 0, current),
    lastCompletedDate: today
  };
}

export function getCurrentDay(data, course) {
  const firstIncomplete = course.roadmap.find((day) => !isDayCompleted(data, day));
  return firstIncomplete || course.roadmap[course.roadmap.length - 1];
}

export function isChallengeComplete(data, course) {
  return course.roadmap.every((day) => isDayCompleted(data, day));
}

export function calculateProgress(data, course) {
  const roadmap = course.roadmap;
  const totalDays = roadmap.length;
  const daysCompleted = roadmap.filter((day) => isDayCompleted(data, day)).length;

  const problems = getAllProblems(roadmap);
  const totalProblems = problems.length;
  const problemsSolved = problems.filter((prob) => isProblemSolved(data, prob.progressKey)).length;
  const problemsToReview = problems.filter((prob) => isProblemReview(data, prob.progressKey)).length;

  const difficultyStats = {};
  const topicStats = {};
  if (course.hasTopics) {
    for (const diff of Object.keys(course.difficultyOrder)) {
      const list = problems.filter((prob) => prob.difficulty === diff);
      const solved = list.filter((prob) => isProblemSolved(data, prob.progressKey)).length;
      difficultyStats[diff] = {
        total: list.length,
        solved,
        percent: list.length ? (solved / list.length) * 100 : 0
      };
    }

    for (const topic of course.topics) {
      const list = problems.filter((prob) => prob.topic === topic);
      const solved = list.filter((prob) => isProblemSolved(data, prob.progressKey)).length;
      const review = list.filter((prob) => isProblemReview(data, prob.progressKey)).length;
      topicStats[topic] = {
        total: list.length,
        solved,
        review,
        percent: list.length ? (solved / list.length) * 100 : 0
      };
    }
  }

  const currentDay = getCurrentDay(data, course);
  const challengeComplete = daysCompleted === totalDays;

  return {
    totalDays,
    daysCompleted,
    daysPercent: (daysCompleted / totalDays) * 100,
    totalProblems,
    problemsSolved,
    problemsPercent: totalProblems ? (problemsSolved / totalProblems) * 100 : 0,
    problemsToReview,
    difficultyStats,
    topicStats,
    currentDay,
    challengeComplete
  };
}

function getSimulationMistakeCounts(data) {
  const counts = {};
  (data.simulations || []).forEach((sim) => {
    (sim.weakTopics || []).forEach((topic) => {
      counts[topic] = (counts[topic] || 0) + 1;
    });
  });
  return counts;
}

export function getWeakTopics(data, limit = 3, roadmap = DSA.roadmap) {
  const progress = calculateProgress(data, DSA);
  const simMistakes = getSimulationMistakeCounts(data);

  const scored = TOPICS.map((topic) => {
    const stats = progress.topicStats[topic];
    const solved = stats.solved;
    const total = stats.total;
    const review = stats.review;
    const unsolved = total - solved;

    const simPenalty = (simMistakes[topic] || 0) * 1.5;
    const weakness = unsolved + review * 2 + simPenalty;

    const ratio = total ? solved / total : 0;
    const status = ratio >= 0.8 && review === 0 ? "Strong" : ratio >= 0.5 ? "Average" : "Needs Practice";
    return { topic, total, solved, review, unsolved, weakness, ratio, status };
  })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.weakness - a.weakness);

  return scored.slice(0, limit);
}

export function getStudiedTopics(data, roadmap = DSA.roadmap) {
  const problems = getAllProblems(roadmap);
  const studied = new Set();
  problems.forEach((prob) => {
    if (isProblemSolved(data, prob.progressKey)) studied.add(prob.topic);
  });
  return [...studied];
}

export function getRevisionProblems(data, limit = 5, roadmap = DSA.roadmap) {
  const problems = getAllProblems(roadmap);
  const flagged = problems.filter((prob) => isProblemReview(data, prob.progressKey));

  const score = (prob) => DIFFICULTY_ORDER[prob.difficulty] || 1;

  const sortForRevision = (list) =>
    [...list].sort((a, b) => {
      const aReview = isProblemReview(data, a.progressKey) ? 1 : 0;
      const bReview = isProblemReview(data, b.progressKey) ? 1 : 0;
      if (aReview !== bReview) return bReview - aReview;
      if (!isProblemSolved(data, a.progressKey) !== !isProblemSolved(data, b.progressKey)) {
        return isProblemSolved(data, a.progressKey) ? 1 : -1;
      }
      return score(b) - score(a);
    });

  const result = [];
  const pushUnique = (list) => {
    for (const prob of list) {
      if (result.length >= limit) return;
      if (!result.some((r) => r.progressKey === prob.progressKey)) {
        result.push(prob);
      }
    }
  };

  pushUnique(sortForRevision(flagged));

  if (result.length < limit) {
    const unsolved = sortForRevision(problems.filter((prob) => !isProblemSolved(data, prob.progressKey)));
    pushUnique(unsolved);
  }
  if (result.length < limit) {
    const solved = sortForRevision(problems.filter((prob) => isProblemSolved(data, prob.progressKey)));
    pushUnique(solved);
  }

  return result.slice(0, limit);
}

export function getRecommendedProblems(data, weakTopics, limit = 6, roadmap = DSA.roadmap) {
  const weakTopicNames = new Set(weakTopics.map((item) => item.topic));
  const problems = getAllProblems(roadmap);
  const candidates = problems.filter(
    (prob) =>
      weakTopicNames.has(prob.topic) &&
      !isProblemSolved(data, prob.progressKey) &&
      !isProblemReview(data, prob.progressKey)
  );
  const fallback = problems.filter(
    (prob) => weakTopicNames.has(prob.topic) && isProblemReview(data, prob.progressKey)
  );
  const pool = candidates.length ? candidates : fallback;
  return pool
    .sort(
      (a, b) =>
        DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty] ||
        a.topic.localeCompare(b.topic)
    )
    .slice(0, limit);
}

export function getHardestProblems(data, limit = 10, roadmap = DSA.roadmap) {
  const problems = getAllProblems(roadmap);
  const sortScore = (prob) => {
    let score = DIFFICULTY_ORDER[prob.difficulty] * 100;
    if (isProblemReview(data, prob.progressKey)) score += 50;
    if (!isProblemSolved(data, prob.progressKey)) score += 25;
    return score;
  };
  return [...problems].sort((a, b) => sortScore(b) - sortScore(a)).slice(0, limit);
}

export function getDayWeakProblems(data, dayNumber, limit, roadmap = DSA.roadmap) {
  const day = roadmap.find((d) => d.day === dayNumber);
  if (!day) return [];
  if (day.type === "mixed") {
    const weak = getWeakTopics(data, 3, roadmap);
    const recommended = getRecommendedProblems(data, weak, limit, roadmap);
    const fallback = day.problems || [];
    return recommended.length ? recommended.slice(0, limit) : fallback.slice(0, limit);
  }
  return getDayProblems(day).slice(0, limit);
}

export function getSimulationAccuracy(data) {
  const sims = data.simulations || [];
  if (sims.length === 0) return null;
  const total = sims.reduce((sum, sim) => sum + sim.total, 0);
  const correct = sims.reduce((sum, sim) => sum + sim.score, 0);
  return total ? Math.round((correct / total) * 1000) / 10 : 0;
}

export function computeTopicPie(data, roadmap = DSA.roadmap) {
  const progress = calculateProgress(data, DSA);
  return progress.topicStats;
}
