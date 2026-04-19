import AppIntents
import Foundation
import AppKit
import CoreSpotlight
import OSLog

@available(macOS 13.0, *)
public struct AskModIntent: AppIntent {
    public static var title: LocalizedStringResource = "Ask MOD"
    public static var description = IntentDescription("Ask a question to MOD.")
    public static var openAppWhenRun: Bool = false
    public static var isDiscoverable: Bool = true

    @Parameter(title: "Message", description: "The message to send to MOD")
    public var message: String?

    // This makes it look like ChatGPT in the Shortcut editor: "Ask MOD with [Message]"
    // The [Message] part becomes a blue variable pill.
    public static var parameterSummary: some ParameterSummary {
        Summary("Ask MOD with \(\.$message)")
    }

    public init() {}

    @MainActor
    public func perform() async throws -> some IntentResult & ProvidesDialog {
        let logger = Logger(subsystem: "tools.mod.desktop", category: "AppIntents")
        let q = message ?? ""
        logger.info("Performing AskModIntent with message: \(q)")

        let encodedQuestion = q.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let urlString = "mod://ask?q=\(encodedQuestion)&source=shortcut"

        if let url = URL(string: urlString) {
            let config = NSWorkspace.OpenConfiguration()
            config.activates = false
            config.addsToRecentItems = false

            logger.info("Opening deep link in background: \(url.absoluteString)")

            do {
                try await NSWorkspace.shared.open(url, configuration: config)
            } catch {
                logger.error("Failed to open deep link: \(error.localizedDescription)")
            }
        }

        if q.isEmpty {
            return .result(dialog: "Opening MOD...")
        } else {
            return .result(dialog: "Asking MOD: \(q)")
        }
    }
}

@available(macOS 13.0, *)
public struct ModShortcuts: AppShortcutsProvider {
    public static var shortcutTileColor: ShortcutTileColor = .orange

    public static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: AskModIntent(),
            phrases: [
                "Ask \(.applicationName) \(\.$message)",
                "Ask \(.applicationName)",
                "Query \(.applicationName) \(\.$message)"
            ],
            shortTitle: "Ask MOD",
            systemImageName: "sparkles"
        )
    }
}

@_cdecl("init_macos_intents")
public func init_macos_intents() {
    let logger = Logger(subsystem: "tools.mod.desktop", category: "Initialization")
    logger.info("Initializing macOS intents and Spotlight index")

    if #available(macOS 13.0, *) {
        // 1. Force Shortcut Parameter Update
        // This helps the system discover the AppShortcutsProvider
        ModShortcuts.updateAppShortcutParameters()
        logger.info("Updated app shortcut parameters")

        // 2. Register a User Activity with Prediction eligibility
        // This helps the activity show up as a suggested action in Spotlight
        let activity = NSUserActivity(activityType: "tools.mod.desktop.ask")
        activity.title = "Ask MOD"
        activity.isEligibleForSearch = true
        activity.persistentIdentifier = "ask-mod"

        // Link to the intent if possible
        // activity.intent = AskModIntent() // Requires more setup

        activity.becomeCurrent()
        logger.info("Registered user activity")

        // 3. Index a Searchable Item with more attributes
        let attributeSet = CSSearchableItemAttributeSet(itemContentType: "com.apple.application")
        attributeSet.title = "Ask MOD"
        attributeSet.displayName = "MOD"
        attributeSet.alternateNames = ["Ask MOD", "MOD AI", "Chat MOD"]
        attributeSet.contentDescription = "Ask a question to MOD AI"
        attributeSet.keywords = ["Ask", "MOD", "AI", "Chat", "Question", "Prompt"]
        attributeSet.rankingHint = 100 // High priority
        attributeSet.containerIdentifier = "tools.mod.desktop.dev"

        // Use a sparkles icon if possible, or just the app icon
        if let image = NSApp.applicationIconImage {
            attributeSet.thumbnailData = image.tiffRepresentation
        }

        let item = CSSearchableItem(uniqueIdentifier: "ask-mod", domainIdentifier: "tools.mod", attributeSet: attributeSet)
        CSSearchableIndex.default().indexSearchableItems([item]) { error in
            if let error = error {
                logger.error("Error indexing Spotlight item: \(error.localizedDescription)")
            } else {
                logger.info("Successfully indexed Spotlight item")
            }
        }
    }
}
