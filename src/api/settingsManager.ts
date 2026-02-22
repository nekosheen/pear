// SettingsManager uses localStorage for persistence in the renderer process.
// electron-store runs in the main process and requires IPC — localStorage
// is the correct approach here since all settings operations happen in the renderer.

export class SettingsManager {
  private static instance: SettingsManager | null = null

  private readonly API_KEY_KEY = 'pear_mistral_api_key'
  private readonly MODEL_KEY = 'pear_mistral_model'
  private readonly DEFAULT_MODEL = 'mistral-large-latest'

  private constructor() {}

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager()
    }
    return SettingsManager.instance
  }

  public getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_KEY)
  }

  public async setApiKey(apiKey: string): Promise<void> {
    if (apiKey.length < 20) {
      throw new Error('API key must be at least 20 characters long')
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(apiKey)) {
      throw new Error('API key contains invalid characters')
    }
    localStorage.setItem(this.API_KEY_KEY, apiKey)
  }

  public getModel(): string {
    return localStorage.getItem(this.MODEL_KEY) || this.DEFAULT_MODEL
  }

  public async setModel(model: string): Promise<void> {
    if (!model || typeof model !== 'string') {
      throw new Error('Model must be a non-empty string')
    }
    localStorage.setItem(this.MODEL_KEY, model)
  }

  public async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.mistral.ai/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })
      return response.ok
    } catch (error) {
      console.error('Error testing API key:', error)
      return false
    }
  }

  public async getAvailableModels(apiKey: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.mistral.ai/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json() as { data: Array<{ id: string }> }
      return data.data.map(m => m.id)
    } catch (error) {
      console.error('Error fetching models:', error)
      // Return sensible defaults if API call fails
      return ['mistral-tiny', 'mistral-small', 'mistral-medium', 'mistral-large-latest']
    }
  }

  public clearSettings(): void {
    localStorage.removeItem(this.API_KEY_KEY)
    localStorage.removeItem(this.MODEL_KEY)
  }
}
