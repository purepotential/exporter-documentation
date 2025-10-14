// Example usage of token reference functionality

import {
  displayTokenWithReference,
  getColorTokenReference,
  getMeasureTokenReference,
  getTextTokenReference,
  getComplexTokenReferences,
  formatReferenceList,
  createSimpleTokenReference,
  createDetailedTokenReference,
  formatTokenValueWithReference,
  hasTokenValueReference
} from '../doc_functionality/tokens'

// Example: Display a color token with its reference
function displayColorTokenExample(colorToken: ColorToken) {
  // Basic display with reference
  const colorWithRef = displayTokenWithReference(colorToken, { showReference: true })
  console.log(`Color: ${colorWithRef}`)
  
  // Just get the reference name
  const refName = getColorTokenReference(colorToken.value)
  if (refName) {
    console.log(`References: ${refName}`)
  }
}

// Example: Display a typography token with all its references
function displayTypographyTokenExample(typographyToken: TypographyToken) {
  // Display with reference
  const typographyWithRef = displayTokenWithReference(typographyToken, { showReference: true })
  console.log(`Typography: ${typographyWithRef}`)
  
  // Get all individual references
  const allRefs = getComplexTokenReferences(typographyToken)
  if (allRefs.length > 0) {
    console.log(`All references: ${formatReferenceList(allRefs)}`)
  }
}

// Example: Display a measure token with reference
function displayMeasureTokenExample(measureToken: MeasureToken) {
  const measureWithRef = displayTokenWithReference(measureToken, { showReference: true })
  console.log(`Measure: ${measureWithRef}`)
  
  // Check if it has a reference
  if (hasTokenValueReference(measureToken.value)) {
    const refName = getMeasureTokenReference(measureToken.value)
    console.log(`This token references: ${refName}`)
  }
}

// Example: Custom reference display
function customReferenceDisplay(token: Token) {
  const resolvedValue = displayTokenWithReference(token, { showReference: false })
  
  // Create custom reference display based on token type
  switch (token.tokenType) {
    case "Color":
      const colorToken = token as ColorToken
      const colorRef = getColorTokenReference(colorToken.value)
      if (colorRef) {
        return `${resolvedValue} ${createDetailedTokenReference(`colors/${colorRef}`)}`
      }
      break
      
    case "Typography":
      const typographyToken = token as TypographyToken
      const allRefs = getComplexTokenReferences(typographyToken)
      if (allRefs.length > 0) {
        return `${resolvedValue} ${formatReferenceList(allRefs)}`
      }
      break
      
    default:
      // For other token types, use simple reference display
      const simpleRef = displayTokenWithReference(token, { showReference: true })
      return simpleRef
  }
  
  return resolvedValue
}

// Example: Batch processing tokens with references
function processTokensWithReferences(tokens: Token[], showReferences: boolean = true) {
  return tokens.map(token => ({
    name: token.name,
    type: token.tokenType,
    value: displayTokenWithReference(token, { showReference: showReferences }),
    hasReference: hasTokenValueReference((token as any).value),
    references: getComplexTokenReferences(token)
  }))
}

export {
  displayColorTokenExample,
  displayTypographyTokenExample,
  displayMeasureTokenExample,
  customReferenceDisplay,
  processTokensWithReferences
}