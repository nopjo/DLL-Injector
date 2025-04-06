mod state;
mod models;
mod commands;
mod utils;

use std::fs;
use tauri::Manager;
use state::{AppState, InjectionState};
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let data_dir = app.path().app_data_dir().expect("Failed to get app data directory");
            if !data_dir.exists() {
                fs::create_dir_all(&data_dir).expect("Failed to create app data directory");
            }
            
            app.manage(AppState {
                injection_state: Mutex::new(InjectionState::default()),
                data_dir,
            });
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::process::list_processes,
            commands::process::kill_process,
            
            commands::injection::check_game_running,
            commands::injection::inject_dll,
            
            commands::settings::set_target_game,
            commands::settings::get_target_game,
            commands::settings::save_dll_list,
            commands::settings::load_dll_list,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}