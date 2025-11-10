# Figma Frame Links - Dokumentacja

## Opis funkcjonalności

Dodano możliwość linkowania obrazków frame'ów bezpośrednio do ich źródłowych frame'ów w Figmie. Gdy opcja jest włączona, kliknięcie na obrazek frame'a otworzy odpowiedni frame w Figmie w nowej karcie.

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

**Domyślnie wyłączona** - użytkownik musi ją włączyć w ustawieniach exportera.

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
- Sprawdzać, czy opcja `blockConfigFramesLinkToFigma` jest włączona
- Sprawdzać, czy frame ma wymagane dane (`sourceFileId` i `sourceFrameId`)
- Owijać `<img>` w `<a>` tag z linkiem do Figmy, gdy warunki są spełnione

```html
{[ if (linkToFigma && frame.sourceFileId && frame.sourceFrameId) ]}
    <a href="{{ getFigmaFrameUrl(frame.sourceFileId, frame.sourceFrameId) }}" 
       target="_blank" 
       rel="noopener noreferrer" 
       title="Open in Figma">
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

1. W ustawieniach exportera przejdź do kategorii "Blocks"
2. Znajdź opcję "Frame blocks: Link to Figma"
3. Włącz opcję (checkbox)
4. Opublikuj dokumentację
5. Kliknięcie na obrazek frame'a otworzy go w Figmie

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
