use sysinfo::{System, SystemExt, PidExt, ProcessExt};
use dll_injector::{inject_dll_load_library, inject_dll_manual_map};

pub fn find_process_id(process_name: &str) -> Option<u32> {
    let mut system = System::new();
    system.refresh_processes();

    for (pid, process) in system.processes() {
        if process.name().to_lowercase() == process_name.to_lowercase() {
            return Some(pid.as_u32());
        }
    }
    None
}

pub fn inject_using_library(process_id: u32, dll_path: &str) -> Result<(), String> {
    match inject_dll_load_library(process_id, dll_path) {
        Ok(_) => Ok(()),
        Err(_) => {
            match inject_dll_manual_map(process_id, dll_path) {
                Ok(_) => Ok(()),
                Err(e2) => Err(format!("All injection methods failed. Last error: {}", e2)),
            }
        }
    }
}