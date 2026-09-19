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
    tint: '#D97757',

    background: '#FBF8F3',
    foreground: '#16221F',

    card: '#FFFEFB',
    cardForeground: '#16221F',

    primary: '#D97757',
    primaryDeep: '#B95746',
    primaryForeground: '#ffffff',

    secondary: '#F2E6D7',
    secondaryForeground: '#31423D',

    muted: '#F0EBE4',
    mutedForeground: '#78847E',

    accent: '#E3F0E9',
    accentForeground: '#2D5945',

    destructive: '#C9554C',
    destructiveForeground: '#ffffff',

    border: '#E7DED5',
    input: '#D8D0C5',
  },

  dark: {
    text: '#F6F3EE',
    tint: '#F19A78',
    background: '#17221F',
    foreground: '#F6F3EE',
    card: '#20312B',
    cardForeground: '#F6F3EE',
    primary: '#F19A78',
    primaryDeep: '#DE765C',
    primaryForeground: '#15201D',
    secondary: '#3A443E',
    secondaryForeground: '#E6EEE9',
    muted: '#2D3B35',
    mutedForeground: '#A8B3AD',
    accent: '#2D5543',
    accentForeground: '#D5EBDD',
    destructive: '#E26E64',
    destructiveForeground: '#241513',
    border: '#3B4C44',
    input: '#43544B',
  },

  radius: 22,
};

export default colors;
