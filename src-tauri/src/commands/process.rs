use crate::models::ProcessInfo;
use sysinfo::{System, SystemExt, PidExt, ProcessExt};

#[tauri::command]
pub fn list_processes() -> Vec<ProcessInfo> {
    let mut system = System::new_all();
    system.refresh_all();

    let mut processes = Vec::new();

    for (pid, process) in system.processes() {
        let pid_u32 = pid.as_u32();

        processes.push(ProcessInfo {
            pid: pid_u32,
            name: process.name().to_string(),
        });
    }

    processes.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    processes
}

#[tauri::command]
pub async fn kill_process(pid: u32) -> Result<(), String> {
    let mut system = System::new();
    system.refresh_processes();
    
    match system.process(sysinfo::Pid::from_u32(pid)) {
        Some(process) => {
            if process.kill() {
                Ok(())
            } else {
                Err(format!("Failed to kill process with PID {}", pid))
            }
        },
        None => Err(format!("Process with PID {} not found", pid)),
    }
}