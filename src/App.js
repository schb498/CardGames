import GameSelector from "./components/GameSelector";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GoFish from "./components/GoFish";

function App() {
  return (
    <Router>
      <div className="container">
        <header className="App-header"></header>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Welcome to the Card Game website!</h1>
                <GameSelector />
              </>
            }
          />
          <Route path="/goFishGame" element={<GoFish />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
