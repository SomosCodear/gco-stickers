import React from 'react';
import PropTypes from 'prop-types';
import { Sticker } from './Sticker';

export const StickerSelector = ({ stickers, select, deselect }) => (
  <div>
    {stickers.map(({ name, filename, selected }) => (
      <Sticker
        key={name}
        name={name}
        filename={filename}
        selected={selected}
        toggleSelection={() => (selected ? deselect(name) : select(name))}
      />
    ))}
  </div>
);

StickerSelector.propTypes = {
  stickers: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
  })).isRequired,
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
};
