import React, {
  useReducer,
  useState,
  useMemo,
  useCallback,
} from 'react';
import * as R from 'ramda';
import stickers from '../data/stickers.json';
import { StickerSelector } from '../components/StickerSelector';

const BORDERS = [
  'Negro',
  'Blanco',
  'Sin borde',
];
const BASES = [
  'En punta',
  'Recta',
];
const API_URL = 'https://cvlst4nu7c.execute-api.sa-east-1.amazonaws.com/default/gco-stickers';

const ADD_STICKER = 'ADD_STICKER';
const REMOVE_STICKER = 'REMOVE_STICKER';
const selectedStickersReducer = (state, action) => {
  switch (action.type) {
    case ADD_STICKER:
      return R.append(action.payload, state);
    case REMOVE_STICKER:
      return R.reject(R.equals(action.payload), state);
    default:
      return state;
  }
};

const Home = () => {
  const [stickersCategory, setStickersCategory] = useState(null);
  const [stickersFilter, setStickersFilter] = useState('');
  const [selectedStickers, dispatch] = useReducer(selectedStickersReducer, []);
  const [stickersBorder, setStickersBorder] = useState(BORDERS[0]);
  const [stickersBase, setStickersBase] = useState(BASES[0]);
  const [email, setEmail] = useState('');

  const categories = useMemo(() => R.map(R.prop('category'))(stickers), []);
  const stickersInfo = useMemo(
    () => {
      const lowerCasedFilter = stickersFilter.toLowerCase();

      return R.into(
        [],
        R.compose(
          R.map((sticker) => R.assoc('selected', selectedStickers.includes(sticker.name))(sticker)),
          R.filter(
            ({ category, name, tags }) => (
              R.isNil(stickersCategory)
              || category === stickersCategory
            ) && (
              R.trim(lowerCasedFilter) === ''
              || name.toLowerCase().includes(lowerCasedFilter)
              || R.any((tag) => tag.includes(lowerCasedFilter))(tags)
            ),
          ),
        ),
        stickers,
      );
    },
    [stickersCategory, stickersFilter, selectedStickers],
  );

  const buy = useCallback(async (event) => {
    event.preventDefault();
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        email,
        border: stickersBorder,
        base: stickersBase,
        stickers: selectedStickers,
      }),
    });
    const { paymentUrl } = await res.json();

    window.location.assign(paymentUrl);
  }, [selectedStickers, stickersBorder, stickersBase, email]);

  return (
    <div>
      <ul>
        <li>
          <button
            type="button"
            onClick={() => setStickersCategory(null)}
            disabled={stickersCategory === null}
          >
            Todos
          </button>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              type="button"
              onClick={() => setStickersCategory(category)}
              disabled={stickersCategory === category}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
      <input
        type="search"
        value={stickersFilter}
        onChange={({ target: { value } }) => setStickersFilter(value)}
      />
      <StickerSelector
        stickers={stickersInfo}
        select={(sticker) => dispatch({ type: ADD_STICKER, payload: sticker })}
        deselect={(sticker) => dispatch({ type: REMOVE_STICKER, payload: sticker })}
      />
      <form onSubmit={buy}>
        <label>
          Borde:&nbsp;
          <select
            defaultValue={stickersBorder}
            onChange={({ target: { value } }) => setStickersBorder(value)}
            required
          >
            {BORDERS.map((border) => (
              <option key={border} value={border}>
                {border}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Base:&nbsp;
          <select
            defaultValue={stickersBase}
            onChange={({ target: { value } }) => setStickersBase(value)}
            required
          >
            {BASES.map((base) => (
              <option key={base} value={base}>
                {base}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Email:&nbsp;
          <input
            type="email"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={R.isEmpty(selectedStickers)}>
          Comprar
        </button>
      </form>
    </div>
  );
};

export default Home;
