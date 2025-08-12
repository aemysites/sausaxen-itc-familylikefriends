/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards3) block header
  const headerRow = ['Cards (cards3)'];
  const cells = [headerRow];

  // Try to find the card container in a resilient way
  // For this HTML, it's a single card inside .pop-content
  const popContent = element.querySelector('.pop-content');
  if (popContent) {
    // Image: .img_holder img
    const imgHolder = popContent.querySelector('.pop-image_text-container .img_holder img');
    // Text: .text_box (should contain h4 and p)
    const textBox = popContent.querySelector('.pop-image_text-container .text_box');
    // CTA: .cta_box a
    const ctaLink = popContent.querySelector('.cta_box a');

    const textElements = [];
    if (textBox) {
      const heading = textBox.querySelector('h4');
      if (heading) textElements.push(heading);
      const desc = textBox.querySelector('p');
      if (desc) textElements.push(desc);
    }
    if (ctaLink) {
      textElements.push(ctaLink);
    }

    // Only add a card row if both image and text content exist
    if (imgHolder && textElements.length > 0) {
      cells.push([imgHolder, textElements]);
    }
  }

  // Only replace if there is at least one card row beyond the header
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
