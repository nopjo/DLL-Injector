import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Download, Syringe } from "lucide-react";
import ProcessSelector, { ProcessInfo } from "./ProcessSelector";
import Notification from "../Notification";
import TargetProcess from "./TargetProcess";
import GameStatus from "./GameStatus";
import DllSelector from "./DllSelector";
import DllHistory from "./DllHistory";

const MainPanel = () => {
  const [targetGame, setTargetGame] = useState("ac_client.exe");
  const [selectedDll, setSelectedDll] = useState<string | null>(null);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [showProcessSelector, setShowProcessSelector] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isInjecting, setIsInjecting] = useState(false);
  const [savedDlls, setSavedDlls] = useState<string[]>([]);

  useEffect(() => {
    fetchTargetGame();
    checkGameStatus();
    loadSavedDlls();

    const interval = setInterval(() => {
      checkGameStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchTargetGame = async () => {
    try {
      const result = await invoke<string>("get_target_game");
      setTargetGame(result);
    } catch (error) {
      console.error("Failed to get target game:", error);
    }
  };

  const loadSavedDlls = async () => {
    try {
      const dlls = await invoke<string[]>("load_dll_list");
      setSavedDlls(dlls);
    } catch (error) {
      console.error("Failed to load saved DLLs:", error);
      setSavedDlls([]);
    }
  };

  const handleDllSelect = (dllPath: string) => {
    setSelectedDll(dllPath);
  };

  const handleProcessSelect = async (process: ProcessInfo) => {
    try {
      await invoke("set_target_game", {
        processName: process.name,
        processId: process.pid,
      });
      setTargetGame(process.name);
      setShowProcessSelector(false);
      checkGameStatus();
    } catch (error) {
      console.error("Failed to set target game:", error);
    }
  };

  const checkGameStatus = async () => {
    try {
      const result = await invoke<boolean>("check_game_running");
      setIsGameRunning(result);
    } catch (error) {
      console.error("Failed to check game status:", error);
      setIsGameRunning(false);
    }
  };

  const injectDll = async () => {
    if (!selectedDll || !isGameRunning) return;

    setIsInjecting(true);
    try {
      await invoke("inject_dll", { path: selectedDll });
      setNotification({ message: "Injection successful", type: "success" });

      if (!savedDlls.includes(selectedDll)) {
        const newDlls = [...savedDlls, selectedDll];
        await invoke("save_dll_list", { dlls: newDlls });
        setSavedDlls(newDlls);
      }
    } catch (error) {
      console.error("Failed to inject DLL:", error);
      setNotification({ message: "Injection failed", type: "error" });
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="w-full h-[500px] overflow-y-auto bg-slate-900 text-slate-200">
      {showProcessSelector && (
        <ProcessSelector
          onSelect={handleProcessSelect}
          onClose={() => setShowProcessSelector(false)}
          currentTarget={targetGame}
        />
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="w-full max-w-md mx-auto bg-slate-800 border border-slate-700">
        <TargetProcess
          targetGame={targetGame}
          onProcessSelectorOpen={() => setShowProcessSelector(true)}
        />
        <GameStatus targetGame={targetGame} />
        <DllSelector
          selectedDll={selectedDll}
          onDllSelected={handleDllSelect}
        />
        <DllHistory
          onDllSelected={handleDllSelect}
          savedDlls={savedDlls}
          setSavedDlls={setSavedDlls}
        />

        <div className="p-4">
          <button
            onClick={injectDll}
            disabled={!isGameRunning || !selectedDll || isInjecting}
            className={`w-full py-3 rounded-md flex items-center justify-center space-x-2 transition-all ${
              !isGameRunning || !selectedDll || isInjecting
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-400 text-white"
            }`}
          >
            {isInjecting ? (
              <>
                <Download size={18} className="animate-bounce" />
                <span>INJECTING...</span>
              </>
            ) : (
              <>
                <Syringe size={18} />
                <span>INJECT</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPanel;
