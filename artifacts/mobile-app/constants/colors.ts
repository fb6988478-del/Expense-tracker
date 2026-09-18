/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#16221F',
    tint: '#E9734A',

    background: '#F6F3EE',
    foreground: '#16221F',

    card: '#FFFCF8',
    cardForeground: '#16221F',

    primary: '#E9734A',
    primaryDeep: '#C9573F',
    primaryForeground: '#ffffff',

    secondary: '#E9E4DC',
    secondaryForeground: '#31423D',

    muted: '#E8E3DB',
    mutedForeground: '#7A847E',

    accent: '#DCE9E1',
    accentForeground: '#28523E',

    destructive: '#C9554C',
    destructiveForeground: '#ffffff',

    border: '#DED8CF',
    input: '#D8D1C7',
  },

  dark: {
    text: '#F6F3EE',
    tint: '#F58A61',
    background: '#15201D',
    foreground: '#F6F3EE',
    card: '#1D2B27',
    cardForeground: '#F6F3EE',
    primary: '#F58A61',
    primaryDeep: '#D96C4E',
    primaryForeground: '#15201D',
    secondary: '#2B3934',
    secondaryForeground: '#E6EEE9',
    muted: '#2A3733',
    mutedForeground: '#A8B3AD',
    accent: '#284A3B',
    accentForeground: '#D5EBDD',
    destructive: '#E26E64',
    destructiveForeground: '#241513',
    border: '#35443E',
    input: '#3A4943',
  },

  radius: 22,
};

export default colors;
