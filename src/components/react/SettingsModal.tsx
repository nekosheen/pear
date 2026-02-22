import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { css } from '@emotion/react';
import { useAppContext } from '../state/AppContext';
import { useTheme } from './ThemeProvider';

const MODELS = [
  { id: 'mistral-large-latest', label: 'Mistral Large (Latest)' },
  { id: 'mistral-small-latest', label: 'Mistral Small (Latest)' },
  { id: 'open-mistral-7b', label: 'Mistral 7B' },
  { id: 'open-mixtral-8x7b', label: 'Mixtral 8x7B' },
  { id: 'open-mixtral-8x22b', label: 'Mixtral 8x22B' },
];

const SettingsModal: React.FC = () => {
  const { isSettingsOpen, closeSettings, apiKey, model, setApiKey, setModel, testConnection } = useAppContext();
  const theme = useTheme();

  const [keyInput, setKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(model);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (isSettingsOpen) {
      setKeyInput(apiKey ?? '');
      setSelectedModel(model);
      setTestResult(null);
      setSaveError(null);
    }
  }, [isSettingsOpen, apiKey, model]);

  const handleSave = async () => {
    setSaveError(null);
    try {
      if (keyInput && keyInput !== apiKey) {
        await setApiKey(keyInput);
      }
      await setModel(selectedModel);
      closeSettings();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings');
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      // Temporarily set the key for testing if it's new
      if (keyInput && keyInput !== apiKey) {
        await setApiKey(keyInput);
      }
      const ok = await testConnection();
      setTestResult(ok ? 'success' : 'error');
    } catch {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  const overlayStyles = css`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  `;

  const modalStyles = css`
    background: ${theme.colors.white};
    border-radius: 16px;
    padding: ${theme.spacing[6]};
    width: 440px;
    max-width: 90vw;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  `;

  const titleStyles = css`
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.gray[900]};
    margin: 0 0 ${theme.spacing[5]} 0;
  `;

  const labelStyles = css`
    display: block;
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.gray[700]};
    margin-bottom: ${theme.spacing[1]};
  `;

  const inputStyles = css`
    width: 100%;
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    border: 1px solid ${theme.colors.gray[300]};
    border-radius: 8px;
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.gray[900]};
    outline: none;
    box-sizing: border-box;
    font-family: monospace;
    transition: border-color 0.2s;

    &:focus {
      border-color: ${theme.colors.mistral.DEFAULT};
      box-shadow: 0 0 0 2px ${theme.colors.mistral[50]};
    }
  `;

  const selectStyles = css`
    width: 100%;
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    border: 1px solid ${theme.colors.gray[300]};
    border-radius: 8px;
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.gray[900]};
    background: ${theme.colors.white};
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    transition: border-color 0.2s;

    &:focus {
      border-color: ${theme.colors.mistral.DEFAULT};
      box-shadow: 0 0 0 2px ${theme.colors.mistral[50]};
    }
  `;

  const buttonRowStyles = css`
    display: flex;
    gap: ${theme.spacing[3]};
    margin-top: ${theme.spacing[6]};
    justify-content: flex-end;
  `;

  const primaryBtnStyles = css`
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    background: ${theme.colors.mistral.DEFAULT};
    color: white;
    border: none;
    border-radius: 8px;
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: background 0.2s;

    &:hover { background: ${theme.colors.mistral.dark}; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  `;

  const secondaryBtnStyles = css`
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[700]};
    border: none;
    border-radius: 8px;
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: background 0.2s;

    &:hover { background: ${theme.colors.gray[200]}; }
  `;

  const fieldGroupStyles = css`
    margin-bottom: ${theme.spacing[4]};
  `;

  const hintStyles = css`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.gray[500]};
    margin-top: ${theme.spacing[1]};
  `;

  const testResultStyles = (ok: boolean) => css`
    margin-top: ${theme.spacing[2]};
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${ok ? theme.colors.success : '#EF4444'};
  `;

  const errorStyles = css`
    background: #FEF2F2;
    border: 1px solid #FECACA;
    color: #DC2626;
    border-radius: 8px;
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    font-size: ${theme.typography.fontSize.sm};
    margin-bottom: ${theme.spacing[4]};
  `;

  const headerStyles = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.spacing[5]};
  `;

  const closeBtnStyles = css`
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.colors.gray[400]};
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    &:hover { color: ${theme.colors.gray[700]}; }
  `;

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div
          css={overlayStyles}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeSettings(); }}
        >
          <motion.div
            css={modalStyles}
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div css={headerStyles}>
              <h2 css={titleStyles}>Settings</h2>
              <button css={closeBtnStyles} onClick={closeSettings} aria-label="Close settings">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {saveError && <div css={errorStyles}>{saveError}</div>}

            {/* API Key */}
            <div css={fieldGroupStyles}>
              <label css={labelStyles} htmlFor="api-key-input">Mistral API Key</label>
              <input
                id="api-key-input"
                type="password"
                css={inputStyles}
                value={keyInput}
                onChange={(e) => { setKeyInput(e.target.value); setTestResult(null); }}
                placeholder="Enter your Mistral API key…"
                autoComplete="off"
              />
              <p css={hintStyles}>
                Get your key at{' '}
                <a href="https://console.mistral.ai" target="_blank" rel="noreferrer"
                   css={css`color: ${theme.colors.mistral.DEFAULT}; text-decoration: underline;`}>
                  console.mistral.ai
                </a>
              </p>
              {testResult && (
                <p css={testResultStyles(testResult === 'success')}>
                  {testResult === 'success' ? '✓ Connection successful!' : '✗ Connection failed — check your key.'}
                </p>
              )}
            </div>

            {/* Model */}
            <div css={fieldGroupStyles}>
              <label css={labelStyles} htmlFor="model-select">Model</label>
              <select
                id="model-select"
                css={selectStyles}
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>

            <div css={buttonRowStyles}>
              <button css={secondaryBtnStyles} onClick={handleTest} disabled={isTesting || !keyInput}>
                {isTesting ? 'Testing…' : 'Test Connection'}
              </button>
              <button css={primaryBtnStyles} onClick={handleSave}>
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
