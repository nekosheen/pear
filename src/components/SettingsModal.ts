export class SettingsModal {
  private modalElement: HTMLElement;
  private apiKeyInput: HTMLInputElement;
  private modelSelect: HTMLSelectElement;
  private testConnectionButton: HTMLButtonElement;
  private saveButton: HTMLButtonElement;
  private cancelButton: HTMLButtonElement;
  private statusMessage: HTMLElement;
  
  constructor() {
    // Create modal container
    this.modalElement = document.createElement('div');
    this.modalElement.id = 'settings-modal';
    this.modalElement.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
    this.modalElement.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
        <div class="bg-mistral text-white px-6 py-4">
          <h2 class="text-lg font-semibold">Settings</h2>
        </div>
        
        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mistral API Key</label>
            <div class="flex gap-2">
              <input 
                type="password" 
                id="api-key-input" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mistral focus:border-mistral transition-all" 
                placeholder="Enter your Mistral API key"
              >
              <button id="test-connection" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Test
              </button>
            </div>
            <p id="connection-status" class="text-xs mt-1 h-4"></p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <select 
              id="model-select" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mistral focus:border-mistral transition-all appearance-none bg-white"
            >
              <option value="mistral-large-latest">Mistral Large (latest) — most capable</option>
              <option value="mistral-small-latest">Mistral Small (latest) — fast &amp; efficient</option>
              <option value="magistral-medium-latest">Magistral Medium (latest) — reasoning</option>
              <option value="magistral-small-latest">Magistral Small (latest) — fast reasoning</option>
              <option value="open-mistral-nemo">Mistral NeMo — open-weight 12B</option>
              <option value="codestral-latest">Codestral (latest) — code-specialized</option>
            </select>
          </div>
          
          <div id="status-message" class="p-3 rounded-lg text-sm hidden"></div>
          
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button id="cancel-settings" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              Cancel
            </button>
            <button id="save-settings" class="px-4 py-2 bg-mistral text-white rounded-lg hover:bg-mistral-dark transition-colors text-sm font-medium">
              Save
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add to document body
    document.body.appendChild(this.modalElement);
    
    // Get elements
    this.apiKeyInput = this.modalElement.querySelector('#api-key-input') as HTMLInputElement;
    this.modelSelect = this.modalElement.querySelector('#model-select') as HTMLSelectElement;
    this.testConnectionButton = this.modalElement.querySelector('#test-connection') as HTMLButtonElement;
    this.saveButton = this.modalElement.querySelector('#save-settings') as HTMLButtonElement;
    this.cancelButton = this.modalElement.querySelector('#cancel-settings') as HTMLButtonElement;
    this.statusMessage = this.modalElement.querySelector('#status-message') as HTMLElement;
  }
  
  public show(): void {
    this.modalElement.classList.remove('hidden');
    this.apiKeyInput.focus();
  }
  
  public hide(): void {
    this.modalElement.classList.add('hidden');
  }
  
  public setApiKey(apiKey: string | null): void {
    this.apiKeyInput.value = apiKey || '';
  }
  
  public getApiKey(): string {
    return this.apiKeyInput.value.trim();
  }
  
  public setModel(model: string): void {
    this.modelSelect.value = model;
  }
  
  public getModel(): string {
    return this.modelSelect.value;
  }
  
  public setAvailableModels(models: string[]): void {
    // Preserve the currently selected value before wiping the list
    const current = this.modelSelect.value;
    this.modelSelect.innerHTML = '';
    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model;
      option.textContent = model.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      this.modelSelect.appendChild(option);
    });
    // Restore selection if still in the list, otherwise fall back to first option
    this.modelSelect.value = models.includes(current) ? current : models[0] ?? '';
  }
  
  public showStatus(message: string, isError: boolean = false): void {
    this.statusMessage.textContent = message;
    this.statusMessage.className = `p-3 rounded-lg text-sm ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`;
    this.statusMessage.classList.remove('hidden');
  }
  
  public hideStatus(): void {
    this.statusMessage.classList.add('hidden');
  }
  
  public showConnectionStatus(success: boolean, message: string): void {
    const statusElement = this.modalElement.querySelector('#connection-status') as HTMLElement;
    statusElement.textContent = message;
    statusElement.className = `text-xs mt-1 h-4 ${success ? 'text-green-600' : 'text-red-600'}`;
  }
  
  public onTestConnection(callback: (apiKey: string) => void): void {
    this.testConnectionButton.addEventListener('click', () => {
      callback(this.getApiKey());
    });
  }
  
  public onSave(callback: (apiKey: string, model: string) => void): void {
    this.saveButton.addEventListener('click', () => {
      callback(this.getApiKey(), this.getModel());
    });
  }
  
  public onCancel(callback: () => void): void {
    this.cancelButton.addEventListener('click', callback);
  }
  
  public destroy(): void {
    if (this.modalElement && this.modalElement.parentNode) {
      this.modalElement.parentNode.removeChild(this.modalElement);
    }
  }
}