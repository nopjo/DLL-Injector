import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Check, Search, X, RefreshCw, Skull } from "lucide-react";

interface ProcessInfo {
  pid: number;
  name: string;
  exe_path: string;
}

interface ProcessSelectorProps {
  onSelect: (processName: string) => void;
  onClose: () => void;
  currentTarget: string;
}

const ProcessSelector = ({
  onSelect,
  onClose,
  currentTarget,
}: ProcessSelectorProps) => {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProcess, setSelectedProcess] = useState<string>(currentTarget);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async (): Promise<void> => {
    setLoading(true);
    try {
      const processList = await invoke<ProcessInfo[]>("list_processes");
      setProcesses(processList);
    } catch (error) {
      console.error("Failed to fetch processes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (): void => {
    if (selectedProcess) {
      onSelect(selectedProcess);
    }
  };

  const handleKillProcess = async (pid: number): Promise<void> => {
    try {
      await invoke("kill_process", { pid });

      setTimeout(() => {
        fetchProcesses();
      }, 500);
    } catch (error) {
      console.error("Failed to kill process:", error);
    }
  };

  const filteredProcesses = processes.filter((process) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = process.name.toLowerCase().includes(query);
    const pidMatch = process.pid.toString().includes(query);
    return nameMatch || pidMatch;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-md w-full max-w-md h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-medium text-white">
            Select Target Process
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-3 border-b border-slate-700 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by process name or PID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="animate-spin text-blue-400" size={24} />
            </div>
          ) : filteredProcesses.length === 0 ? (
            <div className="text-center text-slate-400 p-4">
              No processes match your search
            </div>
          ) : (
            <ul className="divide-y divide-slate-700">
              {filteredProcesses.map((process) => (
                <li
                  key={process.pid}
                  className={`flex items-center p-3 cursor-pointer hover:bg-slate-700 transition-colors ${
                    selectedProcess === process.name ? "bg-slate-700" : ""
                  }`}
                  onClick={() => setSelectedProcess(process.name)}
                >
                  <div className="flex-1 overflow-hidden">
                    <div className="text-sm font-medium text-white truncate">
                      {process.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      PID: {process.pid}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKillProcess(process.pid);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Kill Process"
                    >
                      <Skull size={16} />
                    </button>
                    {selectedProcess === process.name && (
                      <Check className="text-blue-400" size={18} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-3 border-t border-slate-700 flex justify-between shrink-0">
          <button
            onClick={fetchProcesses}
            className="flex items-center space-x-1 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-md bg-slate-700 text-sm hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedProcess}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedProcess
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessSelector;
