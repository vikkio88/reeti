use std::{env, path::Path};
use tauri_plugin_fs::FsExt;

use tauri::State;

struct AppState {}

#[tauri::command]
async fn open(filename: String, _state: State<'_, AppState>) -> Result<String, ()> {
    let p = Path::new(&filename);
    println!("{}", p.display());
    if p.exists() {
        Ok(filename)
    } else {
        Err(())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let scope = app.fs_scope();
            if let Ok(()) = scope.allow_directory(env::home_dir().unwrap(), true) {
                ()
            }

            Ok(())
        })
        .manage(AppState {})
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
