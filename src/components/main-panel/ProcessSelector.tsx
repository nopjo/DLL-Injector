import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Check,
  Search,
  X,
  RefreshCw,
  Skull,
  ChevronDown,
  ChevronRight,
  MinusSquare,
  PlusSquare,
} from "lucide-react";

export interface ProcessInfo {
  pid: number;
  name: string;
  exe_path?: string;
}

interface ProcessGroup {
  name: string;
  processes: ProcessInfo[];
  expanded: boolean;
}

interface ProcessSelectorProps {
  onSelect: (process: ProcessInfo) => void;
  onClose: () => void;
  currentTarget: string;
}

const ProcessSelector = ({
  onSelect,
  onClose,
  currentTarget,
}: ProcessSelectorProps) => {
  const [processGroups, setProcessGroups] = useState<ProcessGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProcess, setSelectedProcess] = useState<ProcessInfo | null>(
    null
  );

  useEffect(() => {
    fetchProcesses();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setProcessGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (
            group.processes.some((process) =>
              process.pid.toString().includes(searchQuery.toLowerCase())
            )
          ) {
            return { ...group, expanded: true };
          }
          return group;
        })
      );
    }
  }, [searchQuery]);

  const fetchProcesses = async (): Promise<void> => {
    setLoading(true);
    try {
      const processList = await invoke<ProcessInfo[]>("list_processes");

      const groupedProcesses = groupProcessesByName(processList);
      setProcessGroups(groupedProcesses);

      if (currentTarget) {
        const currentProcess = processList.find(
          (p) => p.name === currentTarget
        );
        if (currentProcess) {
          setSelectedProcess(currentProcess);
        }
      }
    } catch (error) {
      console.error("Failed to fetch processes:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupProcessesByName = (processList: ProcessInfo[]): ProcessGroup[] => {
    const groups: { [key: string]: ProcessInfo[] } = {};

    processList.forEach((process) => {
      if (!groups[process.name]) {
        groups[process.name] = [];
      }
      groups[process.name].push(process);
    });

    return Object.keys(groups)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map((name) => ({
        name,
        processes: groups[name],

        expanded:
          groups[name].length === 1 ||
          groups[name].some(
            (p) => selectedProcess && p.pid === selectedProcess.pid
          ) ||
          groups[name].some((p) => p.name === currentTarget),
      }));
  };

  const toggleGroupExpanded = (groupName: string) => {
    setProcessGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.name === groupName
          ? { ...group, expanded: !group.expanded }
          : group
      )
    );
  };

  const collapseAllGroups = () => {
    setProcessGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,

        expanded: group.processes.length === 1,
      }))
    );
  };

  const expandAllGroups = () => {
    setProcessGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        expanded: true,
      }))
    );
  };

  const handleSelect = (): void => {
    if (selectedProcess) {
      onSelect(selectedProcess);
    }
  };

  const handleKillProcess = async (pid: number): Promise<void> => {
    try {
      await invoke("kill_process", { pid });

      if (selectedProcess && selectedProcess.pid === pid) {
        setSelectedProcess(null);
      }

      setTimeout(() => {
        fetchProcesses();
      }, 500);
    } catch (error) {
      console.error("Failed to kill process:", error);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    if (!lowerText.includes(lowerQuery)) return <span>{text}</span>;

    const parts = [];
    let lastIndex = 0;
    let startIndex = lowerText.indexOf(lowerQuery);

    while (startIndex !== -1) {
      if (startIndex > lastIndex) {
        parts.push(text.substring(lastIndex, startIndex));
      }

      parts.push(
        <span key={startIndex} className="bg-yellow-600 text-white">
          {text.substring(startIndex, startIndex + query.length)}
        </span>
      );

      lastIndex = startIndex + query.length;
      startIndex = lowerText.indexOf(lowerQuery, lastIndex);
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return <>{parts}</>;
  };

  const filteredGroups = processGroups.filter((group) => {
    const query = searchQuery.toLowerCase();

    if (group.name.toLowerCase().includes(query)) {
      return true;
    }

    return group.processes.some((process) =>
      process.pid.toString().includes(query)
    );
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
          ) : filteredGroups.length === 0 ? (
            <div className="text-center text-slate-400 p-4">
              No processes match your search
            </div>
          ) : (
            <ul className="divide-y divide-slate-700">
              {filteredGroups.map((group) => (
                <li
                  key={group.name}
                  className="border-b border-slate-700 last:border-b-0"
                >
                  <div
                    className={`flex items-center p-3 cursor-pointer hover:bg-slate-700 transition-colors ${
                      group.processes.length === 1 &&
                      selectedProcess?.pid === group.processes[0].pid
                        ? "bg-slate-700"
                        : ""
                    }`}
                    onClick={() => {
                      if (group.processes.length > 1) {
                        toggleGroupExpanded(group.name);
                      } else {
                        setSelectedProcess(group.processes[0]);
                      }
                    }}
                  >
                    <div className="overflow-hidden flex-1">
                      <div className="text-sm font-medium text-white truncate flex items-center justify-between">
                        <div className="truncate pr-2">
                          {highlightMatch(group.name, searchQuery)}
                          {group.processes.length === 1 && (
                            <span className="ml-2 text-xs text-slate-400">
                              PID:{" "}
                              {highlightMatch(
                                group.processes[0].pid.toString(),
                                searchQuery
                              )}
                            </span>
                          )}
                        </div>

                        {group.processes.length > 1 && (
                          <div className="flex items-center">
                            <span className="mr-2 text-xs text-slate-400 bg-slate-700 px-1.5 py-0.5 rounded-full">
                              {group.processes.length}
                            </span>
                            <div className="text-slate-400">
                              {group.expanded ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {}
                    {group.processes.length === 1 && (
                      <div className="flex items-center space-x-2 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleKillProcess(group.processes[0].pid);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Kill Process"
                        >
                          <Skull size={16} />
                        </button>
                        <div
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProcess(group.processes[0]);
                          }}
                        >
                          {selectedProcess &&
                          selectedProcess.pid === group.processes[0].pid ? (
                            <Check className="text-blue-400" size={18} />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-600 hover:border-blue-400 transition-colors" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {}
                  {group.processes.length > 1 && group.expanded && (
                    <ul className="bg-slate-750 border-t border-slate-700">
                      {group.processes.map((process) => (
                        <li
                          key={process.pid}
                          className={`flex items-center py-2 px-4 pl-8 cursor-pointer hover:bg-slate-700 transition-colors ${
                            selectedProcess &&
                            selectedProcess.pid === process.pid
                              ? "bg-slate-700"
                              : ""
                          }`}
                          onClick={() => setSelectedProcess(process)}
                        >
                          <div className="flex-1 overflow-hidden">
                            <div className="text-xs text-slate-300">
                              PID:{" "}
                              {highlightMatch(
                                process.pid.toString(),
                                searchQuery
                              )}
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
                              <Skull size={14} />
                            </button>
                            {selectedProcess &&
                            selectedProcess.pid === process.pid ? (
                              <Check className="text-blue-400" size={16} />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-600 hover:border-blue-400 transition-colors" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-3 border-t border-slate-700 flex justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchProcesses}
              className="flex items-center space-x-1 text-sm text-slate-400 hover:text-white transition-colors p-1"
              title="Refresh Process List"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={collapseAllGroups}
              className="flex items-center space-x-1 text-sm text-slate-400 hover:text-white transition-colors p-1"
              title="Collapse All Groups"
            >
              <MinusSquare size={14} />
              <span className="hidden sm:inline">Collapse All</span>
            </button>
            <button
              onClick={expandAllGroups}
              className="flex items-center space-x-1 text-sm text-slate-400 hover:text-white transition-colors p-1"
              title="Expand All Groups"
            >
              <PlusSquare size={14} />
              <span className="hidden sm:inline">Expand All</span>
            </button>
          </div>
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
