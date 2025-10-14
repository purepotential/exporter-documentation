# Troubleshooting Template Issues

## What You Should See Now

After the latest changes and build, you should see:

### 1. Blue Test Boxes
- **Blue boxes** with "🔵 TABLE VARIANT WORKING - [token-name]" above each token row
- This confirms the table variant template is being used

### 2. Red Test Boxes  
- **Red boxes** with "🔴 TOKEN TEMPLATE IS WORKING - [token-name] ([token-type])" in the token value areas
- This confirms the token value template is being used

### 3. Reference Information
- Green/red status boxes showing if references are enabled
- Debug information showing token details
- Resolved values and reference names

## If You Don't See the Test Boxes

This indicates a template processing issue:

### Possible Causes:

1. **Template Caching**
   - The documentation system might be using cached templates
   - Try clearing any caches or republishing the documentation

2. **Template Path Issues**
   - The system might be looking for templates in a different location
   - Check if there are other template directories

3. **Build Process**
   - The .pr files might not be getting processed correctly
   - The build might only compile TypeScript/CSS but not templates

4. **Supernova Processing**
   - The templates might need to be processed by Supernova's system
   - This might not be a local build issue but a publishing issue

## Next Steps

### If You See the Test Boxes:
✅ Templates are working - we can proceed with the reference implementation

### If You Don't See the Test Boxes:
❌ Template processing issue - we need to:

1. **Check Template Processing**
   - Verify how .pr files are processed in your system
   - Check if templates need to be uploaded/published separately

2. **Check Documentation Publishing**
   - The changes might need to be published through Supernova
   - Local builds might only handle JS/CSS, not templates

3. **Verify Template Paths**
   - Ensure the template files are in the correct locations
   - Check if there are other template directories being used

## Template File Locations

The templates we've modified:
- `src/page_body/structure/blocks/tokens/values/page_block_token_value.pr`
- `src/page_body/structure/blocks/tokens/variants/page_block_token_variant_table_item.pr`

## What This Means for Token References

If templates aren't being processed:
- The TypeScript functions are compiled and available
- The configuration is set up correctly  
- But the template changes aren't being applied

This would explain why you're seeing the original token display (just "20px", "12px", etc.) without any of the reference information or debug output.

## Immediate Action

Please check if you see the blue and red test boxes after refreshing your documentation. This will tell us if the issue is:
- ✅ Templates working → Reference implementation issue
- ❌ Templates not working → Template processing issue