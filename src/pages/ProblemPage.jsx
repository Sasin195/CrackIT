import { Link, useParams } from "react-router-dom";
import { FiChevronLeft, FiBook } from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";
import { findProblem, getCourse } from "../data/roadmap.js";
import { isProblemSolved, isProblemReview } from "../utils/progress.js";
import ProblemCard from "../components/ProblemCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function ProblemPage() {
  const { problemId } = useParams();
  const { data, setProblemSolved, setProblemReview, saveNote } = useApp();
  const course = getCourse(data.settings.course);
  const problem = findProblem(problemId, course.roadmap);

  const day = course.roadmap.find((d) => d.problems?.some((prob) => prob.progressKey === problemId));

  if (!problem) {
    return (
      <EmptyState
        icon={FiBook}
        title="Problem not found"
        text="This problem doesn't exist in the roadmap."
        action={
          <Link to="/roadmap" className="btn btn-primary">
            Back to Roadmap
          </Link>
        }
      />
    );
  }

  const solved = isProblemSolved(data, problemId);
  const review = isProblemReview(data, problemId);

  return (
    <>
      <div className="back-link">
        <Link to={day ? `/day/${day.day}` : "/roadmap"}>
          <FiChevronLeft />
          Back to {day ? `Day ${day.day}` : "Roadmap"}
        </Link>
      </div>
      <PageHeader
        title={`#${problem.number} — ${problem.title}`}
        subtitle={`Day ${day?.day ?? "—"} · ${problem.topic}`}
      />
      <ProblemCard
        problem={problem}
        solved={solved}
        review={review}
        note={data.notes[problemId]}
        onToggleSolved={() => setProblemSolved(problemId, !solved)}
        onToggleReview={() => setProblemReview(problemId, !review)}
        onClearNote={() => saveNote(problemId, "")}
        onNoteChange={(text) => saveNote(problemId, text)}
      />
    </>
  );
}
