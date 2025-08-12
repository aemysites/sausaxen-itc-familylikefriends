/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block, must match example exactly
  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];

  // Find the main accordion container
  const accordion = element.querySelector('.cmp-accordion');
  if (accordion) {
    // Find all accordion items
    const items = accordion.querySelectorAll('.cmp-accordion__item');
    items.forEach(item => {
      // Title cell: clickable header
      let titleCell = '';
      const header = item.querySelector('.cmp-accordion__header');
      if (header) {
        // The button contains all interactive title content
        const button = header.querySelector('.cmp-accordion__button');
        if (button) {
          // Reference the span with title if it exists, else use button
          const titleSpan = button.querySelector('.cmp-accordion__title');
          titleCell = titleSpan ? titleSpan : button;
        }
      }
      // Content cell: panel content
      let contentCell = '';
      const panel = item.querySelector('.cmp-accordion__panel');
      if (panel) {
        // Find all direct children of panel
        // Panel may contain text, images, links, etc.
        // For flexibility and semantic accuracy, include all children
        // If panel is empty, use empty string
        const children = Array.from(panel.childNodes).filter(node => {
          // Ignore empty text nodes
          return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
        });
        if (children.length === 1) {
          // Single element, use it directly
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          // panel is empty
          contentCell = '';
        }
      }
      rows.push([titleCell, contentCell]);
    });
  }
  // Replace the original element with the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
