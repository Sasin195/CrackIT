import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlay,
  FiFlag,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTarget,
  FiRefreshCw,
  FiExternalLink,
  FiAlertTriangle
} from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";
import { getAllProblems } from "../data/roadmap.js";
import { getStudiedTopics, getWeakTopics } from "../utils/progress.js";
import { formatTime, shuffle, pickRandom } from "../utils/helpers.js";
import PageHeader from "../components/PageHeader.jsx";
import Card from "../components/Card.jsx";
import DifficultyBadge from "../components/DifficultyBadge.jsx";
import SimulationCard from "../components/SimulationCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const leetcodeUrl = (slug) => `https://leetcode.com/problems/${slug}/`;

function generateQuestions(data) {
  const all = getAllProblems();
  const studied = new Set(getStudiedTopics(data));
  const filterPool = (difficulty) => {
    const studiedPool = all.filter((p) => p.difficulty === difficulty && studied.has(p.topic));
    return studiedPool.length ? studiedPool : all.filter((p) => p.difficulty === difficulty);
  };
  const easy = pickRandom(filterPool("Easy"));
  const mediumPool = filterPool("Medium");
  const med1 = pickRandom(mediumPool.filter((p) => p.progressKey !== easy?.progressKey));
  const med2 = pickRandom(mediumPool.filter((p) => p.progressKey !== easy?.progressKey && p.progressKey !== med1?.progressKey));
  const questions = shuffle([easy, med1, med2].filter(Boolean));
  return questions.map((problem, index) => ({
    ...problem,
    questionIndex: index,
    status: "pending"
  }));
}

export default function PlacementPage() {
  const { data, recordSimulation } = useApp();
  const [phase, setPhase] = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState(null);

  const weakTopics = useMemo(() => getWeakTopics(data, 3).map((w) => w.topic), [data]);

  useEffect(() => {
    if (phase !== "running") return undefined;
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const startSimulation = () => {
    setQuestions(generateQuestions(data));
    setElapsed(0);
    setResult(null);
    setPhase("running");
  };

  const setQuestionStatus = (questionIndex, status) => {
    setQuestions((current) =>
      current.map((q) => (q.questionIndex === questionIndex ? { ...q, status } : q))
    );
  };

  const finishSimulation = () => {
    const total = questions.length;
    const score = questions.filter((q) => q.status === "solved").length;
    const accuracy = total ? Math.round((score / total) * 1000) / 10 : 0;
    const failedTopics = [
      ...new Set(questions.filter((q) => q.status === "failed").map((q) => q.topic))
    ];
    const resultWeak = [...new Set([...failedTopics, ...weakTopics])].slice(0, 3);
    const next = {
      score,
      total,
      accuracy,
      timeTaken: formatTime(elapsed),
      weakTopics: resultWeak,
      problems: questions.map((q) => ({
        number: q.number,
        title: q.title,
        difficulty: q.difficulty,
        slug: q.slug,
        solved: q.status === "solved"
      }))
    };
    recordSimulation(next);
    setResult(next);
    setPhase("result");
  };

  const allAnswered = questions.length > 0 && questions.every((q) => q.status !== "pending");

  return (
    <>
      <PageHeader title="Placement Simulation" subtitle="1 Easy + 2 Medium under real time pressure. Questions favour topics you've already studied." />

      {phase === "intro" && (
        <Card className="placement-intro">
          <div className="placement-intro-grid">
            <div className="placement-intro-item">
              <span className="placement-intro-icon"><FiTarget /></span>
              <strong>3 Questions</strong>
              <small>1 Easy · 2 Medium</small>
            </div>
            <div className="placement-intro-item">
              <span className="placement-intro-icon"><FiClock /></span>
              <strong>Timed</strong>
              <small>Track your pacing</small>
            </div>
            <div className="placement-intro-item">
              <span className="placement-intro-icon"><FiCheckCircle /></span>
              <strong>Scored</strong>
              <small>Accuracy + weak topics</small>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={startSimulation}>
            <FiPlay />
            Start Placement Simulation
          </button>
        </Card>
      )}

      {phase === "running" && (
        <>
          <Card className="placement-timer-card">
            <div className="placement-timer">
              <FiClock />
              <strong>{formatTime(elapsed)}</strong>
            </div>
            <span className="chip chip-primary">
              {questions.filter((q) => q.status === "solved").length} solved ·{" "}
              {questions.filter((q) => q.status === "failed").length} failed
            </span>
            <button className="btn btn-danger" onClick={finishSimulation}>
              <FiFlag />
              End Simulation
            </button>
          </Card>

          <div className="problem-list">
            {questions.map((question) => (
              <div key={question.questionIndex} className={`problem-card ${question.status === "solved" ? "solved" : ""}`}>
                <div className="problem-head">
                  <span className="problem-number">Q{question.questionIndex + 1}</span>
                  <div className="problem-title">
                    <h4>{question.number} — {question.title}</h4>
                    <div className="problem-meta">
                      <DifficultyBadge difficulty={question.difficulty} />
                      <span className="topic-chip">{question.topic}</span>
                    </div>
                  </div>
                </div>
                <div className="problem-actions">
                  <a href={leetcodeUrl(question.slug)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                    <FiExternalLink />
                    Open LeetCode
                  </a>
                  <button
                    className={`btn btn-sm ${question.status === "solved" ? "btn-outline" : "btn-primary"}`}
                    onClick={() => setQuestionStatus(question.questionIndex, question.status === "solved" ? "pending" : "solved")}
                  >
                    <FiCheckCircle />
                    Mark Solved
                  </button>
                  <button
                    className={`btn btn-sm ${question.status === "failed" ? "btn-outline btn-outline-danger" : "btn-soft-danger"}`}
                    onClick={() => setQuestionStatus(question.questionIndex, question.status === "failed" ? "pending" : "failed")}
                  >
                    <FiXCircle />
                    Mark Failed
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-block" onClick={finishSimulation} disabled={!allAnswered}>
            {allAnswered ? "Finish and View Results" : "Answer all questions (or end early)"}
          </button>
        </>
      )}

      {phase === "result" && result && (
        <Card className="placement-result">
          <div className="result-banner">
            <span className="result-emoji">{result.score === result.total ? "🏆" : result.accuracy >= 50 ? "👍" : "💪"}</span>
            <h2>Placement Result</h2>
          </div>
          <div className="result-grid">
            <div className="result-stat">
              <span>Score</span>
              <strong>{result.score} / {result.total}</strong>
            </div>
            <div className="result-stat">
              <span>Accuracy</span>
              <strong>{result.accuracy}%</strong>
            </div>
            <div className="result-stat">
              <span>Time Taken</span>
              <strong>{result.timeTaken}</strong>
            </div>
          </div>
          {result.weakTopics.length > 0 && (
            <div className="result-weak">
              <FiAlertTriangle />
              <span>Weak Topics: {result.weakTopics.join(", ")}</span>
            </div>
          )}
          <div className="result-actions">
            <button className="btn btn-primary" onClick={startSimulation}>
              <FiRefreshCw />
              Try Again
            </button>
            <Link to="/progress" className="btn btn-ghost">
              View Progress
            </Link>
          </div>
        </Card>
      )}

      <h2 className="section-title">Simulation History</h2>
      {data.simulations.length === 0 ? (
        <EmptyState
          icon={FiFlag}
          title="No simulations yet"
          text="Complete a placement simulation to see your history here."
        />
      ) : (
        <div className="simulation-list">
          {data.simulations.map((simulation) => (
            <SimulationCard key={simulation.id} simulation={simulation} />
          ))}
        </div>
      )}
    </>
  );
}
