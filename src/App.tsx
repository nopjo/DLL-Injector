import { useState } from "react";
import TitleBar from "./components/TitleBar";
import MainPanel from "./components/main-panel";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  });

  return (
    <main className="bg-slate-900 text-slate-200 h-screen flex flex-col overflow-hidden">
      <TitleBar />
      {isLoading ? <LoadingScreen /> : <MainPanel />}
    </main>
  );
}

export default App;
