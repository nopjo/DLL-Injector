use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct SavedDll {
    pub path: String,
}

#[derive(Serialize)]
pub struct ProcessInfo {
    pub pid: u32,
    pub name: String,
}