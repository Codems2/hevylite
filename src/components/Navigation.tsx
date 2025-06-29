import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 w-full flex justify-around bg-white shadow-md py-2 border-t">
      <Link to="/today" className="text-blue-600 font-medium">🏋️ Hoy</Link>
      <Link to="/routines" className="text-gray-600">📋 Rutinas</Link>
      <Link to="/history" className="text-gray-600">📊 Historial</Link>
    </nav>
  );
}
