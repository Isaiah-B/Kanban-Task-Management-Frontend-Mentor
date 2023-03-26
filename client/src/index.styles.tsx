import { createGlobalStyle, css } from 'styled-components';

export const MEDIA_SIZES = {
  tablet: '(max-width: 48em)',
  tabletS: '(max-width: 38em)',
  mobileL: '(max-width: 34em)',
  mobileM: '(max-width: 27em)',
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100%;
    font-size: 62.5%;
    line-height: 1;
  }

  body {
    max-height: 100%;
    height: 100%;
    font-family: 'Plus Jakarta Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.backgroundMain};
  }

  #root {
    height: inherit;
  }
  
  h1 {
    font-size: 2.4rem;
    font-weight: 700;
    line-height: 3rem;
    color: ${({ theme }) => theme.textMain};

    @media ${MEDIA_SIZES.tablet} {
      font-size: 2rem;
      line-height: 2.5rem;
    }

    @media ${MEDIA_SIZES.mobileM} {
      font-size: 1.8rem;
      line-height: 2.3rem;
    }
  }

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 2.3rem;
    color: ${({ theme }) => theme.textMain};
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.9rem;
    color: ${({ theme }) => theme.textMain};
  }

  h4 {
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 1.5rem;
    letter-spacing: 2.4px;
    color: ${({ theme }) => theme.textLight};
  }

  // Webkit scrollbar
  ::-webkit-scrollbar {
    height: 1rem;
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: ${({ theme }) => theme.scrollbar}
  }

  // Firefox scrollbar
  body {
    scrollbar-color: ${({ theme }) => theme.scrollbar} transparent;
  }
`;

export const BodyL = css`
  font-size: 1.3rem;
  font-weight: 500;
  line-height: 2.3rem;
`;

export const BodyM = css`
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.5rem;
`;
