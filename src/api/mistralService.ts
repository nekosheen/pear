interface MistralConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface MistralResponse {
  id: string;
  choices: Array<{
    message: ChatMessage;
  }>;
}

export class MistralService {
  private config: MistralConfig;

  constructor(apiKey: string, model: string = 'mistral-tiny') {
    if (!apiKey || apiKey.length < 20) {
      throw new Error('Invalid API key');
    }
    
    this.config = {
      apiKey,
      baseUrl: 'https://api.mistral.ai/v1',
      model
    };
  }

  public updateSettings(apiKey: string, model: string): void {
    if (!apiKey || apiKey.length < 20) {
      throw new Error('Invalid API key');
    }
    
    this.config.apiKey = apiKey;
    this.config.model = model;
  }

  public getCurrentModel(): string {
    return this.config.model;
  }

  async chat(messages: ChatMessage[]): Promise<MistralResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling Mistral API:', error);
      throw error;
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.map((model: any) => model.id);
    } catch (error) {
      console.error('Error fetching Mistral models:', error);
      throw error;
    }
  }
}