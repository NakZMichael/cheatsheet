import React, { useEffect, useState } from 'react';

export default function PlayGround() {
  const [items, setItems] = useState(['初期値']);
  const appendItem = () => {
    setItems((prev) => [...prev, '初期値']);
  };
  const [refs, setRefs] = useState<React.RefObject<HTMLInputElement>[]>([]);
  useEffect(() => {
    setRefs(items.map(() => React.createRef()));
  }, [items.length]);
  const focusOnThirdElement = () => {
    if (
      items.length < 3
    ) {
      return;
    }
    refs[2].current?.focus();
  };
  return (
    <>
      {items.map((item, index) => (
        <div>
          <input
            ref={refs[index]}
            type="text"
            value={item}
            onChange={(e) => {
              setItems((prev) => {
                const newItems = [...prev];
                newItems[index] = e.target.value;
                return newItems;
              });
            }}
          />
        </div>
      ))}
      <input type="button" value="追加" onClick={() => appendItem()} />
      <input type="button" value="フォーカス" onClick={() => focusOnThirdElement()} />
    </>
  );
}
