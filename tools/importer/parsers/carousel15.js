/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row from the example
  const headerRow = ['Carousel'];
  const rows = [headerRow];

  // Find slides container
  const swiperWrapper = element.querySelector('.swiper-wrapper, .primary-swiper-wrapper, [aria-live]');
  let slides = [];
  if (swiperWrapper) {
    slides = Array.from(swiperWrapper.children).filter((c) => c.classList.contains('swiper-slide'));
  }

  // If no slides found, fallback to single image + text block (mobile view)
  if (!slides.length) {
    // Find possible image
    const img = element.querySelector('img');
    // Find possible text block
    const textBlock = element.querySelector('.famlf-carousel-text, .cmp-text');
    if (img || textBlock) {
      rows.push([
        img || '',
        textBlock || ''
      ]);
    }
  } else {
    slides.forEach((slide) => {
      // Find first image in the slide
      const img = slide.querySelector('img');
      // Gather all elements with text inside slide, excluding images, buttons, SVGs, and empty text
      let textEls = [];
      Array.from(slide.querySelectorAll('*')).forEach(el => {
        const tag = el.tagName.toLowerCase();
        // Skip images, buttons, SVGs, and elements with no text
        if (tag === 'img' || tag === 'button' || tag === 'svg') return;
        if (el.textContent && el.textContent.trim().length > 0) {
          // Only push if not inside an image container
          textEls.push(el);
        }
      });
      // If no text found inside slide, look for text blocks outside in parent carousel (e.g. centered heading/description)
      if (!textEls.length) {
        const extraText = element.querySelector('.famlf-carousel-text, .cmp-text');
        if (extraText) textEls.push(extraText);
      }
      // Add slide row, referencing elements directly
      rows.push([
        img || '',
        textEls.length ? textEls : ''
      ]);
    });
  }

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
