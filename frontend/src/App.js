import { useEffect } from "react";
import "@/App.css";

function App() {
  useEffect(() => {
    // Redirect to the standalone HackerWare game (self-contained HTML)
    window.location.replace("/hackerware.html");
  }, []);

  return (
    <div style={{
      width: "100vw", height: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0d0221", color: "#00f0ff",
      fontFamily: "monospace", fontSize: "18px"
    }}>
      Loading HackerWare...
    </div>
  );
}

export default App;
