# Images Directory

Place your band photos and performance images here.

## Required Files

- `hero.jpg` — Hero background image (dark, high-contrast stage/band photo, ~1920x1080px)
- `bio.jpg` — Band photo for the About section (~600x400px)
- `show1.jpg` — Photo for show at Royal Canadian Legion Branch 101
- `show2.jpg` — Photo for show at Cuchulainn's Irish Pub

## Gallery Subdirectory (`images/gallery/`)

Add numbered gallery photos: `1.jpg`, `2.jpg`, `3.jpg`, ... etc.

Recommended sizes: 800x600px or 1200x900px, landscape or portrait both supported.

Use `data-year` attributes in the HTML or assign years in `js/main.js` gallery config to enable year filtering.

## Notes

- All images referenced in the site use graceful fallbacks (CSS gradient placeholders) if the file is missing.
- Supported formats: JPG, PNG, WebP
- Keep file sizes reasonable for web: compress to <500KB per image
