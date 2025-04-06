use std::path::PathBuf;
use std::sync::Mutex;

pub struct InjectionState {
    pub target_process_name: String,
    pub target_process_id: Option<u32>,
}

impl Default for InjectionState {
    fn default() -> Self {
        Self {
            target_process_name: "".to_string(),
            target_process_id: None,
        }
    }
}

pub struct AppState {
    pub injection_state: Mutex<InjectionState>,
    pub data_dir: PathBuf,
}