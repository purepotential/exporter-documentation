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

/** Get token reference with proper group hierarchy using existing group functions */
export function getTokenReferenceWithGroup(token: Token, tokenId: string, ds?: any): string {
  if (!token) {
    return 'Unknown Token'
  }

  // Try to use ds methods to get group information first
  try {
    if (ds && tokenId) {
      // Check if there's a groupByTokenId method (reverse of tokensByGroupId)
      if (ds.groupByTokenId) {
        const group = ds.groupByTokenId(tokenId)
        if (group) {
          const groupPath = fullTokenGroupName(group)
          return groupPath ? `${groupPath}/${token.name}` : token.name
        }
      }

      // Check if there's a tokenGroupById method
      if (ds.tokenGroupById) {
        // First get the full token to see if it has a groupId
        const fullToken = ds.tokenById(tokenId) as any
        if (fullToken && fullToken.groupId) {
          const group = ds.tokenGroupById(fullToken.groupId)
          if (group) {
            const groupPath = fullTokenGroupName(group)
            return groupPath ? `${groupPath}/${token.name}` : token.name
          }
        }
      }
    }

    // Try to use existing group functions if the token has group information
    const tokenWithGroup = token as any

    // Try different possible group property names that might exist on the token
    if (tokenWithGroup.parent && typeof tokenWithGroup.parent === 'object') {
      // If token has a parent group, use fullTokenGroupName
      const groupPath = fullTokenGroupName(tokenWithGroup.parent)
      return groupPath ? `${groupPath}/${token.name}` : token.name
    }

    if (tokenWithGroup.group && typeof tokenWithGroup.group === 'object') {
      // If token has a group property, use fullTokenGroupName
      const groupPath = fullTokenGroupName(tokenWithGroup.group)
      return groupPath ? `${groupPath}/${token.name}` : token.name
    }

    if (tokenWithGroup.tokenGroup && typeof tokenWithGroup.tokenGroup === 'object') {
      // If token has a tokenGroup property, use fullTokenGroupName
      const groupPath = fullTokenGroupName(tokenWithGroup.tokenGroup)
      return groupPath ? `${groupPath}/${token.name}` : token.name
    }

    // Try to get the full token from ds and check if it has group info
    if (ds && ds.tokenById && tokenId) {
      const fullToken = ds.tokenById(tokenId) as any
      if (fullToken && fullToken !== token) {
        // Check if the full token has group information
        if (fullToken.parent && typeof fullToken.parent === 'object') {
          const groupPath = fullTokenGroupName(fullToken.parent)
          return groupPath ? `${groupPath}/${token.name}` : token.name
        }

        if (fullToken.group && typeof fullToken.group === 'object') {
          const groupPath = fullTokenGroupName(fullToken.group)
          return groupPath ? `${groupPath}/${token.name}` : token.name
        }
      }
    }

  } catch (error) {
    // Fallback if group access fails - silently continue
  }

  // Simple fallback: just return the token name
  return token.name
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

/** Find the token group that contains a specific token ID using available properties */
function findTokenGroupContainingToken(tokenId: string, tokenGroups: TokenGroup[]): TokenGroup | null {
  for (const group of tokenGroups) {
    // Check if token is directly in this group using childrenIds
    if (group.childrenIds && group.childrenIds.includes(tokenId)) {
      return group
    }

    // Recursively check subgroups
    if (group.subgroups && group.subgroups.length > 0) {
      const found = findTokenGroupContainingToken(tokenId, group.subgroups)
      if (found) {
        return found
      }
    }
  }

  return null
}

/** Find the token group that contains a specific token ID (legacy method) */
function findTokenGroupByTokenId(tokenId: string, tokenGroups: TokenGroup[]): TokenGroup | null {
  for (const group of tokenGroups) {
    // Check if token is directly in this group
    if (group.childrenIds && group.childrenIds.includes(tokenId)) {
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

  return null
}

/** Build the full path of a token group using SDK structure */
function buildTokenGroupPathFromSDK(tokenGroup: TokenGroup): string {
  const pathParts: string[] = []

  // According to SDK docs, path is "A list of segments representing the hierarchical path"
  if (tokenGroup.path && tokenGroup.path.length > 0) {
    pathParts.push(...tokenGroup.path)
  }

  // Add current group name if not root
  if (!tokenGroup.isRoot && tokenGroup.name) {
    pathParts.push(tokenGroup.name)
  }

  return pathParts.join('/')
}

/** Build the full path of a token group including parent hierarchy (legacy) */
function buildTokenGroupPath(tokenGroup: TokenGroup): string {
  return buildTokenGroupPathFromSDK(tokenGroup)
}

/** Get the full path of a token including its group hierarchy */
export function getFullTokenPath(token: Token): string {
  // Only return the token name - no more inferring
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

  // Simple fallback: just return the token name
  return referencedToken.name
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

/** Helper function to build theme label from themes array */
export function buildThemeLabel(themes: any[]): string {
  if (!themes || themes.length === 0) {
    return ""
  }

  return themes.map(theme => theme.name).join(", ")
}

/** Helper function to get themed token reference with label */
export function getThemedTokenReference(token: Token, themes: any[], ds?: any): string {
  if (!token) {
    return ""
  }

  // Get the reference based on token type
  let reference = ""

  if (token.tokenType === "Color") {
    const colorToken = token as ColorToken
    reference = getColorTokenReference(colorToken.value, ds) || ""
  } else if (isDimensionToken(token.tokenType)) {
    const measureToken = token as MeasureToken
    reference = getMeasureTokenReference(measureToken.value, ds) || ""
  } else if (isStringToken(token.tokenType)) {
    const textToken = token as TextToken
    reference = getTextTokenReference(textToken.value, ds) || ""
  }

  if (!reference) {
    return ""
  }

  // If we have themes, add the theme label
  if (themes && themes.length > 0) {
    const themeLabel = buildThemeLabel(themes)
    return `${themeLabel}: ${reference}`
  }

  return reference
}

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Complex Token Display with References

/** Display any token with its resolved value and references in HTML format */
export function displayTokenWithReferences(token: Token, showReferences: boolean = true): string {
  if (!showReferences) {
    return displayTokenValue(token)
  }

  switch (token.tokenType) {
    case "Typography":
      return displayTypographyTokenWithReferences(token as TypographyToken)
    case "Shadow":
      return displayShadowTokenWithReferences(token as ShadowToken)
    case "Gradient":
      return displayGradientTokenWithReferences(token as GradientToken)
    case "Color":
      return displayColorTokenWithReferences(token as ColorToken)
    default:
      if (isDimensionToken(token.tokenType)) {
        return displayDimensionTokenWithReferences(token as MeasureToken)
      } else if (isStringToken(token.tokenType)) {
        return displayStringTokenWithReferences(token as TextToken)
      }
      return displayTokenValue(token)
  }
}

/** Display basic token value without references */
export function displayTokenValue(token: Token): string {
  switch (token.tokenType) {
    case "Color":
      return getFormattedColor((token as ColorToken).value, false, null, false)
    case "Typography":
      return typographyDescription(token as TypographyToken)
    case "Shadow":
      return shadowDescription(token as ShadowToken)
    case "Gradient":
      return gradientDescription(token as GradientToken)
    case "Opacity":
      return decimalOpacityToPercentage((token as MeasureToken).value)
    default:
      if (isDimensionToken(token.tokenType)) {
        return measureValueToReadableUnit((token as MeasureToken).value, false)
      } else if (isStringToken(token.tokenType)) {
        return (token as TextToken).value.text
      }
      return String((token as any).value || "")
  }
}

/** Display typography token with references */
export function displayTypographyTokenWithReferences(token: TypographyToken): string {
  const mainValue = typographyDescription(token)
  const references = getTypographyTokenReferences(token)

  if (references.length === 0) {
    return `<div class="typography-token">
      <div class="typography-main">${mainValue}</div>
    </div>`
  }

  const referencesHtml = references.map(ref =>
    `<span class="ref-item">${ref}</span>`
  ).join('')

  return `<div class="typography-token">
    <div class="typography-main">${mainValue}</div>
    <div class="typography-references">${referencesHtml}</div>
  </div>`
}

/** Display shadow token with references */
export function displayShadowTokenWithReferences(token: ShadowToken): string {
  const mainValue = shadowDescription(token)
  const references = getShadowTokenReferences(token)

  if (references.length === 0) {
    return `<div class="shadow-token">
      <div class="shadow-main">${mainValue}</div>
    </div>`
  }

  const referencesHtml = references.map(ref =>
    `<span class="ref-item">${ref}</span>`
  ).join('')

  return `<div class="shadow-token">
    <div class="shadow-main">${mainValue}</div>
    <div class="shadow-references">${referencesHtml}</div>
  </div>`
}

/** Display gradient token with references */
export function displayGradientTokenWithReferences(token: GradientToken): string {
  const mainValue = gradientDescription(token)
  const references = getGradientTokenReferences(token)

  if (references.length === 0) {
    return `<div class="gradient-token">
      <div class="gradient-main">${mainValue}</div>
    </div>`
  }

  const referencesHtml = references.map(ref =>
    `<span class="ref-item">${ref}</span>`
  ).join('')

  return `<div class="gradient-token">
    <div class="gradient-main">${mainValue}</div>
    <div class="gradient-references">${referencesHtml}</div>
  </div>`
}

/** Display color token with references */
export function displayColorTokenWithReferences(token: ColorToken): string {
  return getFormattedColor(token.value, false, null, true)
}

/** Display dimension token with references */
export function displayDimensionTokenWithReferences(token: MeasureToken): string {
  return measureValueToReadableUnit(token.value, true)
}

/** Display string token with references */
export function displayStringTokenWithReferences(token: TextToken): string {
  const textRef = getTextTokenReference(token.value)
  if (textRef) {
    return `${token.value.text} <span class="token-reference">(${textRef})</span>`
  }
  return token.value.text
}

/** Get all references from a typography token */
export function getTypographyTokenReferences(token: TypographyToken): string[] {
  const references: string[] = []

  const fontFamilyRef = getTextTokenReference(token.value.fontFamily)
  if (fontFamilyRef) {
    references.push(`Font: ${fontFamilyRef}`)
  }

  const fontWeightRef = getTextTokenReference(token.value.fontWeight)
  if (fontWeightRef) {
    references.push(`Weight: ${fontWeightRef}`)
  }

  const fontSizeRef = getMeasureTokenReference(token.value.fontSize)
  if (fontSizeRef) {
    references.push(`Size: ${fontSizeRef}`)
  }

  if (token.value.lineHeight) {
    const lineHeightRef = getMeasureTokenReference(token.value.lineHeight)
    if (lineHeightRef) {
      references.push(`Line Height: ${lineHeightRef}`)
    }
  }

  const letterSpacingRef = getMeasureTokenReference(token.value.letterSpacing)
  if (letterSpacingRef) {
    references.push(`Letter Spacing: ${letterSpacingRef}`)
  }

  const paragraphSpacingRef = getMeasureTokenReference(token.value.paragraphSpacing)
  if (paragraphSpacingRef) {
    references.push(`Paragraph Spacing: ${paragraphSpacingRef}`)
  }

  return references
}

/** Get all references from a shadow token */
export function getShadowTokenReferences(token: ShadowToken): string[] {
  const references: string[] = []

  token.value.forEach((shadowValue, index) => {
    const colorRef = getColorTokenReference(shadowValue.color)
    if (colorRef) {
      references.push(`Shadow ${index + 1} Color: ${colorRef}`)
    }
  })

  return references
}

/** Get all references from a gradient token */
export function getGradientTokenReferences(token: GradientToken): string[] {
  const references: string[] = []

  token.value.forEach(gradientValue => {
    gradientValue.stops.forEach(stop => {
      const colorRef = getColorTokenReference(stop.color)
      if (colorRef) {
        references.push(`Stop Color: ${colorRef}`)
      }
    })
  })

  return references
}

/** Get reference summary for any token type */
export function getTokenReferenceSummary(token: Token): string {
  switch (token.tokenType) {
    case "Color":
      const colorRef = getColorTokenReference((token as ColorToken).value)
      return colorRef || "Base token"

    case "Typography":
      const typographyRefs = getTypographyTokenReferences(token as TypographyToken)
      if (typographyRefs.length === 0) return "Base token"
      if (typographyRefs.length === 1) return typographyRefs[0]
      return `${typographyRefs.length} references`

    case "Shadow":
      const shadowRefs = getShadowTokenReferences(token as ShadowToken)
      if (shadowRefs.length === 0) return "Base token"
      return `${shadowRefs.length} color reference${shadowRefs.length !== 1 ? 's' : ''}`

    case "Gradient":
      const gradientRefs = getGradientTokenReferences(token as GradientToken)
      if (gradientRefs.length === 0) return "Base token"
      return `${gradientRefs.length} color reference${gradientRefs.length !== 1 ? 's' : ''}`

    default:
      if (isDimensionToken(token.tokenType)) {
        const measureRef = getMeasureTokenReference((token as MeasureToken).value)
        return measureRef || "Base token"
      } else if (isStringToken(token.tokenType)) {
        const textRef = getTextTokenReference((token as TextToken).value)
        return textRef || "Base token"
      }
      return "—"
  }
}

/** Get detailed reference list for complex tokens */
export function getTokenReferenceDetails(token: Token): string[] {
  switch (token.tokenType) {
    case "Typography":
      return getTypographyTokenReferences(token as TypographyToken)
    case "Shadow":
      return getShadowTokenReferences(token as ShadowToken)
    case "Gradient":
      return getGradientTokenReferences(token as GradientToken)
    default:
      const summary = getTokenReferenceSummary(token)
      return summary === "Base token" || summary === "—" ? [] : [summary]
  }
}

/** Check if token has any references */
export function tokenHasReferences(token: Token): boolean {
  return getTokenReferenceDetails(token).length > 0
}

/** Format reference details as HTML list */
export function formatTokenReferenceDetailsAsHtml(token: Token): string {
  const details = getTokenReferenceDetails(token)
  if (details.length === 0) return ""

  if (details.length === 1) {
    return `<div class="reference-item">${details[0]}</div>`
  }

  const listItems = details.map(detail => `<div class="reference-item">${detail}</div>`).join('')
  return `<div class="reference-details">${listItems}</div>`
}

/** Get reference count for a token */
export function getTokenReferenceCount(token: Token): number {
  return getTokenReferenceDetails(token).length
}

/** Display token with reference badges for grid/card layouts */
export function displayTokenWithReferenceBadges(token: Token): string {
  const details = getTokenReferenceDetails(token)
  if (details.length === 0) {
    return '<div class="reference-badge">Base token</div>'
  }

  const badges = details.map(detail =>
    `<div class="reference-badge small">${detail}</div>`
  ).join('')

  return `<div class="reference-badges">${badges}</div>`
}

/** Display token with reference items for stack layouts */
export function displayTokenWithReferenceItems(token: Token): string {
  const details = getTokenReferenceDetails(token)
  if (details.length === 0) {
    return '<span class="reference-item">Base</span>'
  }

  const items = details.map(detail =>
    `<span class="reference-item">${detail}</span>`
  ).join('')

  return `<div class="reference-list">${items}</div>`
}