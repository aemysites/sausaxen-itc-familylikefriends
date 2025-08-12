/* global WebImporter */
export default function parse(element, { document }) {
  // The block header matches exactly: Cards (cards6)
  const cells = [['Cards (cards6)']];

  // Defensive check for structure
  const bannerSection = element.querySelector('.banner-section');
  if (bannerSection) {
    const link = bannerSection.querySelector('a');
    if (link) {
      // Image cell (must be existing <img>)
      let imgEl = null;
      const imgContainer = link.querySelector('.cardImageContainer');
      if (imgContainer) {
        imgEl = imgContainer.querySelector('img');
      }

      // Text cell: build array of existing elements
      const cardContent = link.querySelector('.cardContent');
      const textEls = [];
      if (cardContent) {
        const title = cardContent.querySelector('.cardTitle');
        if (title) textEls.push(title);
        const desc = cardContent.querySelector('.cardDescription');
        if (desc) textEls.push(desc);
      }

      // Push single card row with both cells
      cells.push([
        imgEl,
        textEls
      ]);
    }
  }

  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
