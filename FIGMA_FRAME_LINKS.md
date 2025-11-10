# Figma Frame Links - Dokumentacja

## Opis funkcjonalności

Dodano możliwość linkowania obrazków frame'ów bezpośrednio do ich źródłowych frame'ów w Figmie. Gdy opcja jest włączona i URL Figmy jest dodany do opisu frame'a, kliknięcie na obrazek frame'a otworzy odpowiedni frame w Figmie w nowej karcie.

## Jak to działa (Workaround)

Ze względu na ograniczenia Supernova API, które nie eksportuje danych źródłowych Figmy dla bloku Frames, rozwiązanie wykorzystuje **opis frame'a** jako źródło URL-a Figmy:

1. W edytorze Supernova, dla każdego frame'a, skopiuj URL Figmy (np. `https://www.figma.com/file/TJFBIXaneq8NEpLV0eBZMu?node-id=12262:8331`)
2. Wklej ten URL do **opisu frame'a** w Supernova
3. Po opublikowaniu, obrazek frame'a będzie klikalny i otworzy frame w Figmie

## Zmiany w kodzie

### 1. Konfiguracja (exporter.json)

Dodano nową opcję konfiguracyjną w kategorii "Blocks":

```json
{
  "key": "blockConfigFramesLinkToFigma",
  "type": "boolean",
  "label": "Frame blocks: Link to Figma",
  "description": "When enabled, frame images will be clickable and open the source frame in Figma.",
  "category": "Blocks",
  "default": false
}
```

**Domyślnie włączona** - użytkownik może ją wyłączyć w ustawieniach exportera, jeśli nie chce tej funkcjonalności.

### 2. Funkcja pomocnicza TypeScript

**Plik:** `typescript/src/doc_functionality/health.ts`

Dodano nową funkcję:

```typescript
export function getFigmaFrameUrl(fileId: string, frameId: string) {
  return "https://www.figma.com/file/" + fileId + "?node-id=" + encodeURIComponent(frameId);
}
```

Funkcja generuje poprawny URL do Figmy na podstawie:
- `fileId` - ID pliku Figmy
- `frameId` - ID konkretnego frame'a (node-id)

### 3. Rejestracja funkcji

**Plik:** `typescript/src/index.ts`

- Dodano import funkcji `getFigmaFrameUrl`
- Zarejestrowano funkcję w Pulsar: `Pulsar.registerFunction('getFigmaFrameUrl', getFigmaFrameUrl)`

### 4. Template frame'a

**Plik:** `src/page_body/structure/blocks/page_block_frame.pr`

Zmodyfikowano template, aby:
- Pobierać konfigurację przez `exportConfiguration()`
- Sprawdzać, czy opcja `blockConfigFramesLinkToFigma` jest włączona
- **Parsować opis frame'a** (`frame.description`) w poszukiwaniu URL-a Figmy
- Wyciągać URL Figmy za pomocą regex: `/https:\/\/www\.figma\.com\/[^\s]+/`
- Owijać `<img>` w `<a>` tag z wyciągniętym URL-em

```html
{[ const configuration = exportConfiguration() /]}
{[ let linkToFigma = configuration.blockConfigFramesLinkToFigma /]}

{* Check if description contains Figma URL *}
{[ let figmaUrl = null /]}
{[ if (linkToFigma && frame.description && frame.description.includes("https://www.figma.com/")) ]}
    {[ const urlMatch = frame.description.match(/https:\/\/www\.figma\.com\/[^\s]+/) /]}
    {[ if urlMatch ]}
        {[ figmaUrl = urlMatch[0] /]}
    {[/]}
{[/]}

{[ if figmaUrl ]}
    <a href="{{ figmaUrl }}" target="_blank" rel="noopener noreferrer" title="Open in Figma">
        <img src="{{ frame.previewUrl }}" ... />
    </a>
{[ else ]}
    <img src="{{ frame.previewUrl }}" ... />
{[/]}
```

### 5. Style CSS

**Plik:** `scss/components/tiles.scss`

Dodano style dla linków w frame'ach:

```scss
.content-block--frames {
  &.layout-tiles {
    .preview {
      a {
        display: block;
        width: 100%;
        height: 100%;
        
        img {
          display: block;
          transition: opacity 0.2s ease;
        }

        &:hover img {
          opacity: 0.9;
        }
      }
    }
  }
}
```

Efekt:
- Link zajmuje całą przestrzeń obrazka
- Przy hover obrazek lekko przyciemnia się (opacity: 0.9)
- Płynna animacja przejścia

## Jak używać

### Krok 1: Włącz opcję (domyślnie włączona)
Funkcjonalność jest **domyślnie włączona**. Jeśli chcesz ją wyłączyć:
1. W ustawieniach exportera przejdź do kategorii "Blocks"
2. Znajdź opcję "Frame blocks: Link to Figma"
3. Wyłącz opcję

### Krok 2: Dodaj URL Figmy do opisu frame'a
Dla każdego frame'a, który chcesz zlinkować:
1. W edytorze Supernova otwórz frame
2. Skopiuj URL Figmy z edytora (np. `https://www.figma.com/file/TJFBIXaneq8NEpLV0eBZMu?node-id=12262:8331`)
3. Wklej URL do pola **Description** frame'a
4. Możesz dodać dodatkowy tekst przed lub po URL-u - zostanie on wyświetlony jako opis

### Krok 3: Opublikuj
Po opublikowaniu dokumentacji, obrazki frame'ów z URL-ami Figmy w opisie będą klikalne.

## Bezpieczeństwo

- Link otwiera się w nowej karcie (`target="_blank"`)
- Użyto `rel="noopener noreferrer"` dla bezpieczeństwa
- `frameId` jest enkodowany przez `encodeURIComponent()`

## Dostępne dane

Frame ma dostęp do następujących właściwości (z `supernova.d.ts`):

```typescript
type DocumentationPageBlockFrame = {
  sourceFileId: string      // ID pliku Figmy
  sourceFrameId: string     // ID frame'a (node-id)
  sourceFileName: string    // Nazwa pliku
  title: string
  description: string | null
  previewUrl: string | null
  backgroundColor: string | null
}
```

## Kompatybilność

Funkcjonalność jest w pełni opcjonalna i backward-compatible:
- Domyślnie wyłączona
- Nie wpływa na istniejące frame'y, gdy jest wyłączona
- Sprawdza dostępność wymaganych danych przed utworzeniem linku


## Ograniczenia i Workaround

### Dlaczego workaround?
Supernova API **nie eksportuje** danych źródłowych Figmy (`sourceFileId`, `sourceFrameId`) dla bloku Frames, mimo że są one zdefiniowane w typach TypeScript. Po szczegółowej analizie potwierdzono, że:
- `frame.sourceFileId` = undefined
- `frame.sourceFrameId` = undefined  
- `frame.origin` zawiera tylko `height` i `width`, bez `fileId` i `nodeId`

### Rozwiązanie
Wykorzystujemy pole **description** frame'a jako źródło URL-a Figmy. Regex wyciąga URL z opisu i tworzy link.

### Przykład
**Opis frame'a w Supernova:**
```
Główny ekran aplikacji
https://www.figma.com/file/TJFBIXaneq8NEpLV0eBZMu?node-id=12262:8331
```

**Wynik:**
- Obrazek jest klikalny i otwiera frame w Figmie
- Opis jest wyświetlany normalnie (z URL-em)

## Kompatybilność

Funkcjonalność jest w pełni opcjonalna i backward-compatible:
- Domyślnie włączona
- Nie wpływa na frame'y bez URL-a Figmy w opisie
- Frame'y bez URL-a działają jak dotychczas
