/* global WebImporter */
export default function parse(element, { document }) {
  // Compose table header, exactly as in example
  const headerRow = ['Accordion (accordion20)'];

  // Extract the title from the accordion button's .cmp-accordion__title span
  let titleText = '';
  const headerButton = element.querySelector('.cmp-accordion__button');
  if (headerButton) {
    const titleSpan = headerButton.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleText = titleSpan.textContent.trim();
    }
  }

  // Extract the content shown when expanded
  let contentCell = '';
  const panel = element.querySelector('[data-cmp-hook-accordion="panel"]');
  if (panel) {
    // Find the main content container inside the panel (prefer .cmp-text, fallback to .text, fallback to first child)
    let payload = null;
    // Prefer .cmp-text block if present
    payload = panel.querySelector('.cmp-text');
    if (!payload) {
      // Fallback to .text wrapper
      payload = panel.querySelector('.text');
    }
    if (!payload) {
      // Fallback to first child
      payload = panel.firstElementChild;
    }
    if (!payload) {
      // Fallback to the panel itself (if no content)
      payload = panel;
    }
    contentCell = payload;
  }

  // Compose table data matching the block structure (2 columns, 1 row for this accordion item)
  const cells = [
    headerRow,
    [titleText, contentCell]
  ];

  // Create and replace with the new block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}