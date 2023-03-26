import 'styled-components';

// Define interface for styled-component theme variables
declare module 'styled-components' {
  export interface DefaultTheme {
    name: string,
    backgroundMain: string,
    backgroundSecondary: string,
    lines: string,
    textMain: string,
    textLight: string,
    modalHeading: string,
    modalSubheading: string,
    inputPlaceholder: string,
    menuHover: string,
    buttonSecondary: string,
    buttonSecondaryHover: string,
    checkbox: string,
    checkboxBackground: string,
    textFieldBackground: string,
    dropdownMenuBackground: string,
    newColumnBackground: string,
    optionsMenuBackground: string,
    shadow: string,
    scrollbar: string,
  }
}
