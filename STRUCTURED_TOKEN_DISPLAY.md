# Structured Token Display Format

## ✅ New Token Display Structure

I've completely restructured the default token value display to show information in a clean, organized format as requested.

## 🎯 New Display Format

### **Structure:**
```
[Token Swatch/Preview]

Token Name: bg

Reference: surface
Value: #fefefe

Description: Card background color for homescreen
```

### **Layout:**
1. **Token Name** - Displayed above (handled by existing templates)
2. **Reference Line** - Shows what token this references (if any)
3. **Resolved Value Line** - Shows the actual computed value
4. **Description** - Token description with visual separation

## 📋 Display Examples

### **Color Token with Reference:**
```
bg
Reference: surface
Value: #fefefe
Description: Card background color
```

### **Color Token without Reference (Base Token):**
```
primary-red
Value: #ff0000
Description: Primary brand color
```

### **Dimension Token with Reference:**
```
padding-h
Reference: spacing-base
Value: 20px
Description: Top bar header padding
```

### **Typography Token with Multiple References:**
```
heading-large
Reference: Font: Inter, Weight: Bold, Size: text-xl
Value: Inter Bold 24px/32px
Description: Large heading style
```

### **Font Token:**
```
font-primary
Reference: Font: Inter, Weight: Regular
Value: Inter Regular
Description: Primary font family
```

## 🎨 Visual Styling

### **Reference Line:**
- **Label**: "REFERENCE:" (uppercase, secondary color)
- **Value**: Blue accent color, monospace font
- **Shows only when**: Token has references AND references are enabled

### **Resolved Value Line:**
- **Label**: "VALUE:" (uppercase, secondary color)  
- **Value**: Primary text color, monospace font
- **Always shows**: The actual computed value

### **Description:**
- **Styling**: Italic, secondary color
- **Separation**: Top border to separate from values
- **Shows only when**: Token has description

## ⚙️ Configuration Control

### **Global Setting:**
- `blockConfigTokensShowReferences = true` → Shows reference lines
- `blockConfigTokensShowReferences = false` → Hides reference lines, shows only resolved values

### **Responsive Design:**
- **Desktop**: Reference and Value labels aligned to the left
- **Mobile**: Labels stack above values for better readability

## 🔧 Technical Implementation

### **Template Changes:**
- Completely restructured `page_block_token_value.pr`
- Extracts reference and resolved values separately
- Creates structured HTML with proper CSS classes

### **CSS Classes:**
- `.token-value-structured` - Main container
- `.token-reference-line` - Reference information row
- `.token-resolved-line` - Resolved value row  
- `.token-description-line` - Description section
- `.token-reference-value` - Reference value styling
- `.token-resolved-value` - Resolved value styling

### **Token Type Support:**
- ✅ **Color**: Reference + hex/rgb value
- ✅ **Dimension**: Reference + px/rem/etc value
- ✅ **Typography**: Multiple references + formatted description
- ✅ **Font**: Font family + weight references
- ✅ **Border**: Width + color references
- ✅ **Shadow**: Shadow description
- ✅ **Gradient**: Gradient description
- ✅ **String/Text**: Reference + text value
- ✅ **Opacity**: Reference + percentage

## 🎉 Result

Now your token blocks will display:

1. **Clean Structure**: Each piece of information on its own line
2. **Clear Labels**: "Reference:" and "Value:" labels for clarity
3. **Visual Hierarchy**: Different styling for different types of information
4. **Space for Description**: Proper spacing and styling for token descriptions
5. **Responsive**: Works well on all screen sizes

The token display is now much more organized and informative, showing both what a token references and its resolved value in a clear, structured format!