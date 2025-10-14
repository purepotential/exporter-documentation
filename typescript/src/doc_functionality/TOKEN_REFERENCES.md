# Token Reference Display Functionality

This document describes the new functionality added to `tokens.ts` for displaying design token references alongside their resolved values.

## Overview

Design tokens can reference other tokens (e.g., a color token might reference another color token, or a typography token might reference font family and size tokens). The new functionality allows you to display both the resolved value and the token reference information.

## Key Functions

### Core Display Functions

#### `displayTokenWithReference(token, options)`
Main function to display any token with its resolved value and optional reference.

```typescript
const colorToken: ColorToken = // ... your color token
const display = displayTokenWithReference(colorToken, { 
  showReference: true,
  forceRgbFormat: false 
})
// Output: "#ff0000 <span class="token-reference">(primary-red)</span>"
```

**Options:**
- `showReference?: boolean` - Whether to show reference information (default: true)
- `tokenGroups?: TokenGroup[]` - Token groups for full path resolution
- `maxFontSize?: boolean` - For typography tokens, limit font size
- `forceRgbFormat?: boolean` - For color tokens, force RGB format

### Reference Extraction Functions

#### `getColorTokenReference(colorValue)`
Get the reference name from a color token value.

#### `getMeasureTokenReference(measureValue)`
Get the reference name from a measure token value.

#### `getTextTokenReference(textValue)`
Get the reference name from a text token value.

#### `getComplexTokenReferences(token)`
Get all references from complex tokens (like typography with multiple referenced values).

```typescript
const typographyToken: TypographyToken = // ... your typography token
const refs = getComplexTokenReferences(typographyToken)
// Output: ["Font Family: Inter", "Font Size: text-base", "Font Weight: medium"]
```

### Utility Functions

#### `formatReferenceList(references)`
Format multiple references as a readable list.

#### `createSimpleTokenReference(referenceName)`
Create a simple token reference display (just the name).

#### `createDetailedTokenReference(referencePath)`
Create a detailed token reference display with path.

#### `hasTokenValueReference(tokenValue)`
Check if a token value has a reference.

## Enhanced Existing Functions

### `getFormattedColor(colorValue, forceRgbFormat, customOpacity, showReference)`
Now accepts a `showReference` parameter to include reference information in color display.

### `measureValueToReadableUnit(value, showReference)`
Now accepts a `showReference` parameter to include reference information in measure display.

## Usage Examples

### Basic Usage
```typescript
import { displayTokenWithReference } from './tokens'

// Display any token with reference
const tokenDisplay = displayTokenWithReference(myToken, { showReference: true })
```

### Color Token with Reference
```typescript
const colorToken: ColorToken = {
  // ... token properties
  value: {
    color: { r: 255, g: 0, b: 0 },
    opacity: { measure: 1, unit: "Raw" },
    referencedTokenId: "primary-red-id",
    referencedToken: { name: "primary-red", /* ... */ }
  }
}

const display = displayTokenWithReference(colorToken)
// Output: "#ff0000 <span class="token-reference">(primary-red)</span>"
```

### Typography Token with Multiple References
```typescript
const typographyToken: TypographyToken = {
  // ... token properties with referenced font family, size, weight, etc.
}

const display = displayTokenWithReference(typographyToken)
const allRefs = getComplexTokenReferences(typographyToken)
// allRefs contains all individual property references
```

### Custom Reference Display
```typescript
// Get resolved value without reference
const resolvedValue = displayTokenWithReference(token, { showReference: false })

// Get reference separately for custom formatting
const reference = getColorTokenReference(token.value)
const customDisplay = `${resolvedValue} → ${reference}`
```

## CSS Classes

The reference display uses these CSS classes that you can style:

- `.token-reference` - Simple reference display
- `.token-reference-path` - Detailed reference with path
- `.token-references` - Container for multiple references
- `.token-references ul` - List of multiple references
- `.token-references li` - Individual reference in list

## Token Types Supported

- **Color**: Shows color value with reference
- **Typography**: Shows typography description with individual property references
- **Measure tokens**: BorderRadius, BorderWidth, Dimension, Duration, FontSize, LetterSpacing, LineHeight, Opacity, ParagraphSpacing, Size, Space, ZIndex
- **Text tokens**: ProductCopy, String, FontFamily, FontWeight
- **Shadow**: Shows shadow description (references in individual shadow values)
- **Gradient**: Shows gradient description

## Notes

- References are extracted from the token value objects, not the base token
- Complex tokens (like Typography) can have multiple references for different properties
- The functionality gracefully handles tokens without references
- Path resolution requires passing `tokenGroups` parameter for full path display