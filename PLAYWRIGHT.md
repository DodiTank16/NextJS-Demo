# Playwright Testing & MCP Setup

This project includes Playwright for end-to-end testing and the Playwright MCP (Model Context Protocol) server for AI-powered browser automation.

## Testing Setup

### Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see the browser)
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Show test report
npm run test:report
```

### Test Files

Tests are located in the `tests/` directory. Create new test files with the `.spec.ts` extension.

Example test:
```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Next/);
});
```

## Playwright MCP Server

The Playwright MCP server provides AI agents with full browser control capabilities. It's configured in `.vscode/settings.json`.

### Features

- **Fast and lightweight**: Uses Playwright's accessibility tree, not pixel-based input
- **LLM-friendly**: No vision models needed, operates purely on structured data
- **Deterministic tool application**: Avoids ambiguity common with screenshot-based approaches

### Configuration

The MCP server is configured in `.vscode/settings.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### Available Capabilities

You can enable additional capabilities by adding arguments to the MCP server configuration:

- `--caps=vision`: Enable coordinate-based interactions
- `--caps=pdf`: Enable PDF generation
- `--caps=devtools`: Enable DevTools access
- `--caps=network`: Enable network control
- `--caps=storage`: Enable storage access
- `--caps=config`: Enable configuration management
- `--caps=testing`: Enable test assertions

Example with capabilities:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--caps=vision,pdf,devtools"
      ]
    }
  }
}
```

### Common Options

- `--browser <chrome|firefox|webkit>`: Choose browser
- `--headless`: Run in headless mode
- `--device <name>`: Emulate specific device (e.g., "iPhone 15")
- `--viewport-size <WxH>`: Set viewport size (e.g., "1280x720")
- `--user-data-dir <path>`: Use persistent browser profile
- `--isolated`: Use isolated browser context

### Usage with GitHub Copilot

Once configured, GitHub Copilot (and other MCP-compatible AI tools) can:
- Navigate web pages
- Interact with page elements
- Fill forms
- Take screenshots
- Generate code based on interactions
- Run automated tests

### Security Note

Playwright MCP is not a security boundary. See [MCP Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) for guidance.

## CI/CD Integration

GitHub Actions workflow is configured in `.github/workflows/playwright.yml` to run tests automatically on push and pull requests.

## Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Playwright MCP Documentation](https://www.npmjs.com/package/@playwright/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
