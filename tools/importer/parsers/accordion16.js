/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row according to the example block name
  const headerRow = ['Accordion (accordion16)'];

  // --- Extract Title ---
  // Find the button that holds the title
  let titleCell;
  const headerBtn = element.querySelector('h3 .cmp-accordion__button');
  if (headerBtn) {
    // The actual title is within span.cmp-accordion__title
    const titleSpan = headerBtn.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleCell = titleSpan;
    } else {
      // Fallback: use button itself
      titleCell = headerBtn;
    }
  } else {
    // Fallback: use h3 text
    const h3 = element.querySelector('h3');
    if (h3) {
      titleCell = h3;
    } else {
      // If nothing found, use blank
      titleCell = document.createTextNode('');
    }
  }

  // --- Extract Content ---
  // Content cell is whatever is inside the panel
  let contentCell;
  const panel = element.querySelector('[data-cmp-hook-accordion="panel"]');
  if (panel) {
    // Use all children of the panel (preserving structure)
    // If panel has a .text wrapper, use its content
    const textDiv = panel.querySelector('.text');
    if (textDiv) {
      // Use the .text div itself so formatting is preserved
      contentCell = textDiv;
    } else {
      // If not, use panel itself
      contentCell = panel;
    }
  } else {
    contentCell = document.createTextNode('');
  }

  // Build the table as per required structure
  const rows = [
    headerRow,
    [titleCell, contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
