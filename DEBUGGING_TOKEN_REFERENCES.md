# Debugging Token References

## Current Status

I've implemented comprehensive token reference display functionality, but you're not seeing the references in text form. Here's what to check:

## 1. Configuration Check

The configuration should be enabled by default:
- `blockConfigTokensShowReferences: true`
- `blockConfigTokensReferenceStyle: "Simple name only"`

## 2. Debug Information Added

I've added debug information that will show:
- Whether references are enabled
- The token name and type
- Whether the token has a reference
- The referenced token ID and name

This debug info will appear as a gray box below each token value when references are enabled.

## 3. What You Should See

### If References Are Working:
- A green status box saying "✓ References enabled"
- Debug information showing token details
- For tokens with references: "Resolved: #ff0000" and "Reference: primary-color"
- The actual token value with " → reference-name" appended

### If References Are Not Working:
- A red status box saying "✗ References disabled"
- Debug info showing "Referenced Token ID: none"
- Only the resolved value without reference information

## 4. Possible Issues

### Issue 1: Tokens Don't Have References
Your tokens might not actually reference other tokens. In Supernova/Figma:
- Check if your color tokens are set up to reference other tokens
- Look for "alias" or "reference" settings in your design system
- Verify that tokens like "label" actually reference "bg" or other base tokens

### Issue 2: Configuration Not Applied
- The exporter configuration might not be applied
- Try toggling the "Token blocks: Show token references" setting in the exporter configuration
- Republish the documentation after changing settings

### Issue 3: Token Structure
The tokens might not have the expected structure:
- `token.value.referencedTokenId` should contain the ID of the referenced token
- `token.value.referencedToken` should contain the referenced token object

## 5. Testing Steps

1. **Check Debug Output**: Look for the debug information boxes
2. **Verify Configuration**: Ensure the green "References enabled" status appears
3. **Check Token Structure**: Look at the debug info to see if "Referenced Token ID" shows actual IDs
4. **Test with Known References**: Try with tokens you know reference others

## 6. Expected Display Format

When working correctly, you should see:

```
#ff0000 → primary-red

Resolved: #ff0000
Reference: primary-red
```

## 7. Next Steps

If you're still not seeing references:

1. **Check the debug output** - this will tell us exactly what's happening
2. **Verify your tokens have references** - in your design system, make sure tokens actually reference other tokens
3. **Check the configuration** - ensure the exporter settings are applied
4. **Look at the browser console** - there might be JavaScript errors preventing the functions from working

## 8. Remove Debug Information

Once we confirm it's working, I can remove the debug information and show only the clean reference display.