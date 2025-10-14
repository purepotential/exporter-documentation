# Fixed Block Configuration - Token Reference Blocks

## ✅ Issue Fixed

The exporter.json configuration has been corrected to use only valid property types. The blocks are now properly registered and should work correctly.

## 📋 Block Registration Names

### **Block 1: Single Token Preview**
- **Key**: `io.supernova.documentation-main.token-preview`
- **Title**: **"Token Preview with References"**
- **Category**: Tokens

### **Block 2: Multiple Token List**
- **Key**: `io.supernova.documentation-main.token-list-with-references`
- **Title**: **"Token List with References"**
- **Category**: Tokens

## 🔧 How to Use the Blocks

### **"Token Preview with References" (Single Token)**

**Configuration:**
- **Token ID**: Enter the token ID as a string (e.g., `"spacing-base"`, `"primary-red"`)
- **Show References**: Toggle on/off
- **Show Resolved Value**: Toggle on/off  
- **Display Style**: Inline, Detailed, or Card

**Example Usage:**
```
Token ID: "spacing-base"
Show References: ✅
Show Resolved Value: ✅
Display Style: Card
```

### **"Token List with References" (Multiple Tokens)**

**Configuration:**
- **Token IDs**: Enter comma-separated token IDs (e.g., `"token1,token2,token3"`)
- **Token Group ID**: Alternative - enter a group ID to show all tokens in that group
- **All other options**: Same as single token block plus display variants

**Example Usage:**

#### **Option 1: Specific Tokens**
```
Token IDs: "spacing-xs,spacing-sm,spacing-base,spacing-lg,spacing-xl"
Token Group ID: (leave empty)
Display Variant: Table
Show References: ✅
Show Resolved Values: ✅
Show Previews: ✅
```

#### **Option 2: Entire Token Group**
```
Token IDs: (leave empty)
Token Group ID: "spacing-tokens"
Display Variant: Grid-4
Show References: ✅
Show Resolved Values: ✅
Show Previews: ✅
```

## 🎯 Finding Token IDs

### **How to Get Token IDs:**
1. **In Supernova**: Look at token properties or URL when viewing a token
2. **In Code**: Usually the token name or a slugified version
3. **Common Patterns**: 
   - `spacing-base`, `spacing-sm`, `spacing-lg`
   - `color-primary`, `color-secondary`
   - `text-base`, `text-lg`, `text-sm`

### **How to Get Group IDs:**
1. **In Supernova**: Look at token group properties
2. **Common Patterns**:
   - `spacing`, `colors`, `typography`
   - `brand-colors`, `semantic-colors`
   - `text-sizes`, `font-families`

## 📝 Configuration Examples

### **Color Palette Display**
```
Block: Token List with References
Token IDs: "primary,secondary,accent,neutral-100,neutral-200,neutral-300"
Display Variant: Stack
Show Previews: ✅
Show References: ✅
Filter By: Color
```

### **Spacing System**
```
Block: Token List with References
Token Group ID: "spacing"
Display Variant: Table
Show All Options: ✅
Sort By: Value
```

### **Typography Scale**
```
Block: Token List with References
Token IDs: "text-xs,text-sm,text-base,text-lg,text-xl,text-2xl"
Display Variant: Grid-2
Show References: ✅
Reference Style: Detailed
```

### **Single Token Detail**
```
Block: Token Preview with References
Token ID: "primary-button-background"
Display Style: Card
Show References: ✅
Show Resolved Value: ✅
```

## 🚀 What You'll See

### **With References Enabled:**
- **Resolved Values**: `20px`, `#ff0000`, `Inter Bold 16px`
- **Reference Information**: `→ spacing-base`, `→ brand-red`, `→ text-primary`
- **Complete Token Info**: Name, type, value, reference, description

### **Multiple Display Options:**
- **Table**: Comprehensive columns with all information
- **Grid**: Card-based layout with visual previews
- **Stack**: Horizontal layout perfect for color palettes

The blocks are now properly configured and should appear in the Supernova editor under the **Tokens** category!