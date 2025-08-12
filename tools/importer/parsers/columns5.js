/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element is not empty
  if (!element) return;

  // Find the main row that holds the left and right columns
  const mainContent = element.querySelector('.footer-brand__primary--content');
  if (!mainContent) return;

  // Get the left column (logo section)
  const leftSection = mainContent.querySelector('.footer-brand__left');
  // Get the right column (nav section)
  const rightSection = mainContent.querySelector('.footer-brand__right');

  // Compose left column: logo (as link with img), then first column of links (About, Terms, Privacy)
  const col1Content = [];
  if (leftSection) {
    const logoLink = leftSection.querySelector('a');
    if (logoLink) col1Content.push(logoLink);
  }
  // Extract first list (About us, Terms and Conditions, Privacy Policy)
  let firstNavList = null;
  if (rightSection) {
    const nav = rightSection.querySelector('.footer-brand__navbar');
    if (nav) {
      // Left nav links
      const navLeft = nav.querySelector('.footer-brand__navbar--left');
      if (navLeft) {
        firstNavList = navLeft.querySelector('ul.footer-list');
        if (firstNavList) col1Content.push(firstNavList);
      }
    }
  }

  // Compose right column: second nav list (Contact, Sitemap, FAQs)
  const col2Content = [];
  if (rightSection) {
    const nav = rightSection.querySelector('.footer-brand__navbar');
    if (nav) {
      // Right nav links
      const navRight = nav.querySelector('.footer-brand__navbar--right');
      if (navRight) {
        const secondNavList = navRight.querySelector('ul.footer-list');
        if (secondNavList) col2Content.push(secondNavList);
      }
    }
  }

  // Defensive: ensure at least one column has content
  if (col1Content.length === 0 && col2Content.length === 0) return;

  // Build table header: single cell, 'Columns' (matches example, one column only)
  const headerRow = ['Columns'];
  // Build content row: two columns
  const columnsRow = [
    col1Content.length === 1 ? col1Content[0] : col1Content,
    col2Content.length === 1 ? col2Content[0] : col2Content
  ];

  // Table: header (1 col), content row (as many columns as needed)
  const cells = [
    headerRow,
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Set header cell colspan so it visually matches the example
  const th = table.querySelector('th');
  if (th) {
    th.setAttribute('colspan', columnsRow.length);
  }
  element.replaceWith(table);
}
