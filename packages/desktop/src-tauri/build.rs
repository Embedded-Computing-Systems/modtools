use std::env;
use std::process::Command;

fn main() {
    let target_os = env::var("CARGO_CFG_TARGET_OS").unwrap();
    if target_os == "macos" {
        let out_dir = env::var("OUT_DIR").unwrap();
        let arch = env::var("CARGO_CFG_TARGET_ARCH").unwrap();
        let target = match arch.as_str() {
            "x86_64" => "x86_64-apple-macosx13.0",
            "aarch64" => "arm64-apple-macosx13.0",
            _ => "arm64-apple-macosx13.0",
        };

        let sdk_path = Command::new("xcrun")
            .args(&["--show-sdk-path"])
            .output()
            .expect("failed to get sdk path")
            .stdout;
        let sdk_path = String::from_utf8_lossy(&sdk_path).trim().to_string();

        let swift_file = "src/macos.swift";
        let obj_file = format!("{}/macos.o", out_dir);
        let lib_file = format!("{}/libmacos_intents.a", out_dir);

        println!("cargo:warning=Compiling Swift code...");
        let status = Command::new("swiftc")
            .args(&[
                "-c",
                swift_file,
                "-o",
                &obj_file,
                "-target",
                target,
                "-sdk",
                &sdk_path,
                "-module-name",
                "MOD",
                "-parse-as-library",
                "-emit-const-values",
                "-Xfrontend",
                "-const-gather-protocols-file",
                "-Xfrontend",
                "AppIntentsProtocols.json",
            ])
            .status()
            .expect("failed to run swiftc");

        if !status.success() {
            panic!("Swift compilation failed");
        }
        println!("cargo:warning=Swift code compiled to {}", obj_file);

        let status = Command::new("ar")
            .args(&["crus", &lib_file, &obj_file])
            .status()
            .expect("failed to run ar");

        if !status.success() {
            panic!("Static library creation failed");
        }
        println!("cargo:warning=Static library created at {}", lib_file);

        println!("cargo:rustc-link-search=native={}", out_dir);
        println!("cargo:rustc-link-lib=static=macos_intents");
        println!(
            "cargo:rustc-link-arg=-Wl,-force_load,{}/libmacos_intents.a",
            out_dir
        );
        println!("cargo:rustc-link-lib=framework=AppIntents");
        println!("cargo:rustc-link-lib=framework=CoreSpotlight");
        println!("cargo:rustc-link-lib=framework=Foundation");
        println!("cargo:rustc-link-lib=framework=AppKit");

        // Fix Swift Concurrency RPATH and linking
        println!("cargo:rustc-link-search=native=/usr/lib/swift");
        println!("cargo:rustc-link-arg=-Wl,-rpath,/usr/lib/swift");
        println!("cargo:rustc-link-arg=-Wl,-rpath,@executable_path/../Frameworks");

        // Add SDK-specific Swift library path
        let swift_lib_path = format!("{}/usr/lib/swift", sdk_path);
        println!("cargo:rustc-link-search=native={}", swift_lib_path);

        println!("cargo:rerun-if-changed={}", swift_file);

        // --- App Intents Metadata Generation using Xcode Tool ---
        let manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
        let resources_dir = format!("{}/Metadata.appintents", manifest_dir);
        let _ = std::fs::create_dir_all(&resources_dir);

        let processor = "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/appintentsmetadataprocessor";
        let toolchain_dir = "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain";

        let sources_list = format!("{}/sources.txt", out_dir);
        let consts_list = format!("{}/consts.txt", out_dir);

        std::fs::write(&sources_list, swift_file).expect("failed to write sources list");
        std::fs::write(&consts_list, format!("{}/macos.swiftconstvalues", out_dir)).expect("failed to write consts list");

        println!("cargo:warning=Running appintentsmetadataprocessor...");
        let status = Command::new(processor)
            .args(&[
                "--output", &manifest_dir,
                "--toolchain-dir", toolchain_dir,
                "--module-name", "MOD",
                "--sdk-root", &sdk_path,
                "--xcode-version", "15.0",
                "--platform-family", "macos",
                "--deployment-target", "13.0",
                "--target-triple", target,
                "--source-file-list", &sources_list,
                "--swift-const-vals-list", &consts_list,
            ])
            .status()
            .expect("failed to run appintentsmetadataprocessor");

        if !status.success() {
            println!("cargo:warning=appintentsmetadataprocessor failed, falling back to manual metadata");
            // Manual fallback if processor fails (e.g. version mismatch)
            let metadata_json = serde_json::json!({
                "version": "1.0",
                "intents": [
                    {
                        "identifier": "AskModIntent",
                        "title": "Ask MOD",
                        "description": "Ask a question to MOD.",
                        "parameters": [
                            {
                                "identifier": "message",
                                "type": "string",
                                "title": "Message",
                                "isInput": true
                            }
                        ]
                    }
                ],
                "shortcuts": [
                    {
                        "intent": "AskModIntent",
                        "phrases": [
                            "Ask MOD",
                            "Ask MOD ${message}"
                        ]
                    }
                ]
            });

            std::fs::write(
                format!("{}/extract.json", resources_dir),
                serde_json::to_string_pretty(&metadata_json).unwrap()
            ).expect("failed to write metadata");
        } else {
            println!("cargo:warning=AppIntents metadata generated successfully using Xcode tool");
        }
    }

    tauri_build::build()
}
