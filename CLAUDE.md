# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

react-native-hyper-markdown is a high-performance markdown parser and renderer for React Native, built on top of Nitro Modules and the md4c C parser. The project leverages native C++ for 100x faster parsing compared to JavaScript implementations.

## Architecture

### Three-Layer Architecture

1. **Native Layer (C++)**: `cpp/` directory
   - `MarkdownParser.cpp/h`: Wrapper around md4c parser, converts markdown to JSON AST
   - `HybridHyperMarkdown.cpp/hpp`: Nitro Modules hybrid object implementation
   - `md4c/`: Third-party md4c parser library (battle-tested CommonMark + GFM parser)

2. **Nitro Bridge Layer**:
   - `src/specs/hyper-markdown.nitro.ts`: TypeScript interface for native module
   - `nitrogen/generated/`: Auto-generated bindings (iOS, Android, shared)
   - `nitro.json`: Nitro Modules configuration

3. **JavaScript/React Layer**: `src/` directory
   - `parser.ts`: JS wrapper around native module
   - `MarkdownView.tsx`: Main React component
   - `renderers/`: React renderers for each AST node type (25+ types)
   - `themes/`: Light and dark theme definitions
   - `hooks/`: React hooks for parsing and theming
   - `context/`: ThemeProvider context

### Data Flow

```
Markdown String → Native Parser (C++) → JSON AST → JS Parser → MarkdownNode[] → React Renderers → React Native Views
```

- Parsing happens on native thread via Nitro's threadpool (non-blocking)
- AST is serialized as JSON string to cross native/JS boundary
- React layer renders AST nodes using customizable renderer functions

## Common Commands

### Development

```bash
# Type checking
npm run typecheck

# Build TypeScript to lib/ (commonjs, module, typescript)
npm run build

# Codegen: Run nitrogen to generate native bindings + build
npm run codegen

# Clean build artifacts
npm run clean
```

### Example App

```bash
cd example

# Install dependencies
npm install

# iOS: Install pods
npm run pod
# or manually:
bundle install && bundle exec pod install --project-directory=ios

# Run on iOS
npm run ios

# Run on Android
npm run android

# Start Metro bundler with clean cache
npm start
```

### Native Development

After modifying `.nitro.ts` specs or C++ code:
```bash
npm run codegen
cd example && npm run pod  # iOS only
```

After modifying only TypeScript code:
```bash
npm run build
```

## Code Architecture Details

### AST Node Types

The parser generates 25+ node types defined in `src/types/ast.ts`:

- **Structure**: `document`, `paragraph`, `heading`
- **Text**: `text`, `strong`, `emphasis`, `strikethrough`, `underline`
- **Links/Media**: `link`, `image`
- **Code**: `code_block`, `code_inline`
- **Lists**: `list`, `list_item`, `task_list_item`
- **Tables**: `table`, `table_row`, `table_cell`
- **Quotes**: `blockquote`
- **Breaks**: `thematic_break`, `softbreak`, `hardbreak`
- **Extended**: `math_inline`, `math_block`, `wiki_link`, `html_block`

Each node has a `type` field and type-specific properties (e.g., `heading` has `level`, `link` has `href`, `table_cell` has `align`).

### Renderer System

Renderers are functions that convert AST nodes to React elements. Located in `src/renderers/`:

- Each renderer receives: `(node, key, context) => ReactNode`
- Context provides: `{ theme, onLinkPress, onImagePress, onCheckboxToggle, renderNode }`
- `renderNode` is used recursively for child nodes
- Custom renderers can override any node type via `MarkdownView` props

### Theme System

Themes are structured objects (`src/types/theme.ts`):

- `colors`: Text, background, links, borders, etc.
- `textStyles`: TextStyle for each element type
- `containerStyles`: ViewStyle for containers
- `imageStyles`: ImageStyle for images
- `spacing`: Numeric spacing values
- `syntaxHighlighting`: Optional syntax highlighting config (requires `react-syntax-highlighter` peer dep)

Built-in themes: `lightTheme`, `darkTheme` in `src/themes/`

### Nitro Modules Integration

Nitro autolinking configuration in `nitro.json`:
- iOS module name: `HyperMarkdown`
- Android namespace: `hypermarkdown`
- C++ namespace: `hypermarkdown`
- Hybrid object: `HybridHyperMarkdown`

The native module is instantiated in `parser.ts`:
```typescript
const HyperMarkdown = NitroModules.createHybridObject<HyperMarkdownSpec>('HyperMarkdown')
```

### Parser Options

Configurable via `ParserOptions` interface:
- **GFM features**: `gfm`, `enableTables`, `enableTaskLists`, `enableStrikethrough`, `enableAutolink`
- **Extensions**: `math`, `wiki`
- **Limits**: `maxInputSize` (default 10MB), `timeout` (default 5s)

These map to md4c parser flags in C++.

## Development Patterns

### Adding a New AST Node Type

1. Add node type to `src/types/ast.ts` `MarkdownNode` union
2. Update C++ parser in `cpp/MarkdownParser.cpp` to emit the node
3. Add default renderer in `src/renderers/`
4. Export renderer from `src/renderers/index.ts`
5. Add to `defaultRenderers` map
6. Update TypeScript types in `src/types/renderers.ts` if needed

### Modifying Native Parser

1. Edit `cpp/MarkdownParser.cpp` or `cpp/MarkdownParser.h`
2. If changing the interface, update `src/specs/hyper-markdown.nitro.ts`
3. Run `npm run codegen` to regenerate bindings
4. Test on both iOS and Android

### Theme Customization

Themes are deeply merged partial objects. When adding new theme properties:
1. Add to `src/types/theme.ts` interfaces
2. Update `lightTheme` and `darkTheme` defaults in `src/themes/`
3. Update relevant renderers to consume the new theme properties

### Performance Considerations

- AST parsing is fast (1-500ms for 10KB-1MB docs) but rendering can be slow
- For large documents (>100KB), recommend virtualization with FlatList
- Use `ast` prop instead of `content` to avoid re-parsing on re-renders
- Memoize custom renderers to prevent function re-creation
- Use `useDebouncedParsing` hook for live editor previews (default 300ms debounce)

## Platform-Specific Notes

### iOS
- Uses CocoaPods for native dependency management
- Native code in `ios/` (auto-generated by Nitrogen)
- Requires React Native 0.76+ (0.78+ for Nitro Views)

### Android
- Uses Gradle/CMake build system
- Native code in `android/` (auto-generated by Nitrogen)
- NDK version r21-r26 compatible
- Check `android/gradle.properties` for NDK config

## Testing

Currently minimal test coverage. Tests in `src/__tests__/`.

When adding tests:
- Parser tests: Test various markdown inputs and verify AST output
- Renderer tests: Use React Testing Library to test component rendering
- Integration tests: Test full MarkdownView component with various props

## Build Output

TypeScript is compiled to three formats via `react-native-builder-bob`:
- `lib/commonjs/`: CommonJS modules
- `lib/module/`: ES modules
- `lib/typescript/`: Type definitions

Entry points defined in `package.json`:
- `main`: CommonJS (`lib/commonjs/index.js`)
- `module`: ES module (`lib/module/index.js`)
- `types`: TypeScript definitions (`lib/typescript/src/index.d.ts`)
- `react-native`: Source (`src/index`)

## Syntax Highlighting

Optional feature requiring `react-syntax-highlighter` peer dependency:
- Component: `src/components/SyntaxHighlighter.tsx`
- Checks availability with `isSyntaxHighlightingAvailable()`
- Supports hljs and prism highlighters
- Configured via `theme.syntaxHighlighting`

## Common Gotchas

- **Nitrogen codegen**: Always run `npm run codegen` after changing `.nitro.ts` files
- **Metro cache**: Clear with `npm start -- --reset-cache` if seeing stale modules
- **iOS pods**: Run `npm run pod` in example/ after native changes
- **AST JSON serialization**: Native returns JSON string, not objects, to avoid recursive type issues in Nitro
- **Theme context**: MarkdownView uses ThemeProvider context if no `theme` prop is provided
- **Custom renderers**: Must use `ctx.renderNode()` for children, not direct array mapping
