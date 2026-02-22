import { css } from '@emotion/react';

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Media query helpers
export const media = {
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
};

// Responsive container
export const container = css`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;

  @media ${media.sm} {
    max-width: ${breakpoints.sm};
  }

  @media ${media.md} {
    max-width: ${breakpoints.md};
  }

  @media ${media.lg} {
    max-width: ${breakpoints.lg};
  }

  @media ${media.xl} {
    max-width: ${breakpoints.xl};
  }

  @media ${media['2xl']} {
    max-width: ${breakpoints['2xl']};
  }
`;

// Responsive sidebar
export const responsiveSidebar = css`
  @media (max-width: ${breakpoints.md}) {
    width: 200px;
  }

  @media (max-width: ${breakpoints.sm}) {
    width: 180px;
    
    // Hide on very small screens
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

// Responsive text
export const responsiveText = {
  base: css`
    font-size: 1rem;
    
    @media ${media.sm} {
      font-size: 1.1rem;
    }
  `,
  small: css`
    font-size: 0.875rem;
    
    @media ${media.sm} {
      font-size: 0.9375rem;
    }
  `,
};

// Accessibility helpers
export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

export const focusOutline = css`
  outline: 2px solid ${({ theme }) => theme.colors.mistral.DEFAULT};
  outline-offset: 2px;
`;

export const keyboardFocusable = css`
  &:focus-visible {
    ${focusOutline}
  }
`;