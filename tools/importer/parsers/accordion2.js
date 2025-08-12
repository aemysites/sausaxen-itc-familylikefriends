/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row with exact block name from instructions
  const headerRow = ['Accordion (accordion2)'];

  // Extract the title cell: prefer the .cmp-accordion__title span node directly
  let titleCell;
  const btn = element.querySelector('.cmp-accordion__button');
  if (btn) {
    const titleSpan = btn.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleCell = titleSpan;
    } else {
      // Fallback: use button's text (removing icon span if present)
      // Remove last child if it's icon span
      let btnClone = btn.cloneNode(true);
      const iconSpan = btnClone.querySelector('.cmp-accordion__icon');
      if (iconSpan) iconSpan.remove();
      titleCell = document.createTextNode(btnClone.textContent.trim());
    }
  } else {
    // Fallback to the h3 text
    const h3 = element.querySelector('h3');
    titleCell = h3 ? document.createTextNode(h3.textContent.trim()) : document.createTextNode('');
  }

  // Extract the content cell: all content inside .cmp-accordion__panel
  let contentCell;
  const panel = element.querySelector('.cmp-accordion__panel');
  if (panel) {
    // Move all panel's children into a fragment for accurate reference
    const frag = document.createDocumentFragment();
    Array.from(panel.childNodes).forEach(child => {
      frag.appendChild(child);
    });
    contentCell = frag;
  } else {
    contentCell = document.createTextNode('');
  }

  // Compose the table according to block definition
  const cells = [
    headerRow,
    [titleCell, contentCell]
  ];

  // Create and insert the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
