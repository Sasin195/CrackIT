import dsaRaw from "@appdata/dsa-app-data.json";
import reactRaw from "@appdata/react-app-data.json";

function buildCourse(raw) {
  const id = raw.courseId;
  const prefix = id === "dsa" ? "" : `${id}:`;

  const roadmap = raw.roadmap.map((day) => ({
    ...day,
    courseId: id,
    flexible: id === "react" || raw.flexible === true,
    dayKey: prefix === "" ? String(day.day) : `${prefix}day-${day.day}`,
    problems: (day.problems || []).map((problem, index) => ({
      ...problem,
      courseId: id,
      progressKey: `${prefix}day${day.day}-problem${index + 1}`
    }))
  }));

  return {
    id,
    title: raw.title || id,
    subtitle: raw.subtitle || "",
    unit: id === "react" ? "Tasks" : "Problems",
    flexible: id === "react" || raw.flexible === true,
    roadmap,
    totalDays: roadmap.length,
    topics: raw.topics || [],
    topicColors: raw.topicColors || {},
    difficultyColors: raw.difficultyColors || {},
    difficultyOrder: raw.difficultyOrder || {},
    hasTopics: Array.isArray(raw.topics) && raw.topics.length > 0
  };
}

export const COURSES = [buildCourse(dsaRaw), buildCourse(reactRaw)];
export const COURSE_MAP = Object.fromEntries(COURSES.map((course) => [course.id, course]));

export function getCourse(courseId) {
  return COURSE_MAP[courseId] || COURSES[0];
}

export const DSA = COURSE_MAP.dsa;
export const TOPICS = DSA.topics;
export const TOPIC_COLORS = DSA.topicColors;
export const DIFFICULTY_COLORS = DSA.difficultyColors;
export const DIFFICULTY_ORDER = DSA.difficultyOrder;
export const ROADMAP = DSA.roadmap;
export const TOTAL_DAYS = DSA.totalDays;

export function getDayProblems(day) {
  return (day.problems || []).map((problem) => ({ ...problem }));
}

export function getAllProblems(roadmap = ROADMAP) {
  return roadmap.flatMap((day) => getDayProblems(day));
}

export function findProblem(progressKey, roadmap = ROADMAP) {
  return getAllProblems(roadmap).find((prob) => prob.progressKey === progressKey) || null;
}
