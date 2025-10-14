# Enhanced Token List Block with References

## Overview

I've created a comprehensive **"Token List with References"** custom block that replicates and extends the functionality of default token blocks, with full support for displaying resolved values, references, and previews for multiple tokens.

## 🎯 Key Features

### **Multiple Token Selection**
- **Individual Tokens**: Select specific tokens from a list
- **Token Groups**: Select entire token groups automatically
- **Mixed Selection**: Combine individual tokens and groups

### **Display Variants** (Same as Default Blocks)
- **Table**: Comprehensive table with columns for preview, name, value, reference, description
- **Grid-4/3/2/1**: Grid layouts with 4, 3, 2, or 1 columns
- **Stack**: Horizontal stack layout perfect for color palettes

### **Advanced Configuration**
- **Show/Hide Options**: Toggle previews, values, references, descriptions independently
- **Reference Styles**: Simple names, detailed lists, or full paths
- **Sorting**: Sort by name, type, value, or reference
- **Filtering**: Filter by token type (Color, Typography, Dimension, etc.)

### **Enhanced Information Display**
- **Resolved Values**: Shows actual computed values (20px, #ff0000, etc.)
- **Reference Information**: Shows what each token references
- **Token Previews**: Visual previews using existing preview templates
- **Descriptions**: Token descriptions and metadata
- **Type Information**: Clear token type indicators

## 🔧 Configuration Options

### **Token Selection**
```
Tokens: [Select individual tokens]
Token Group: [Select entire group] (alternative)
```

### **Display Options**
```
✅ Show token references
✅ Show resolved values  
✅ Show token previews
✅ Show token descriptions
```

### **Layout & Style**
```
Display Variant: Table | Grid-4 | Grid-3 | Grid-2 | Grid-1 | Stack
Reference Style: Simple | Detailed | Full path
Sort By: Name | Type | Value | Reference
Filter By: All | Color | Typography | Dimension | String | Shadow | Gradient
```

## 📊 Display Variants

### **Table Variant**
Perfect for comprehensive token documentation:

| Preview | Token | Value | Reference | Description |
|---------|-------|-------|-----------|-------------|
| [swatch] | padding-h (Dimension) | 20px | spacing-base | Top bar header |
| [swatch] | primary-red (Color) | #ff0000 | brand-red | Primary brand color |

### **Grid Variants**
Card-based layout with visual previews:

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ [Preview]   │ │ [Preview]   │ │ [Preview]   │ │ [Preview]   │
│ padding-h   │ │ primary-red │ │ font-base   │ │ shadow-md   │
│ Dimension   │ │ Color       │ │ Typography  │ │ Shadow      │
│ 20px        │ │ #ff0000     │ │ 16px Inter  │ │ 0 4px 8px   │
│ → spacing-  │ │ → brand-red │ │ → text-base │ │ → elevation │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### **Stack Variant**
Horizontal layout ideal for color palettes:

```
┌─────┐ padding-h (Dimension) | 20px | References: spacing-base
│     │ 
└─────┘ 

┌─────┐ primary-red (Color) | #ff0000 | References: brand-red
│ RED │ 
└─────┘ 
```

## 🎨 Reference Display Examples

### **Simple References**
- `20px → spacing-base`
- `#ff0000 → primary-red`
- `Inter Bold → font-primary`

### **Detailed References (Typography)**
- Font Family: Inter
- Font Weight: Bold
- Font Size: text-base
- Line Height: leading-normal

### **Complex Token Chains**
- `spacing-sm → spacing-base → 4px`
- `text-primary → brand-dark → #1a1a1a`

## 🔍 Advanced Features

### **Smart Filtering**
- **By Type**: Show only Color tokens, Typography tokens, etc.
- **By Reference**: Show only tokens that reference others
- **By Base**: Show only base tokens (no references)

### **Intelligent Sorting**
- **By Name**: Alphabetical order
- **By Type**: Group by token type
- **By Value**: Sort by resolved values
- **By Reference**: Group referenced vs base tokens

### **Responsive Design**
- **Desktop**: Full table/grid layout
- **Tablet**: Condensed columns, hidden less important info
- **Mobile**: Stacked layout, essential info only

## 📱 Usage Examples

### **Color Palette Documentation**
```
Block: Token List with References
Tokens: [All color tokens]
Display: Stack
Show: Previews ✅, Values ✅, References ✅
Filter: Color tokens only
```

### **Spacing System Overview**
```
Block: Token List with References  
Token Group: Spacing
Display: Table
Show: All options ✅
Sort: By value (ascending)
```

### **Typography Scale**
```
Block: Token List with References
Token Group: Typography
Display: Grid-2
Show: Previews ✅, Values ✅, References ✅
Reference Style: Detailed
```

### **Component Token Analysis**
```
Block: Token List with References
Tokens: [Button-related tokens]
Display: Table
Show: All ✅
Sort: By reference
Filter: All types
```

## 🎯 Benefits Over Default Blocks

### **Enhanced Information**
- ✅ **Reference Display**: See what tokens reference
- ✅ **Resolved Values**: Always show computed values
- ✅ **Flexible Configuration**: Control exactly what's shown
- ✅ **Advanced Sorting/Filtering**: Better organization

### **Better Documentation**
- ✅ **Token Relationships**: Understand token hierarchies
- ✅ **Value Transparency**: See both aliases and resolved values
- ✅ **Comprehensive Views**: All information in one place
- ✅ **Professional Layout**: Clean, organized presentation

### **Editor & Published Mode**
- ✅ **Works in Editor**: Can be added to any documentation page
- ✅ **Published Documentation**: Full functionality in rendered output
- ✅ **Consistent Experience**: Same features in both modes

## 🚀 Getting Started

1. **Add the Block**: In Supernova editor, add "Token List with References"
2. **Select Tokens**: Choose individual tokens or a token group
3. **Configure Display**: Choose variant, options, and styling
4. **Customize**: Set filtering, sorting, and reference style
5. **Preview**: See resolved values and references immediately

This enhanced token list block provides everything you need to create comprehensive, professional token documentation that shows the complete picture of your design system's token relationships and values!