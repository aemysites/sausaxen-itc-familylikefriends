/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion root element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;
  // Header row: must match exactly
  const rows = [['Accordion (accordion13)']];
  // Each accordion item becomes one table row with 2 columns
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title: prefer the .cmp-accordion__title span as the source of truth
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell = titleSpan ? titleSpan : document.createTextNode('');
    // Content: use the panel wrapper
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = document.createTextNode('');
    if (panel) {
      // Find the cmp-text block if present
      const cmpText = panel.querySelector('.cmp-text');
      if (cmpText) {
        contentCell = cmpText;
      } else {
        // Fallback: collect all panel children as a fragment
        if (panel.children.length > 0) {
          const fragment = document.createDocumentFragment();
          Array.from(panel.children).forEach(child => fragment.appendChild(child));
          contentCell = fragment.childNodes.length > 0 ? fragment : document.createTextNode(panel.textContent.trim());
        } else {
          contentCell = document.createTextNode(panel.textContent.trim());
        }
      }
    }
    rows.push([titleCell, contentCell]);
  });
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
