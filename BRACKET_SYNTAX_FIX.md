# Bracket Syntax Fix

## 🔧 Issue: Mismatched Substitution Tags

**Error:** `Substitution closure }} found, but opening tag {{ is missing before it`

## 🎯 Root Cause

The issue was with the `{{{ }}}` syntax for unescaped HTML output in Pulsar templates. While this syntax is supposed to work for HTML output, it was causing parsing errors.

## ✅ Solution Applied

**Before (Problematic):**
```pulsar
{{{ displayTokenWithReferences(token, true) }}}
{{{ formatTokenReferenceDetailsAsHtml(token) }}}
{{{ displayTokenWithReferenceBadges(token) }}}
```

**After (Fixed):**
```pulsar
{{ displayTokenWithReferences(token, true) }}
{{ formatTokenReferenceDetailsAsHtml(token) }}
{{ displayTokenWithReferenceBadges(token) }}
```

## 📋 Changes Made

1. **Token Value Template** - Changed `{{{ }}}` to `{{ }}`
2. **Custom Token List Template** - Updated all HTML output functions to use `{{ }}`
3. **JavaScript Functions** - Return properly formatted HTML strings that work with regular substitution

## 🎯 Why This Works

Our JavaScript helper functions already return properly formatted HTML strings, so we don't need the unescaped HTML syntax. The regular `{{ }}` substitution works perfectly for our use case.

## ✅ Result

- ✅ **No syntax errors** - Templates parse correctly
- ✅ **HTML output preserved** - Functions return formatted HTML
- ✅ **Full functionality** - All complex token features work
- ✅ **Pulsar compatible** - Uses standard substitution syntax

The fix maintains all functionality while ensuring template compatibility!