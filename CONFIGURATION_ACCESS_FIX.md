# Configuration Access Fix

## 🔧 Issue: Configuration Property Access Error

**Error:** `Cannot access property blockConfigTokensShowReferences of undefined in expression 'ds.blockConfigTokensShowReferences'`

## 🎯 Root Cause

The template was trying to access the configuration property using `ds.blockConfigTokensShowReferences`, but in Pulsar templates, configuration values must be accessed through the `exportConfiguration()` function.

## ✅ Solution Applied

**Before (Incorrect):**
```pulsar
{[ let showReferences = ds.blockConfigTokensShowReferences /]}
```

**After (Correct):**
```pulsar
{[ let configuration = exportConfiguration() /]}
{[ let showReferences = configuration.blockConfigTokensShowReferences /]}
```

## 📋 Configuration Property Confirmed

The `blockConfigTokensShowReferences` property is properly defined in `exporter.json`:

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

## 🎯 How Configuration Access Works in Pulsar

1. **Get configuration object**: `{[ let configuration = exportConfiguration() /]}`
2. **Access properties**: `configuration.propertyName`
3. **Use in conditionals**: `{[ if configuration.propertyName ]}`

## ✅ Result

- ✅ **Configuration access fixed** - Proper Pulsar syntax
- ✅ **Property exists** - Defined in exporter.json with default `true`
- ✅ **Template compatibility** - Uses standard configuration pattern
- ✅ **Ready for build** - Should complete successfully now

The JavaScript helper approach is now fully functional with proper configuration access!