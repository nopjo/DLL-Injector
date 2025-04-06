use std::path::Path;
use tauri::State;
use crate::state::AppState;
use crate::utils::{find_process_id, inject_using_library};

#[tauri::command]
pub fn check_game_running(state: State<'_, AppState>) -> bool {
    let state = state.injection_state.lock().unwrap();
    find_process_id(&state.target_process_name).is_some()
}

#[tauri::command]
pub fn inject_dll(path: String, state: State<'_, AppState>) -> Result<String, String> {
    let state_guard = state.injection_state.lock().unwrap();

    if !Path::new(&path).exists() {
        return Err("DLL file not found".into());
    }

    let absolute_path = match std::fs::canonicalize(&path) {
        Ok(p) => p.to_string_lossy().to_string(),
        Err(e) => return Err(format!("Failed to get absolute path: {}", e)),
    };

    let target_process_name = state_guard.target_process_name.clone();
    
    let process_id = match state_guard.target_process_id {
        Some(pid) => pid,
        None => match find_process_id(&target_process_name) {
            Some(pid) => pid,
            None => return Err(format!("Process '{}' not found", target_process_name)),
        }
    };

    match inject_using_library(process_id, &absolute_path) {
        Ok(_) => Ok("DLL successfully injected".into()),
        Err(e) => Err(format!("Failed to inject DLL: {}", e)),
    }
}