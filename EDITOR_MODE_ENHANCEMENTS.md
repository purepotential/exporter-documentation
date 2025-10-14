# Editor Mode Enhancements for Token References

## Overview

While the main token reference functionality works in the rendered documentation, the editor mode (Supernova interface) has different capabilities. Here are the approaches we've implemented to enhance the editor experience:

## 1. Custom Token Preview Block

### What It Does:
- Creates a custom block that can be inserted into documentation pages
- Shows resolved values and references for any selected token
- Works in both editor and published documentation

### How to Use:
1. **In Supernova Editor**: Add a new block → "Token Preview with References"
2. **Select a Token**: Choose any token from your design system
3. **Configure Display**: Choose from 3 display styles:
   - **Inline**: `padding-h: 20px (spacing-base)`
   - **Detailed**: Structured display with labels
   - **Card**: Full card layout with all information

### Configuration Options:
- **Token**: Select which token to preview
- **Show References**: Toggle reference display on/off
- **Show Resolved Value**: Toggle resolved value display on/off
- **Display Style**: Choose Inline, Detailed, or Card layout

## 2. Enhanced Token Descriptions

### Function Available:
```javascript
generateEnhancedTokenDescription(token)
```

### What It Does:
- Generates enhanced descriptions that include resolved values and references
- Can be used to programmatically update token descriptions
- Format: `"Original description | Resolved value: 20px | References: spacing-base"`

### Use Cases:
- Batch update token descriptions with resolved values
- Create comprehensive token documentation
- Enhance existing token metadata

## 3. Editor Mode Limitations

### What We Can't Control:
- **Native Token Display**: The editor's built-in token list (what you showed in screenshot)
- **Token Names**: How tokens appear in the token panel
- **Swatch Previews**: The visual token previews in editor

### What We Can Enhance:
- **Custom Blocks**: Add token preview blocks to pages
- **Token Descriptions**: Enhance with resolved values and references
- **Documentation Content**: Rich token information in published docs

## 4. Workarounds for Editor Mode

### Option A: Custom Token Preview Pages
Create dedicated pages with custom token preview blocks:

```
# Token Reference Guide

## Spacing Tokens
[Token Preview Block: padding-h]
[Token Preview Block: padding-top]
[Token Preview Block: gap]

## Color Tokens  
[Token Preview Block: primary-color]
[Token Preview Block: secondary-color]
```

### Option B: Enhanced Token Descriptions
Use the `generateEnhancedTokenDescription()` function to update token descriptions:

**Before**: `"Top bar header"`
**After**: `"Top bar header | Resolved value: 20px | References: spacing-base"`

### Option C: Reference Documentation
Create comprehensive token reference documentation that shows:
- All token relationships
- Resolved values
- Reference chains
- Usage examples

## 5. Implementation Status

### ✅ Available Now:
- Custom Token Preview Block (3 display styles)
- Enhanced description generator function
- Full reference display in published documentation
- CSS styling for all preview modes

### ⚠️ Editor Limitations:
- Cannot modify native Supernova token panel display
- Cannot change how tokens appear in editor lists
- Cannot add resolved values to token swatches in editor

### 🎯 Recommended Approach:
1. **Use Custom Blocks**: Add token preview blocks to key documentation pages
2. **Create Reference Pages**: Dedicated pages showing token relationships
3. **Enhanced Descriptions**: Update token descriptions with resolved values
4. **Published Documentation**: Full reference display in rendered output

## 6. Example Usage

### Custom Block in Editor:
1. Add "Token Preview with References" block
2. Select "padding-h" token
3. Choose "Card" display style
4. Result: Full card showing "20px" resolved value and "spacing-base" reference

### Enhanced Description:
```javascript
// Original: "Top bar header"
// Enhanced: "Top bar header | Resolved value: 20px | References: spacing-base"
const enhanced = generateEnhancedTokenDescription(paddingHToken)
```

## 7. Future Possibilities

### Potential Supernova Features:
- Custom token panel extensions
- Token description templates
- Editor preview enhancements
- Token relationship visualization

### Current Workarounds:
- Custom documentation blocks
- Enhanced token descriptions
- Reference documentation pages
- Comprehensive published documentation

The custom token preview block provides the best solution for showing resolved values and references in a way that works in both editor and published documentation.