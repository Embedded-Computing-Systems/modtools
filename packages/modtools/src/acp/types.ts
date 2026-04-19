import type { McpServer } from "@agentclientprotocol/sdk"
import type { ModClient } from "@modtools-ai/sdk/v2"
import type { ProviderID, ModelID } from "../provider/schema"

export interface ACPSessionState {
  id: string
  cwd: string
  mcpServers: McpServer[]
  createdAt: Date
  model?: {
    providerID: ProviderID
    modelID: ModelID
  }
  variant?: string
  modeId?: string
}

export interface ACPConfig {
  sdk: ModClient
  defaultModel?: {
    providerID: ProviderID
    modelID: ModelID
  }
}
