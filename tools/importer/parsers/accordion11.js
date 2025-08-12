/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Accordion (accordion11)'];

  // Find all accordion items (immediate children with class 'cmp-accordion__item')
  const items = Array.from(element.querySelectorAll(':scope > .cmp-accordion__item'));

  const rows = items.map(item => {
    // Title cell: use the span with class cmp-accordion__title.
    let titleSpan = item.querySelector('.cmp-accordion__header .cmp-accordion__button .cmp-accordion__title');
    let titleCell = titleSpan ? titleSpan : '';

    // Content cell: use the panel's contents. Try to keep as much structure as possible.
    let panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // If there's a direct wrapper, use its children, else use all children of panel
      let children = Array.from(panel.children);
      if (children.length === 1) {
        // Often .text > .cmp-text > p, preserve that element
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // fallback to panel itself if structure is unusual
        contentCell = panel;
      }
    }
    return [titleCell, contentCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
