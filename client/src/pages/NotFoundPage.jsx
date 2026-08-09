import { Link } from "react-router-dom";
import { FiCompass } from "react-icons/fi";
import EmptyState from "../components/EmptyState.jsx";

export default function NotFoundPage() {
  return (
    <EmptyState
      icon={FiCompass}
      title="Page not found"
      text="The page you're looking for doesn't exist."
      action={
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      }
    />
  );
}
