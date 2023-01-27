import React, { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import NumberSpinner from './NumberSpinner';
import '../hyde.css';

function SquareAdjust({
  square,
  returnValue,
}: {
  square: number[];
  returnValue: (retVal: number[]) => void;
}) {
  const [currentSquare, setCurrentSquare] = useState<number[]>(square);
  const [lockAspect, setLockAspect] = useState(false);

  const updateSquare = (value: number) => {
    const s = currentSquare;
    s[0] = value;
    s[1] = value;
    s[2] = value;
    s[3] = value;
    setCurrentSquare(s);
    returnValue(s);
  };
  const setLocked = () => {
    if (!lockAspect) {
      const s = currentSquare;
      s[1] = s[0];
      s[2] = s[0];
      s[3] = s[0];
      setCurrentSquare(s);
      returnValue(s);
      console.log('locked: ', s);
    }
    setLockAspect(!lockAspect);
  };
  const unlocked = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-unlock"
      viewBox="0 0 16 16"
    >
      <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z" />
    </svg>
  );
  const locked = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-lock-fill"
      viewBox="0 0 16 16"
    >
      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    </svg>
  );
  useEffect(() => {
    setCurrentSquare(square);
  }, [square]);

  const topLeft = (value: number) => {
    const s = currentSquare;
    s[0] = value;
    if (lockAspect) {
      updateSquare(value);
    } else {
      setCurrentSquare(s);
      returnValue(s);
    }
  };

  const topRight = (value: number) => {
    const s = currentSquare;
    s[1] = value;
    if (lockAspect) {
      updateSquare(value);
    } else {
      setCurrentSquare(s);
      returnValue(s);
    }
  };

  const bottomLeft = (value: number) => {
    const s = currentSquare;
    s[2] = value;
    if (lockAspect) {
      updateSquare(value);
    } else {
      setCurrentSquare(s);
      returnValue(s);
    }
  };

  const bottomRight = (value: number) => {
    const s = currentSquare;
    s[3] = value;
    if (lockAspect) {
      updateSquare(value);
    } else {
      setCurrentSquare(s);
      returnValue(s);
    }
  };

  return (
    <div className="square">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '22%',
        }}
      >
        <NumberSpinner
          min={0}
          max={50}
          step={1}
          value={currentSquare[0]}
          style={{ width: '49%' }}
          callback={topLeft}
        />
        <NumberSpinner
          min={0}
          max={50}
          step={1}
          value={currentSquare[1]}
          style={{ width: '49%' }}
          callback={topRight}
        />
      </div>
      <div
        className="centerbutton"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(40%, 100%)',
        }}
      >
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Lock all corners</Tooltip>}
        >
          <Button
            variant="outline-secondary"
            style={{ width: '20%' }}
            onClick={setLocked}
          >
            {lockAspect ? locked : unlocked}
          </Button>
        </OverlayTrigger>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'bottom',
          height: '20%',
          paddingTop: '90px',
        }}
      >
        <NumberSpinner
          min={0}
          max={50}
          step={1}
          value={currentSquare[3]}
          style={{ width: '49%' }}
          callback={bottomRight}
        />
        <NumberSpinner
          min={0}
          max={50}
          step={1}
          value={currentSquare[2]}
          style={{ width: '49%' }}
          callback={bottomLeft}
        />
      </div>
    </div>
  );
}

export default SquareAdjust;
