import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

interface GameStatusProps {
  targetGame: string;
}

const GameStatus = ({ targetGame }: GameStatusProps) => {
  const [isGameRunning, setIsGameRunning] = useState(false);

  useEffect(() => {
    checkGameStatus();

    const interval = setInterval(() => {
      checkGameStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [targetGame]);

  const checkGameStatus = async () => {
    try {
      const result = await invoke<boolean>("check_game_running");
      setIsGameRunning(result);
    } catch (error) {
      console.error("Failed to check game status:", error);
      setIsGameRunning(false);
    }
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-slate-400">App Status:</div>
        </div>
        <div className="flex items-center space-x-2">
          {isGameRunning ? (
            <>
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="text-green-400 text-sm font-medium">
                RUNNING
              </span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-slate-400"></div>
              <span className="text-slate-400 text-sm font-medium">
                NOT DETECTED
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
