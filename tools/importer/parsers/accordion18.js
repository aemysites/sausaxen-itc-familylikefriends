/* global WebImporter */
export default function parse(element, { document }) {
  // Block header: Exactly as in example
  const headerRow = ['Accordion (accordion18)'];

  // Extract the title (first cell)
  let titleCell = '';
  const header = element.querySelector('.cmp-accordion__header');
  if (header) {
    const button = header.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleCell = titleSpan;
      }
    }
  }

  // Extract the content (second cell)
  let contentCell = '';
  const panel = element.querySelector('.cmp-accordion__panel');
  if (panel) {
    // Get all panel children, preserving semantic structure
    // If only one child, use that element; else, array of all children
    if (panel.children.length === 1) {
      contentCell = panel.firstElementChild;
    } else if (panel.children.length > 1) {
      contentCell = Array.from(panel.children);
    } else {
      contentCell = '';
    }
  }

  // Compose table as in example - header, then one row with two cells
  const cells = [
    headerRow,
    [titleCell, contentCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}