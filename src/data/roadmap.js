import raw from "@appdata/dsa-app-data.json";

const withKeys = (day, problems) =>
  (problems || []).map((problem, index) => ({
    ...problem,
    progressKey: `day${day}-problem${index + 1}`
  }));

export const TOPICS = raw.topics;
export const TOPIC_COLORS = raw.topicColors;
export const DIFFICULTY_COLORS = raw.difficultyColors;
export const DIFFICULTY_ORDER = raw.difficultyOrder;

export const ROADMAP = raw.roadmap.map((day) => ({
  ...day,
  problems: withKeys(day.day, day.problems)
}));

export const TOTAL_DAYS = ROADMAP.length;

export function getDayProblems(day) {
  return (day.problems || []).map((problem) => ({ ...problem }));
}

export function getAllProblems(roadmap = ROADMAP) {
  return roadmap.flatMap((day) => getDayProblems(day));
}

export function findProblem(progressKey) {
  return getAllProblems().find((prob) => prob.progressKey === progressKey) || null;
}
