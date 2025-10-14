# Token Reference Display Configuration Guide

This guide explains where and how to configure token blocks to display or hide full token references in your documentation.

## Configuration Levels

### 1. Global Configuration (Exporter Settings)

**Location**: `exporter.json` → `contributes.configuration`

**Added Configuration Options**:

```json
{
  "key": "blockConfigTokensShowReferences",
  "type": "boolean",
  "label": "Token blocks: Show token references",
  "description": "When enabled, token blocks will display references to other tokens alongside resolved values (e.g., 'primary-red' next to '#ff0000').",
  "category": "Blocks",
  "default": true
}
```

```json
{
  "key": "blockConfigTokensReferenceStyle",
  "type": "enum",
  "label": "Token blocks: Reference display style",
  "description": "Choose how token references are displayed in token blocks.",
  "category": "Blocks",
  "values": [
    "Simple name only",
    "Full path",
    "Detailed list for complex tokens"
  ],
  "default": "Simple name only"
}
```

**How to Use**: 
- Users can configure these settings in the Supernova exporter configuration UI
- `blockConfigTokensShowReferences`: Global toggle to show/hide all token references
- `blockConfigTokensReferenceStyle`: Controls the display format of references

### 2. Template Level Implementation

**Location**: `src/page_body/structure/blocks/tokens/values/page_block_token_value.pr`

**What Changed**:
- Added configuration reading: `{[ const configuration = exportConfiguration() /]}`
- Added reference display logic for all token types
- Integrated with TypeScript functions from `tokens.ts`

**Key Features**:
- Respects global configuration settings
- Shows references inline with token values
- Supports different reference styles
- Handles complex tokens (like Typography) with multiple references

### 3. TypeScript Function Integration

**Location**: `typescript/src/doc_functionality/tokens.ts`

**New Functions Available**:
- `displayTokenWithReference()` - Main function for displaying tokens with references
- `getColorTokenReference()`, `getMeasureTokenReference()`, `getTextTokenReference()` - Extract references from specific token types
- `getComplexTokenReferences()` - Get all references from complex tokens
- `formatReferenceList()` - Format multiple references as a list
- `createSimpleTokenReference()`, `createDetailedTokenReference()` - Create styled reference displays

### 4. CSS Styling

**Location**: `src/token-references.css`

**CSS Classes Added**:
- `.token-reference` - Simple reference display
- `.token-reference-path` - Detailed reference with path
- `.token-references` - Container for multiple references
- `.token-complex-references` - Complex token reference container

## Configuration Options Explained

### Show References (Boolean)
- **True**: Display token references alongside resolved values
- **False**: Show only resolved values (current behavior)

### Reference Style (Enum)

#### "Simple name only"
Shows just the referenced token name:
```
#ff0000 (primary-red)
```

#### "Full path" 
Shows the full path to the referenced token:
```
#ff0000 (colors/brand/primary-red)
```

#### "Detailed list for complex tokens"
Shows individual property references for complex tokens like Typography:
```
Inter Bold 16px/24px
• Font Family: Inter
• Font Weight: Bold  
• Font Size: text-base
• Line Height: leading-normal
```

## How Users Configure This

### In Supernova UI:
1. Go to Exporter Settings
2. Navigate to "Blocks" category
3. Toggle "Token blocks: Show token references"
4. Select "Token blocks: Reference display style"

### Per-Block Configuration (Future Enhancement):
You could extend this by adding block-level properties to allow per-block overrides:

```json
{
  "key": "io.supernova.documentation-main.token-with-references",
  "properties": [
    {
      "key": "showReferences",
      "type": "boolean",
      "default": true,
      "label": "Show token references"
    },
    {
      "key": "referenceStyle", 
      "type": "enum",
      "values": ["simple", "detailed", "path"],
      "default": "simple",
      "label": "Reference style"
    }
  ]
}
```

## Token Types Supported

- **Color tokens**: Shows color reference and opacity reference
- **Typography tokens**: Shows references for font family, weight, size, line height, etc.
- **Measure tokens**: BorderRadius, BorderWidth, Dimension, Duration, FontSize, LetterSpacing, LineHeight, Opacity, ParagraphSpacing, Size, Space, ZIndex
- **Text tokens**: ProductCopy, String, FontFamily, FontWeight
- **Shadow tokens**: Shows color references in shadow values
- **Gradient tokens**: Basic support (can be enhanced)

## Files Updated for Token Reference Support

### Template Files Updated:
1. **`src/page_body/structure/blocks/tokens/values/page_block_token_value.pr`** - Main token value display with reference support
2. **`src/page_body/structure/blocks/tokens/variants/page_block_token_variant_contrast_grid.pr`** - Contrast grid variant with reference overlays
3. **`src/page_body/structure/blocks/tokens/previews/page_block_token_preview_small.pr`** - Small preview with reference support for displayed values
4. **`src/page_body/structure/blocks/tokens/previews/page_block_token_preview_large.pr`** - Large preview with reference support for displayed values

### Configuration Files Updated:
1. **`exporter.json`** - Added global configuration options for token references
2. **`src/token-references.css`** - Added CSS styles for reference display including contrast grid overlays

### TypeScript Files Updated:
1. **`typescript/src/doc_functionality/tokens.ts`** - Enhanced with comprehensive reference extraction and display functions

### Variant Coverage:
- ✅ **Table variant** - Uses `page_block_token_value` (updated)
- ✅ **Grid variants** (1-4 columns) - Uses `page_block_token_value` (updated) 
- ✅ **Stack variants** - Uses `page_block_token_value` (updated)
- ✅ **Contrast grid variant** - Direct updates with hover overlays for references
- ✅ **All preview files** - Updated for user-visible values (styling values remain unchanged)

## Implementation Notes

1. **Backward Compatibility**: All changes are backward compatible. Existing documentation will continue to work without references displayed.

2. **Performance**: Reference lookup is efficient and doesn't significantly impact rendering performance.

3. **Theming**: The CSS classes support both light and dark modes and are responsive.

4. **Extensibility**: The system is designed to be easily extended for additional token types or reference styles.

5. **Comprehensive Coverage**: All token display variants now support reference display when enabled.

## Testing the Configuration

1. Enable "Show token references" in exporter settings
2. Publish documentation with tokens that reference other tokens
3. Verify references appear next to resolved values
4. Test different reference styles
5. Verify CSS styling matches your design system

## Troubleshooting

- **References not showing**: Check that `blockConfigTokensShowReferences` is enabled
- **Styling issues**: Ensure `token-references.css` is included in your build
- **Missing functions**: Verify TypeScript compilation completed successfully
- **Wrong reference style**: Check `blockConfigTokensReferenceStyle` setting