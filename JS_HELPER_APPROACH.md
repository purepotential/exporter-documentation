# JavaScript Helper Approach - Complex Token Support

## 🎯 Strategy: Move Complex Logic to JavaScript

Instead of using complex Pulsar template syntax, we've moved all the complex token reference logic into JavaScript helper functions in `tokens.ts`. This approach:

1. **Avoids Pulsar syntax limitations** - No `const`, ternary operators, or array operations in templates
2. **Leverages existing patterns** - Similar to how `typographyDescription()` and other functions work
3. **Maintains full functionality** - All complex token reference features are preserved
4. **Ensures compatibility** - Simple function calls from templates are always supported

## 🔧 Implementation Details

### **Core Helper Functions Added**

#### **1. Main Display Functions**
```typescript
displayTokenWithReferences(token: Token, showReferences: boolean): string
displayTokenValue(token: Token): string
```

#### **2. Token-Specific Display Functions**
```typescript
displayTypographyTokenWithReferences(token: TypographyToken): string
displayShadowTokenWithReferences(token: ShadowToken): string  
displayGradientTokenWithReferences(token: GradientToken): string
displayColorTokenWithReferences(token: ColorToken): string
displayDimensionTokenWithReferences(token: MeasureToken): string
displayStringTokenWithReferences(token: TextToken): string
```

#### **3. Reference Extraction Functions**
```typescript
getTypographyTokenReferences(token: TypographyToken): string[]
getShadowTokenReferences(token: ShadowToken): string[]
getGradientTokenReferences(token: GradientToken): string[]
```

#### **4. Utility Functions**
```typescript
getTokenReferenceSummary(token: Token): string
getTokenReferenceDetails(token: Token): string[]
tokenHasReferences(token: Token): boolean
getTokenReferenceCount(token: Token): number
```

#### **5. Layout-Specific Functions**
```typescript
formatTokenReferenceDetailsAsHtml(token: Token): string
displayTokenWithReferenceBadges(token: Token): string
displayTokenWithReferenceItems(token: Token): string
```

## 📋 Template Usage

### **Simple Token Value Template**
```pulsar
{[ let token = context /]}
{[ let showReferences = ds.blockConfigTokensShowReferences /]}

{[ if showReferences ]}
    {{{ displayTokenWithReferences(token, true) }}}
{[ else ]}
    <div class="token-value">{{ displayTokenValue(token) }}</div>
{[/]}
```

### **Custom Token List Template**
```pulsar
<td>
    {{ getTokenReferenceSummary(token) }}
    {{{ formatTokenReferenceDetailsAsHtml(token) }}}
</td>
```

**Key Points:**
- `{{ }}` for simple string output
- `{{{ }}}` for HTML output (unescaped)
- Only basic function calls, no complex logic

## 🎨 Generated HTML Output

### **Typography Token with References**
```html
<div class="typography-token">
    <div class="typography-main">Inter Bold 24px/1.5</div>
    <div class="typography-references">
        <span class="ref-item">Font: base-font-family</span>
        <span class="ref-item">Weight: bold-weight</span>
        <span class="ref-item">Size: heading-xl-size</span>
    </div>
</div>
```

### **Shadow Token with References**
```html
<div class="shadow-token">
    <div class="shadow-main">0px 2px 4px rgba(0,0,0,0.1)</div>
    <div class="shadow-references">
        <span class="ref-item">Shadow 1 Color: neutral-900</span>
    </div>
</div>
```

### **Reference Summary in Tables**
```html
<td>
    2 references
    <div class="reference-details">
        <div class="reference-item">Font: base-font-family</div>
        <div class="reference-item">Size: heading-size</div>
    </div>
</td>
```

## 🚀 Benefits of This Approach

### **1. Pulsar Compatibility**
- ✅ **No syntax errors** - Only simple function calls
- ✅ **Future-proof** - Won't break with Pulsar updates
- ✅ **Maintainable** - Easy to debug and modify

### **2. Full Functionality**
- ✅ **Complex token support** - Typography, Shadow, Gradient
- ✅ **Reference extraction** - All property references captured
- ✅ **Multiple layouts** - Table, Grid, Stack variants
- ✅ **Conditional display** - Show/hide references globally

### **3. Developer Experience**
- ✅ **TypeScript support** - Full type checking and IntelliSense
- ✅ **Reusable functions** - Can be used across multiple templates
- ✅ **Testable logic** - Complex logic can be unit tested
- ✅ **Performance** - Logic runs once in JavaScript, not in template

### **4. Extensibility**
- ✅ **Easy to enhance** - Add new token types or reference formats
- ✅ **Configurable output** - Different HTML structures for different layouts
- ✅ **Backward compatible** - Existing templates continue to work

## 📊 Function Reference

### **Main Display Functions**

| Function | Purpose | Returns |
|----------|---------|---------|
| `displayTokenWithReferences()` | Main function for token display with references | HTML string |
| `displayTokenValue()` | Basic token display without references | Plain string |
| `getTokenReferenceSummary()` | Short reference summary for tables | String |
| `getTokenReferenceDetails()` | Detailed reference list | String array |

### **Layout-Specific Functions**

| Function | Use Case | Output Format |
|----------|----------|---------------|
| `formatTokenReferenceDetailsAsHtml()` | Table cells | `<div class="reference-details">` |
| `displayTokenWithReferenceBadges()` | Grid cards | `<div class="reference-badges">` |
| `displayTokenWithReferenceItems()` | Stack layouts | `<div class="reference-list">` |

## 🎯 Usage Examples

### **Enable References Globally**
Set `blockConfigTokensShowReferences = true` in exporter configuration.

### **Typography Token Display**
```
Inter Bold 24px/1.5
Font: base-font-family | Weight: bold-weight | Size: heading-size
```

### **Shadow Token Display**
```
0px 2px 4px rgba(0,0,0,0.1), 0px 8px 16px rgba(0,0,0,0.05)
Shadow 1 Color: neutral-900 | Shadow 2 Color: neutral-800
```

### **Table Reference Summary**
```
Typography Token: "3 references"
Color Token: "primary-blue"
Dimension Token: "Base token"
```

## 🎉 Success!

This JavaScript helper approach provides:
- ✅ **Full complex token support** without Pulsar syntax issues
- ✅ **Clean, maintainable code** with proper separation of concerns
- ✅ **Excellent performance** with logic in compiled JavaScript
- ✅ **Future extensibility** for new token types and features
- ✅ **Complete compatibility** with the Pulsar template engine

The system now delivers all the complex token reference functionality while being robust, maintainable, and compatible with the template engine!