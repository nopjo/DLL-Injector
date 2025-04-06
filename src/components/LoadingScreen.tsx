import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 75);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900">
      <div className="mb-10 animate-spin">
        <LoaderCircle size={64} className="text-blue-400" />
      </div>
      <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 text-slate-400 font-mono text-sm">
        Initializing... {progress}%
      </div>
    </div>
  );
};

export default LoadingScreen;
