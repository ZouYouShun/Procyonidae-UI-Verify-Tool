import { render } from '@testing-library/react';

import BrowserSettingsFeatureSpeechToText from './browser-settings-feature-speech-to-text';

describe('BrowserSettingsFeatureSpeechToText', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BrowserSettingsFeatureSpeechToText />);
    expect(baseElement).toBeTruthy();
  });
});
