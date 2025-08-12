/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row as per requirements
  const headerRow = ['Accordion (accordion19)'];

  // Defensive: find the title cell from .cmp-accordion__title, fallback to button text if needed
  let titleCell = null;
  const header = element.querySelector('h3');
  if (header) {
    const button = header.querySelector('button');
    if (button) {
      // Prefer the .cmp-accordion__title span (preserves markup if any)
      const span = button.querySelector('.cmp-accordion__title');
      if (span) {
        titleCell = span;
      } else if (button.childNodes.length > 0) {
        // fallback: clone button node but remove icon
        const btnClone = button.cloneNode(true);
        const icon = btnClone.querySelector('.cmp-accordion__icon');
        if (icon) icon.remove();
        titleCell = btnClone;
      } else {
        titleCell = document.createTextNode(button.textContent.trim());
      }
    }
  }
  if (!titleCell) {
    // fallback: use the whole header if available
    titleCell = header ? header : document.createTextNode('');
  }

  // Defensive: extract content cell from the panel
  let contentCell = null;
  const panel = element.querySelector('[data-cmp-hook-accordion="panel"]');
  if (panel) {
    // Remove hidden class to ensure content is visible in export
    panel.classList.remove('cmp-accordion__panel--hidden');
    // If the panel contains just one content block, use it; else, use panel itself
    // Prefer the child with class text or cmp-text if present, else panel
    const contentInner = panel.querySelector('.cmp-text, .text');
    if (contentInner) {
      contentCell = contentInner;
    } else {
      contentCell = panel;
    }
  } else {
    contentCell = document.createTextNode('');
  }

  // Build the block table: header row, then 1 item row (title, content)
  const rows = [
    headerRow,
    [titleCell, contentCell]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
