# Adel Abdallah Portfolio

A modern, responsive portfolio website with multi-language support and PDF export functionality.

## Features

- 🌍 **Multi-language Support**: Available in 4 languages (English, Arabic, French, Spanish) - No server required!
- 🎨 **Dark/Light Theme**: Toggle between themes
- 📱 **Responsive Design**: Works on all devices
- 📄 **PDF Export**: Download portfolio as PDF
- 🔍 **SEO Optimized**: Complete meta tags and structured data
- ♿ **Accessible**: WCAG compliant with keyboard navigation
- 🚀 **Frontend Only**: No server needed - works with file:// protocol

## Quick Start

Simply open `index.html` in your browser! No server setup required.

### For Development
```bash
# Just open the HTML file directly
open index.html
# or double-click index.html in your file manager
```

## Development

### File Structure
```
portfolio/
├── index.html          # Main portfolio page
├── styles.css          # All styles
├── src/
│   ├── theme.js        # Theme switching
│   └── components/     # CSS components
└── locales/            # Translation files and scripts
    ├── translations.js           # Embedded translations (no server needed!)
    ├── additional-translations.js # Additional language support
    ├── services-translations.js  # Services page language additions
    ├── en/common.json            # English reference data
    ├── ar/common.json            # Arabic reference data
    └── ...
```

### Adding New Languages

1. Add translations to `locales/translations.js` in the `PORTFOLIO_TRANSLATIONS` object
2. Add the language option to the HTML dropdown
3. Update the JavaScript language codes

### PDF Export

```bash
npm run pdf
```

This will generate a PDF version of your portfolio.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile browsers: Full support

## Troubleshooting

### Translation Not Working
1. Check browser console for errors
2. Ensure `locales/translations.js` is loading properly
3. Verify the language selector elements exist

### Theme Not Working
Check that `src/theme.js` is loading properly and localStorage is enabled.

## License

This portfolio is open source and available under the MIT License.
