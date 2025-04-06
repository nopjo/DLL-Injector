use std::path::PathBuf;
use std::sync::Mutex;

pub struct InjectionState {
    pub target_process_name: String,
}

impl Default for InjectionState {
    fn default() -> Self {
        Self {
            target_process_name: "ac_client.exe".to_string(),
        }
    }
}

pub struct AppState {
    pub injection_state: Mutex<InjectionState>,
    pub data_dir: PathBuf,
}