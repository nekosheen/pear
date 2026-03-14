import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../state/AppContext';
import CustomSelect, {SelectOption} from '../custom/CustomSelect';
import {css} from "@emotion/react";
import { useTheme } from '../ThemeProvider';
import { faTemperatureLow } from '@fortawesome/free-solid-svg-icons';


export interface Model {
  name: string;
  label: string;
  description: string;
  temperature: number | undefined;
};

// default updated at 13.03.2026
export const MODELS_DEFAULT: SelectOption[] = [
  {
    description:"Official mistral-large-2512 Mistral AI model",
    label:"mistral-large-latest",
    name:"mistral-large-latest",
    temperature:0.3
  },
  {
    description:"Our latest enterprise-grade small model with the latest version released June 2025.",
    label:"mistral-small-latest",
    name:"mistral-small-latest",
    temperature:0.3
  },
  { description:"Our best multilingual open source model released July 2024.",
    label:"open-mistral-nemo",
    name:"open-mistral-nemo",
    temperature:0.3
  },
];


const SettingsModal: React.FC = () => {

  const theme = useTheme();

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

  const { isSettingsOpen, closeSettings, apiKey, model, setApiKey, setModel, testConnection, getMistralModels } = useAppContext();

  const [keyInput, setKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(model);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [models, setModels] = useState<SelectOption[]>(MODELS_DEFAULT);

  function getTemperatureColorHSL(temp:number | undefined, minTemp = 0.0, maxTemp = 2.0) {
    if (!temp) return undefined
    const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temp));
    const norm = (clampedTemp - minTemp) / (maxTemp - minTemp);
    const hue = 240 - (norm * 240);
    return `hsl(${hue}, 80%, 40%)`;
  }

  useEffect(() => {
    if (isSettingsOpen) {
      setKeyInput(apiKey ?? '');
      setSelectedModel(model);
      setTestResult(null);
      setSaveError(null);
      if (apiKey) {
        getMistralModels(apiKey).then((data:any)=>{
          //use the default in case of error or empty response
          data.length>0 &&
          setModels(data.map((m:Model)=>({
            value: m.name,
            label: m.label.split('-').join(' '),
            iconTooltip: 'temperature '+m.temperature,
            description: m.description,
            icon: faTemperatureLow,
            iconColor: getTemperatureColorHSL(m.temperature),
            title: m.name
          })) as SelectOption[])
        })
      }
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
                placeholder="Enter your Mistral API key..."
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
                  {testResult === 'success' ? '[OK] Connection successful!' : '[X] Connection failed - check your key.'}
                </p>
              )}
            </div>

            {/* Model */}
            <div css={fieldGroupStyles}>
              <label css={labelStyles} htmlFor="model-select">Model</label>
              <div css={selectStyles}>
                <CustomSelect
                  id="model-select"
                  value={selectedModel}
                  options={models}
                  onChange={setSelectedModel}
                  ariaLabel="Select a model"
                />
              </div>
            </div>

            <div css={buttonRowStyles}>
              <button css={secondaryBtnStyles} onClick={handleTest} disabled={isTesting || !keyInput}>
                {isTesting ? 'Testing...' : 'Test Connection'}
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

