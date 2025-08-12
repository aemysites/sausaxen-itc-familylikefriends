/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Set up header row as in example
  const headerRow = ['Accordion (accordion7)'];
  // 2. Extract title (left column)
  let title = '';
  const header = element.querySelector('.cmp-accordion__header');
  if (header) {
    const btn = header.querySelector('button');
    if (btn) {
      const titleSpan = btn.querySelector('.cmp-accordion__title');
      if (titleSpan && titleSpan.textContent) {
        title = titleSpan.textContent.trim();
      } else {
        title = btn.textContent.trim();
      }
    } else {
      title = header.textContent.trim();
    }
  } else {
    // fallback: try direct .cmp-accordion__title inside element
    const titleSpan = element.querySelector('.cmp-accordion__title');
    if (titleSpan && titleSpan.textContent) {
      title = titleSpan.textContent.trim();
    } else {
      // fallback: whole element text
      title = element.textContent.trim();
    }
  }
  // 3. Extract panel content (right column)
  let contentCell = null;
  const panel = element.querySelector('[data-cmp-hook-accordion="panel"]');
  if (panel) {
    // Try to grab exactly the .cmp-text content (usually the FAQ answer)
    const textDiv = panel.querySelector('.cmp-text');
    if (textDiv) {
      contentCell = textDiv;
    } else {
      // fallback: use panel's first child, or panel itself
      if (panel.children.length) {
        contentCell = panel.children[0];
      } else {
        contentCell = panel;
      }
    }
  } else {
    // fallback: nothing found, use empty string
    contentCell = '';
  }
  // 4. Assemble final table cell structure
  const cells = [
    headerRow,
    [title, contentCell]
  ];
  // 5. Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
