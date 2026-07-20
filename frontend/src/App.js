import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Experience from "@/components/experience/Experience";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Experience />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
