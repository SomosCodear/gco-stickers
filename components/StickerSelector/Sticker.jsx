import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StickerButton = styled.button.attrs(() => ({ type: 'button' }))`
  border: 0;
  background: none;
  padding: 0;
  border: 1px solid ${({ selected }) => (selected ? 'green' : 'transparent')};
`;

export const Sticker = ({
  name,
  filename,
  selected,
  toggleSelection,
}) => (
  <StickerButton
    onClick={toggleSelection}
    selected={selected}
  >
    <img src={`/images/stickers/${filename}`} alt={name} />
  </StickerButton>
);

Sticker.propTypes = {
  name: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  toggleSelection: PropTypes.func.isRequired,
};
