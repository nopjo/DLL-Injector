use std::fs;
use tauri::State;
use crate::state::AppState;
use crate::models::SavedDll;

#[tauri::command]
pub fn set_target_game(process_name: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut state = state.injection_state.lock().unwrap();
    state.target_process_name = process_name;
    Ok(())
}

#[tauri::command]
pub fn get_target_game(state: State<'_, AppState>) -> String {
    let state = state.injection_state.lock().unwrap();
    state.target_process_name.clone()
}

#[tauri::command]
pub fn save_dll_list(dlls: Vec<String>, state: State<'_, AppState>) -> Result<(), String> {
    let dll_file_path = state.data_dir.join("dll_list.json");

    let saved_dlls: Vec<SavedDll> = dlls.into_iter().map(|path| SavedDll { path }).collect();
    let json = serde_json::to_string(&saved_dlls).map_err(|e| format!("Failed to serialize DLL list: {}", e))?;
    fs::write(&dll_file_path, json).map_err(|e| format!("Failed to write DLL list: {}", e))?;
    Ok(())
}

#[tauri::command]
pub fn load_dll_list(state: State<'_, AppState>) -> Result<Vec<String>, String> {
    let dll_file_path = state.data_dir.join("dll_list.json");

    if !dll_file_path.exists() {
        return Ok(vec![]);
    }

    let json = fs::read_to_string(&dll_file_path).map_err(|e| format!("Failed to read DLL list: {}", e))?;
    let saved_dlls: Vec<SavedDll> = serde_json::from_str(&json).map_err(|e| format!("Failed to deserialize DLL list: {}", e))?;
    Ok(saved_dlls.into_iter().map(|dll| dll.path).collect())
}