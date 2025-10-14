// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Tokens

/**  Convert group into properly formatted header */
export function fullTokenGroupName(tokenGroup: TokenGroup) {
  // Retrieve token group path
  return [...tokenGroup.path, tokenGroup.name].join("/")
}

/**  Convert group into properly formatted header */
export function formattedTokenGroupHeader(tokenGroup: TokenGroup, showSubpath: boolean) {
  // Return false if the group is root
  if (tokenGroup.isRoot) {
    return false
  }

  // Retrieve token group either including or not including the path to the group
  if (tokenGroup.path.length > 0 && showSubpath) {
    let light = tokenGroup.path.join(" / ")
    let dark = tokenGroup.name
    return `<span class="light">${light} / </span>${dark}`
  } else {
    return tokenGroup.name
  }
}

/** Describe complex gradient token */
export function gradientDescription(gradientToken: GradientToken) {
  // Describe gradient as (type) (stop1, stop2 ...) for each gradient layer
  return gradientToken.value.map(gradient => {
    let type = `${gradient.type} Gradient`
    let stops = gradient.stops
      .map((stop) => {
        return `${tokenValueToHex(stop.color)}, ${(stop.position * 100).toFixed(2)}%`
      })
      .join(", ")

    return `${type}, ${stops})`
  }).join(" + ")
}

/** Describe complex gradient value as token */
export function gradientTokenValue(gradientToken: GradientToken) {

  let gradientTypes = gradientToken.value.map(gradient => {
    let gradientType = ""

    switch (gradient.type) {
      case "Linear":
        // calculate the gradient angle
        const deltaX = Math.round((gradient.to.x - gradient.from.x) * 100);
        const deltaY = Math.round((gradient.to.y - gradient.from.y) * 100);

        // adding 90 to move the angle to the correct position
        // todo: take into account the direction of the gradient and position of the each stop
        const angle = Math.round(Math.atan2(deltaY, deltaX) * (180 / Math.PI)) + 90;

        gradientType = `linear-gradient(${angle}deg, `
        break
      case "Radial":
        gradientType = "radial-gradient(circle, "
        break
      case "Angular":
        gradientType = "conic-gradient("
        break
    }

    // Describe gradient as (type) (stop1, stop2 ...)
    // Example: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
    let stops = gradient.stops
      .map((stop) => {
        return `${tokenValueToHex(stop.color)} ${(stop.position * 100).toFixed(2)}%`
      })
      .join(", ")

    return `${gradientType}${stops})`
  }).join(", ")

  return gradientTypes
}

/** Describe complex shadow token */
export function shadowDescription(shadowToken: ShadowToken) {

  let connectedShadow = shadowToken.value?.reverse().map((shadow) => {
    return shadowTokenValue(shadow)
  })
    .join(", ")


  return connectedShadow
}

/** Convert complex shadow value to CSS representation */
export function shadowTokenValue(shadowToken: ShadowTokenValue): string {

  var blurRadius = getValueWithPixels(nonNegativeValue(shadowToken.radius));
  var offsetX = getValueWithPixels(shadowToken.x);
  var offsetY = getValueWithPixels(shadowToken.y);
  var spreadRadius = getValueWithPixels(shadowToken.spread);

  return `${shadowToken.type === "Inner" ? "inset " : ""}${offsetX} ${offsetY} ${blurRadius} ${spreadRadius} ${getFormattedColor(shadowToken.color, true, shadowToken.opacity)}`
}


export function getFormattedColor(colorValue: ColorTokenValue, forceRgbFormat: boolean = false, customOpacity: MeasureTokenValue | null = null, showReference: boolean = false): string {
  // Use custom opacity if provided, otherwise use color value's opacity
  const opacity = customOpacity?.measure ?? colorValue.opacity.measure;

  let colorString: string;
  if (opacity === 1) {
    if (forceRgbFormat) {
      colorString = `rgb(${colorValue.color.r},${colorValue.color.g},${colorValue.color.b})`
    } else {
      // return as hex by default
      colorString = rgbToHex(colorValue.color.r, colorValue.color.g, colorValue.color.b)
    }
  } else {
    colorString = `rgba(${colorValue.color.r},${colorValue.color.g},${colorValue.color.b},${Number(opacity.toFixed(2))})`
  }

  // Add reference if requested and available
  if (showReference) {
    const reference = getColorTokenReference(colorValue)
    if (reference) {
      return `${colorString} <span class="token-reference">(${reference})</span>`
    }
  }

  return colorString
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/** Convert token value to 6-digit hex, or 8-hex when there is lower opacity */
export function tokenValueToHex(tokenValue: ColorTokenValue) {
  // Handle undefined/invalid token value
  if (!tokenValue || !tokenValue.color) {
    return '';
  }

  const { r, g, b } = tokenValue.color;
  const opacity = tokenValue.opacity?.measure;

  // Convert RGB to 6-digit hex
  const hex = rgbToHex(r, g, b).toLowerCase();

  // If opacity is 1 or undefined, return 6-digit hex
  if (opacity === 1) {
    return hex;
  }

  // Convert opacity to 2-digit hex and append to create 8-digit hex
  const alphaHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${hex}${alphaHex}`;
}


/** Describe complex shadow token */
export function typographyDescription(typographyToken: TypographyToken) {
  let value = typographyToken.value
  let fontName = `${value.fontFamily.text} ${value.fontWeight.text}`
  let fontValue = `${value.fontSize.measure}${measureTypeIntoReadableUnit(value.fontSize.unit)}`
  let lineHeightValue = value.lineHeight?.measure ? `/${value.lineHeight.measure}${measureTypeIntoReadableUnit(value.lineHeight.unit)}` : '';
  let textDecoration: string = ""
  let textCase: string = ""
  if (value.textDecoration.value !== null && value.textDecoration.value !== "None") {
    textDecoration = `, ${value.textDecoration.value.toLowerCase()}`
  }
  if (value.textCase.value !== null && value.textCase.value !== "Original") {
    textCase = `, ${convertTextCaseToTextTransform(value.textCase.value)}`
  }

  return `${fontName} ${fontValue}${lineHeightValue}${textDecoration}${textCase}`
}

function getValueWithPixels(value: number, forceUnit?: boolean): string {
  if (value === 0 && forceUnit !== true) {
    return `${value}`
  } else {
    return `${value}px`
  }
}

export function measureValueToReadableUnit(value: MeasureTokenValue, showReference: boolean = false) {
  const measureString = `${value.measure}${measureTypeIntoReadableUnit(value.unit)}`

  // Add reference if requested and available
  if (showReference) {
    const reference = getMeasureTokenReference(value)
    if (reference) {
      return `${measureString} <span class="token-reference">(${reference})</span>`
    }
  }

  return measureString
}

function nonNegativeValue(num: number) {
  if (num <= 0) {
    return 0
  } else {
    return num
  }
}

/** Convert type to CSS unit */
export function measureTypeIntoReadableUnit(type: Unit): string {

  switch (type) {
    case "Points":
      return "pt"
    case "Pixels":
      return "px"
    case "Percent":
      return "%"
    case "Ems":
      return "em"
    case "Rem":
      return "rem"
    case "Ms":
      return "ms"
    case "Raw":
      return ""
  }
}

/** Convert textCase to CSS text transform */
export function convertTextCaseToTextTransform(textCase: TextCase, includeCSSPropertyName: boolean = false): string {
  let value: string;
  let property: string;

  switch (textCase) {
    case "Upper":
      value = "uppercase"
      property = "text-transform"
      break
    case "Lower":
      value = "lowercase"
      property = "text-transform"
      break
    case "Camel":
      value = "capitalize"
      property = "text-transform"
      break
    case "SmallCaps":
      value = "small-caps"
      property = "font-variant"
      break
    case "Original":
      value = "none"
      property = "text-transform"
      break
    default:
      value = "none"
      property = "text-transform"
      break
  }

  return includeCSSPropertyName ? `${property}: ${value}` : value
}

/** Convert textCase to CSS text transform */
export function convertTextDecorationToCSS(textDecoration: TextDecoration): string {

  switch (textDecoration) {
    case "Underline":
      return "underline"
    case "Strikethrough":
      return "line-through"
    default:
      return "none"
  }
}

/** Convert subfamily to CSS font weight */
export function convertSubfamilyToFontWeight(subfamily: string): string {

  switch (subfamily.toLowerCase()) {
    case "thin":
      return "100"
    case "extralight":
      return "200"
    case "light":
      return "300"
    case "regular":
      return "400"
    case "medium":
      return "500"
    case "semibold":
      return "600"
    case "bold":
      return "700"
    case "extrabold":
      return "800"
    case "black":
      return "900"
    default:
      return subfamily
  }
}

export function extendFontFamily(fontFamily: string) {
  return fontFamily.includes(" ")
    ? `'${fontFamily}', '${fontFamily.replace(" ", "")}', Inter, sans-serif`
    : `'${fontFamily}', Inter, sans-serif`;
}

/** Scale token values so they are still okay in smaller previews */
export function convertTypographyTokenToCSS(typographyToken: TypographyToken, maxFontSize: boolean = false): string {

  let fontFamily = typographyToken.value.fontFamily.text;
  let fontSize = normalizeFontSizeCSS(typographyToken.value.fontSize, maxFontSize);
  let textCase = convertTextCaseToTextTransform(typographyToken.value.textCase.value, true);
  let fontWeight = convertSubfamilyToFontWeight(typographyToken.value.fontWeight.text);
  let textDecorationCSS = convertTextDecorationToCSS(typographyToken.value.textDecoration.value);
  let extendedFontFamily = extendFontFamily(fontFamily);

  return `font-family: ${extendedFontFamily}; font-weight: ${fontWeight}; font-size: ${fontSize}; text-decoration: ${textDecorationCSS}; ${textCase};`
}

export function normalizeFontSizeCSS(fontSize: MeasureTokenValue, maxFontSize: boolean = false) {
  let fontSizeMeasure = fontSize.measure;
  const remBase = 16;

  if (maxFontSize === true) {
    const actualSize = fontSize.unit === "Rem" ? fontSize.measure * remBase : fontSize.measure;
    if (actualSize > 24) {
      fontSizeMeasure = fontSize.unit === "Rem" ? 24 / remBase : 24;
    }
  }

  return `${fontSizeMeasure}${measureTypeIntoReadableUnit(fontSize.unit)}`;
}

/** Get color value from settings option */
export function getColorValueFromSettings(value: string | null, alias: ColorToken | null): string | null {
  if (value !== null) {
    return value;
  } else if (alias !== null) {
    return `${tokenValueToHex(alias.value)}`;
  } else {
    return null;
  }
}

/*
Return themedToken if non-empty, otherwise return token value 
*/
export function safeToken(themedToken: Token[], token: Token) {
  return themedToken[0] ?? token
}


/*
 Return CSS value for border style
*/
export function getBorderStyleValue(borderStyle: BorderStyle): string {
  return borderStyle?.toLowerCase() ?? "solid"
}

/** Check if the token is in part of dimension token group */
export function isDimensionToken(tokenType: TokenType): boolean {
  return (
    tokenType === "BorderRadius" ||
    tokenType === "BorderWidth" ||
    tokenType === "Dimension" || // Generic dimension in product
    tokenType === "Duration" ||
    tokenType === "FontSize" ||
    tokenType === "LetterSpacing" ||
    tokenType === "LineHeight" ||
    tokenType === "Opacity" ||
    tokenType === "ParagraphSpacing" ||
    tokenType === "Size" ||
    tokenType === "Space" ||
    tokenType === "ZIndex"
  )
}

/** Check if the token is in part of string token group */
export function isStringToken(tokenType: TokenType): boolean {
  return (
    tokenType === "ProductCopy" ||
    tokenType === "String" ||
    tokenType === "FontFamily" ||
    tokenType === "FontWeight"
  )
}
/** Check if the token is in part of string options group */
export function isOptionsToken(tokenType: TokenType): boolean {
  return (
    tokenType === "TextDecoration" ||
    tokenType === "TextCase" ||
    tokenType === "Visibility"
  )
}

/* Converts decimal opacity to percentage */
export function decimalOpacityToPercentage(token: MeasureTokenValue): string {
  return `${Math.round(token.measure * 100)}%`
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token References

/** Get the token reference name from token value if it exists */
export function getTokenValueReference(tokenValue: any): string | null {
  if (tokenValue.referencedTokenId && tokenValue.referencedToken) {
    return tokenValue.referencedToken.name
  }
  return null
}

/** Get the full token reference path from token value if it exists */
export function getTokenValueReferencePath(tokenValue: any, tokenGroups?: TokenGroup[]): string | null {
  if (!tokenValue.referencedTokenId || !tokenValue.referencedToken) {
    return null
  }

  // If we have token groups, try to find the full path
  if (tokenGroups) {
    const referencedToken = findTokenInGroups(tokenValue.referencedTokenId, tokenGroups)
    if (referencedToken?.group) {
      const groupPath = [...referencedToken.group.path, referencedToken.group.name].join('/')
      return `${groupPath}/${tokenValue.referencedToken.name}`
    }
  }

  return tokenValue.referencedToken.name
}

/** Helper function to find a token in token groups */
function findTokenInGroups(tokenId: string, tokenGroups: TokenGroup[]): { token: Token, group: TokenGroup } | null {
  for (const group of tokenGroups) {
    // Check if token is in current group's children
    if (group.childrenIds.includes(tokenId)) {
      // This is a simplified approach - in a real implementation you'd need access to the actual tokens
      return null
    }

    // Recursively check subgroups
    const found = findTokenInGroups(tokenId, group.subgroups)
    if (found) {
      return found
    }
  }
  return null
}

/** Format token value with reference display */
export function formatTokenValueWithReference(
  tokenValue: any,
  resolvedValue: string,
  showReference: boolean = true,
  tokenGroups?: TokenGroup[]
): string {
  if (!showReference) {
    return resolvedValue
  }

  const reference = getTokenValueReferencePath(tokenValue, tokenGroups) || getTokenValueReference(tokenValue)

  if (reference) {
    return `${resolvedValue} <span class="token-reference">(${reference})</span>`
  }

  return resolvedValue
}

/** Check if a token value has a reference */
export function hasTokenValueReference(tokenValue: any): boolean {
  return !!(tokenValue.referencedTokenId && tokenValue.referencedToken)
}

/** Get token reference for specific token value types with full path */
export function getColorTokenReference(colorValue: ColorTokenValue, ds?: any): string | null {
  if (colorValue.referencedTokenId && colorValue.referencedToken) {
    return getTokenReferenceWithGroup(colorValue.referencedToken, colorValue.referencedTokenId, ds)
  }
  return null
}

export function getMeasureTokenReference(measureValue: MeasureTokenValue, ds?: any): string | null {
  if (measureValue.referencedTokenId && measureValue.referencedToken) {
    return getTokenReferenceWithGroup(measureValue.referencedToken, measureValue.referencedTokenId, ds)
  }
  return null
}

export function getTextTokenReference(textValue: TextTokenValue, ds?: any): string | null {
  if (textValue.referencedTokenId && textValue.referencedToken) {
    return getTokenReferenceWithGroup(textValue.referencedToken, textValue.referencedTokenId, ds)
  }
  return null
}

/** Get token reference with proper group hierarchy from design system */
export function getTokenReferenceWithGroup(token: Token, tokenId: string, ds?: any): string {
  // Debug: log what we have
  console.log('getTokenReferenceWithGroup called with:', {
    tokenName: token?.name,
    tokenId: tokenId,
    hasDs: !!ds,
    dsKeys: ds ? Object.keys(ds) : []
  })
  
  // If we have access to the design system, try to get the actual token group
  if (ds && token && tokenId) {
    try {
      // Try to get all token groups
      const tokenGroups = ds.tokenGroups ? ds.tokenGroups() : null
      console.log('Token groups available:', !!tokenGroups)
      
      if (tokenGroups) {
        const tokenGroup = findTokenGroupByTokenId(tokenId, tokenGroups)
        if (tokenGroup) {
          const groupPath = buildTokenGroupPath(tokenGroup)
          const result = groupPath ? `${groupPath}/${token.name}` : token.name
          console.log('Found group path:', result)
          return result
        }
      }
      
      // Alternative: try to get the token directly and check its properties
      const fullToken = ds.tokenById ? ds.tokenById(tokenId) : null
      console.log('Full token from ds.tokenById:', fullToken ? 'found' : 'not found')
      
      if (fullToken && fullToken.parent) {
        // If the token has a parent property, try to build path from it
        const parentPath = getTokenParentPath(fullToken.parent)
        const result = parentPath ? `${parentPath}/${token.name}` : token.name
        console.log('Found parent path:', result)
        return result
      }
      
    } catch (error) {
      // Fallback if design system access fails
      console.warn('Could not access token groups from design system:', error)
    }
  }

  // Fallback to the previous path detection method
  console.log('Using fallback path detection')
  return getFullTokenPath(token)
}

/** Get the path from a token's parent hierarchy */
function getTokenParentPath(parent: any): string | null {
  if (!parent) return null
  
  const pathParts: string[] = []
  let current = parent
  
  // Walk up the parent chain
  while (current && !current.isRoot) {
    if (current.name) {
      pathParts.unshift(current.name)
    }
    current = current.parent
  }
  
  return pathParts.length > 0 ? pathParts.join('/') : null
}

/** Find the token group that contains a specific token ID */
function findTokenGroupByTokenId(tokenId: string, tokenGroups: TokenGroup[]): TokenGroup | null {
  // Debug: log what we're working with
  console.log('Searching for token ID:', tokenId)
  console.log('Available token groups:', tokenGroups.map(g => ({ name: g.name, childrenCount: g.childrenIds?.length || 0 })))
  
  for (const group of tokenGroups) {
    // Check if token is directly in this group
    if (group.childrenIds && group.childrenIds.includes(tokenId)) {
      console.log('Found token in group:', group.name)
      return group
    }

    // Recursively check subgroups
    if (group.subgroups && group.subgroups.length > 0) {
      const found = findTokenGroupByTokenId(tokenId, group.subgroups)
      if (found) {
        return found
      }
    }
  }
  
  console.log('Token not found in any group')
  return null
}

/** Build the full path of a token group including parent hierarchy */
function buildTokenGroupPath(tokenGroup: TokenGroup): string {
  const pathParts: string[] = []

  // Add parent path if exists
  if (tokenGroup.path && tokenGroup.path.length > 0) {
    pathParts.push(...tokenGroup.path)
  }

  // Add current group name if not root
  if (!tokenGroup.isRoot && tokenGroup.name) {
    pathParts.push(tokenGroup.name)
  }

  return pathParts.join('/')
}

/** Get the full path of a token including its group hierarchy */
export function getFullTokenPath(token: Token): string {
  // Try to extract group information from token name if it contains slashes
  // Many design systems use naming conventions like "general/surface" or "colors/primary/500"
  if (token.name.includes('/')) {
    return token.name
  }

  // Try to get group information from token ID or other properties
  // Token IDs often contain group information
  if (token.id && token.id !== token.name) {
    // Check for different separators in ID
    if (token.id.includes('.')) {
      // Convert dot notation to slash notation (e.g., "general.surface" -> "general/surface")
      return token.id.replace(/\./g, '/')
    }

    // Check for slash separators in ID
    if (token.id.includes('/')) {
      return token.id
    }

    // Check for dash separators that might indicate grouping
    if (token.id.includes('-')) {
      // Convert dashes to slashes for common naming patterns like "general-surface"
      return token.id.replace(/-/g, '/')
    }
  }

  // Infer group from token type and name patterns
  // Based on common design token naming conventions
  const tokenType = token.tokenType.toLowerCase()

  // Map token types to likely group names
  const typeToGroup: { [key: string]: string } = {
    'color': 'colors',
    'dimension': 'spacing',
    'space': 'spacing',
    'size': 'sizing',
    'borderradius': 'radius',
    'borderwidth': 'borders',
    'fontsize': 'typography',
    'fontfamily': 'typography',
    'fontweight': 'typography',
    'lineheight': 'typography',
    'letterspacing': 'typography',
    'opacity': 'effects',
    'shadow': 'effects',
    'blur': 'effects'
  }

  // Try to get group from token type
  const inferredGroup = typeToGroup[tokenType]
  if (inferredGroup) {
    return `${inferredGroup}/${token.name}`
  }

  // For color tokens, try to infer semantic grouping
  if (tokenType === 'color') {
    if (token.name.includes('surface') || token.name.includes('background') || token.name.includes('bg')) {
      return `colors/surface/${token.name}`
    }
    if (token.name.includes('text') || token.name.includes('on-')) {
      return `colors/text/${token.name}`
    }
    if (token.name.includes('primary') || token.name.includes('secondary') || token.name.includes('accent')) {
      return `colors/brand/${token.name}`
    }
    return `colors/${token.name}`
  }

  // For spacing tokens with patterns like "spacing-4"
  if (token.name.includes('spacing') || token.name.includes('gap') || token.name.includes('padding') || token.name.includes('margin')) {
    return `spacing/${token.name}`
  }

  // Fallback: return just the token name
  return token.name
}

/** Enhanced function to get token reference with group context from design system */
export function getTokenReferenceWithContext(tokenValue: any, ds?: any): string | null {
  if (!tokenValue.referencedTokenId || !tokenValue.referencedToken) {
    return null
  }

  const referencedToken = tokenValue.referencedToken

  // If we have access to the design system, try to get the full context
  if (ds && ds.tokenGroups) {
    const tokenGroup = findTokenGroup(referencedToken.id, ds.tokenGroups())
    if (tokenGroup) {
      const groupPath = getTokenGroupFullPath(tokenGroup)
      return groupPath ? `${groupPath}/${referencedToken.name}` : referencedToken.name
    }
  }

  // Fallback to the basic path extraction
  return getFullTokenPath(referencedToken)
}

/** Find the token group that contains a specific token */
function findTokenGroup(tokenId: string, tokenGroups: TokenGroup[]): TokenGroup | null {
  for (const group of tokenGroups) {
    // Check if token is in current group
    if (group.childrenIds && group.childrenIds.includes(tokenId)) {
      return group
    }

    // Recursively check subgroups
    if (group.subgroups && group.subgroups.length > 0) {
      const found = findTokenGroup(tokenId, group.subgroups)
      if (found) {
        return found
      }
    }
  }
  return null
}

/** Get the full path of a token group including parent hierarchy */
function getTokenGroupFullPath(tokenGroup: TokenGroup): string {
  const pathParts: string[] = []

  // Add parent path if exists
  if (tokenGroup.path && tokenGroup.path.length > 0) {
    pathParts.push(...tokenGroup.path)
  }

  // Add current group name if not root
  if (!tokenGroup.isRoot && tokenGroup.name) {
    pathParts.push(tokenGroup.name)
  }

  return pathParts.join('/')
}

/** Main function to display any token with its resolved value and optional reference */
export function displayTokenWithReference(token: Token, options: {
  showReference?: boolean
  tokenGroups?: TokenGroup[]
  maxFontSize?: boolean
  forceRgbFormat?: boolean
} = {}): string {
  const { showReference = true, tokenGroups, maxFontSize = false, forceRgbFormat = false } = options

  let resolvedValue: string

  // Get the resolved value based on token type
  switch (token.tokenType) {
    case "Color":
      const colorToken = token as ColorToken
      resolvedValue = getFormattedColor(colorToken.value, forceRgbFormat, null, showReference)
      break

    case "Typography":
      const typographyToken = token as TypographyToken
      resolvedValue = typographyDescription(typographyToken)
      // Add reference for typography token if available
      if (showReference) {
        resolvedValue = formatTokenValueWithReference(typographyToken.value, resolvedValue, showReference, tokenGroups)
      }
      break

    case "Shadow":
      const shadowToken = token as ShadowToken
      resolvedValue = shadowDescription(shadowToken)
      break

    case "Gradient":
      const gradientToken = token as GradientToken
      resolvedValue = gradientDescription(gradientToken)
      break

    case "BorderRadius":
    case "BorderWidth":
    case "Dimension":
    case "Duration":
    case "FontSize":
    case "LetterSpacing":
    case "LineHeight":
    case "Opacity":
    case "ParagraphSpacing":
    case "Size":
    case "Space":
    case "ZIndex":
      const measureToken = token as MeasureToken
      resolvedValue = measureValueToReadableUnit(measureToken.value, showReference)
      break

    case "ProductCopy":
    case "String":
    case "FontFamily":
    case "FontWeight":
      const textToken = token as TextToken
      resolvedValue = textToken.value.text
      if (showReference) {
        const reference = getTextTokenReference(textToken.value)
        if (reference) {
          resolvedValue = `${resolvedValue} <span class="token-reference">(${reference})</span>`
        }
      }
      break

    default:
      resolvedValue = "Unsupported token type"
  }

  return resolvedValue
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Reference Utilities

/** Create a simple token reference display (just the name) */
export function createSimpleTokenReference(referenceName: string): string {
  return `<span class="token-reference">${referenceName}</span>`
}

/** Create a detailed token reference display with path */
export function createDetailedTokenReference(referencePath: string): string {
  return `<span class="token-reference-path">${referencePath}</span>`
}

/** Get all references from a complex token (like typography with multiple referenced values) */
export function getComplexTokenReferences(token: Token): string[] {
  const references: string[] = []

  switch (token.tokenType) {
    case "Typography":
      const typographyToken = token as TypographyToken
      const fontFamilyRef = getTextTokenReference(typographyToken.value.fontFamily)
      const fontWeightRef = getTextTokenReference(typographyToken.value.fontWeight)
      const fontSizeRef = getMeasureTokenReference(typographyToken.value.fontSize)
      const lineHeightRef = typographyToken.value.lineHeight ? getMeasureTokenReference(typographyToken.value.lineHeight) : null
      const letterSpacingRef = getMeasureTokenReference(typographyToken.value.letterSpacing)
      const paragraphSpacingRef = getMeasureTokenReference(typographyToken.value.paragraphSpacing)

      if (fontFamilyRef) references.push(`Font Family: ${fontFamilyRef}`)
      if (fontWeightRef) references.push(`Font Weight: ${fontWeightRef}`)
      if (fontSizeRef) references.push(`Font Size: ${fontSizeRef}`)
      if (lineHeightRef) references.push(`Line Height: ${lineHeightRef}`)
      if (letterSpacingRef) references.push(`Letter Spacing: ${letterSpacingRef}`)
      if (paragraphSpacingRef) references.push(`Paragraph Spacing: ${paragraphSpacingRef}`)
      break

    case "Color":
      const colorToken = token as ColorToken
      const colorRef = getColorTokenReference(colorToken.value)
      // Note: opacity in ColorTokenValue has different structure than MeasureTokenValue
      const opacityRef = colorToken.value.opacity.referencedToken?.name

      if (colorRef) references.push(`Color: ${colorRef}`)
      if (opacityRef) references.push(`Opacity: ${opacityRef}`)
      break

    case "Shadow":
      const shadowToken = token as ShadowToken
      shadowToken.value.forEach((shadow, index) => {
        const colorRef = getColorTokenReference(shadow.color)
        if (colorRef) references.push(`Shadow ${index + 1} Color: ${colorRef}`)
      })
      break
  }

  return references
}

/** Format multiple references as a readable list */
export function formatReferenceList(references: string[]): string {
  if (references.length === 0) return ""
  if (references.length === 1) return `<span class="token-references">(${references[0]})</span>`

  const formattedRefs = references.map(ref => `<li>${ref}</li>`).join("")
  return `<span class="token-references"><ul>${formattedRefs}</ul></span>`
}

/** Generate enhanced description with resolved value and reference info */
export function generateEnhancedTokenDescription(token: Token): string {
  const resolvedValue = displayTokenWithReference(token, { showReference: false })
  const hasRef = hasTokenValueReference((token as any).value)

  let description = token.description || ""

  // Add resolved value info
  const valueInfo = `Resolved value: ${resolvedValue}`

  // Add reference info
  let referenceInfo = ""
  if (hasRef) {
    switch (token.tokenType) {
      case "Color":
        const colorRef = getColorTokenReference((token as ColorToken).value)
        referenceInfo = colorRef ? ` | References: ${colorRef}` : ""
        break
      case "Typography":
        const complexRefs = getComplexTokenReferences(token)
        referenceInfo = complexRefs.length > 0 ? ` | References: ${complexRefs.join(", ")}` : ""
        break
      default:
        if (isDimensionToken(token.tokenType)) {
          const measureRef = getMeasureTokenReference((token as MeasureToken).value)
          referenceInfo = measureRef ? ` | References: ${measureRef}` : ""
        } else if (isStringToken(token.tokenType)) {
          const textRef = getTextTokenReference((token as TextToken).value)
          referenceInfo = textRef ? ` | References: ${textRef}` : ""
        }
    }
  }

  // Combine description with value and reference info
  const enhancedInfo = `${valueInfo}${referenceInfo}`

  if (description) {
    return `${description} | ${enhancedInfo}`
  } else {
    return enhancedInfo
  }
}

/** Helper function to parse comma-separated token IDs */
export function parseTokenIds(tokenIdsString: string): string[] {
  if (!tokenIdsString || tokenIdsString.trim() === "") {
    return []
  }

  return tokenIdsString
    .split(",")
    .map(id => id.trim())
    .filter(id => id !== "")
}

/** Helper function to get tokens from comma-separated IDs */
export function getTokensFromIds(tokenIdsString: string, ds: any): Token[] {
  const tokenIds = parseTokenIds(tokenIdsString)
  const tokens: Token[] = []

  for (const tokenId of tokenIds) {
    const token = ds.tokenById(tokenId)
    if (token) {
      tokens.push(token)
    }
  }

  return tokens
}
