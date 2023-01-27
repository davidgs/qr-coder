/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import './hyde.css';
import React, { useState, useEffect } from 'react';
import {
  FloatingLabel,
  Form,
  Col,
  Row,
  Accordion,
  Card,
  OverlayTrigger,
  Tooltip,
  Button,
} from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import { IProps, CornerRadii, InnerOuterEyeColor } from 'react-qrcode-logo';
import { SketchPicker } from 'react-color';
import QCode from './QRCode';
import SideNav from './SideNav';
import MainHeader from './MainHeader';
import SquareAdjust from './components/SquareAdjust';
import icon from '../../assets/images/startree_logo-mark_fill-lightning-4.png';
import NumberSpinner from './components/NumberSpinner';
import { electron } from 'process';

export default function MainPage() {
  const [editConfig, setEditConfig] = useState(false);
  const [myProps, setMyProps] = useState<IProps>({
    value: 'https://google.com/',
    ecLevel: 'H',
    size: 175,
    quietZone: 0,
    enableCORS: true,
    bgColor: '#FFFFFF',
    fgColor: '#1F3A56',
    logoImage: icon,
    logoWidth: 100,
    logoHeight: 100,
    logoOpacity: 10,
    removeQrCodeBehindLogo: false,
    qrStyle: 'dots',
    eyeColor: '#1F3A56',
    eyeRadius: [
      [30, 0, 30, 30], // top/left eye
      [30, 30, 30, 0], // top/right eye
      [30, 0, 30, 30], // bottom/left
    ],
  });

  const [topLeftEye, setTopLeftEye] = useState<number[]>(myProps.eyeRadius[0]);
  const [topRightEye, setTopRightEye] = useState<number[]>(
    myProps.eyeRadius[1]
  );
  const [bottomLeftEye, setBottomLeftEye] = useState<number[]>(
    myProps.eyeRadius[2]
  );
  const [isLocked, setIsLocked] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const setLockAspectRatio = () => {
    setIsLocked(!isLocked);
  };

  const saveConfiguration = () => {
    console.log('saveConfiguration: ', myProps);
    window.electronAPI
      .saveConfig(JSON.stringify(myProps))
      .then((response: string) => {
        console.log(`Response: ${response}`);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

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
  const updateTopLeftEye = (val: number[]) => {
    console.log('updateTopLeftEye: ', val);
    setTopLeftEye(val);
    setMyProps({
      ...myProps,
      eyeRadius: [val, topRightEye, bottomLeftEye],
    });
    setForceUpdate(!forceUpdate);
  };

  const updateTopRightEye = (val: number[]) => {
    console.log('updateTopRightEye: ', val);
    setTopRightEye(val);
    setMyProps({
      ...myProps,
      eyeRadius: [topLeftEye, val, bottomLeftEye],
    });
    setForceUpdate(!forceUpdate);
  };

  const updateBottomLeftEye = (val: number[]) => {
    console.log('updateBottomLeftEye: ', val);
    setBottomLeftEye(val);
    setMyProps({
      ...myProps,
      eyeRadius: [topLeftEye, topRightEye, val],
    });
    setForceUpdate(!forceUpdate);
  };

  // useEffect(() => {
  //   console.log('topLeftEye changed: ', topLeftEye);
  //   const newProps = { ...myProps };
  //   newProps.eyeRadius = [topLeftEye, topRightEye, bottomLeftEye];
  //   setMyProps(newProps);
  // }, [topLeftEye, topRightEye, bottomLeftEye]);

  // Foreground Color
  const [foreColor, setForeColor] = useState({
    r: '31',
    g: '58',
    b: '86',
    a: '100',
  });

  // Background Color
  const [backColor, setBackColor] = useState({
    r: '255',
    g: '255',
    b: '255',
    a: '100',
  });

  // Eye Color
  const [eyeColor, setEyeColor] = useState({
    r: '31',
    g: '58',
    b: '86',
    a: '100',
  });

  const [displayForeColorPicker, setDisplayForeColorPicker] = useState(false);
  const [displayEyeColorPicker, setDisplayEyeColorPicker] = useState(false);
  const [displayBackColorPicker, setDisplayBackColorPicker] = useState(false);

  // Styles for the Color Pickers
  const styles = {
    foreground: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${foreColor.r}, ${foreColor.g}, ${foreColor.b}, ${foreColor.a})`,
      },
    },
    background: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${backColor.r}, ${backColor.g}, ${backColor.b}, ${backColor.a})`,
      },
    },
    eye: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${eyeColor.r}, ${eyeColor.g}, ${eyeColor.b}, ${eyeColor.a})`,
      },
    },
    swatch: {
      padding: '5px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
    },
    popover: {
      position: 'absolute',
      zIndex: '2',
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    },
  };

  // Update the link/data
  const updateLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setMyProps({ ...myProps, value: event.target.value });
  };

  // Handle clicking on the Foreground Color
  const handleForeColorClick = () => {
    setDisplayForeColorPicker(!displayForeColorPicker);
  };

  // Handle closing the Foreground Color Picker
  const handleForeColorClose = () => {
    setDisplayForeColorPicker(false);
  };

  // Handle the Foreground Color Change
  const handleForeColorChange = (color: any) => {
    setForeColor(color.rgb);
    setMyProps({
      ...myProps,
      fgColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
    });
  };

  // Handle clicking on the Background Color
  const handleBackColorClick = () => {
    setDisplayBackColorPicker(!displayBackColorPicker);
  };

  // Handle closing the background Color Picker
  const handleBackColorClose = () => {
    setDisplayBackColorPicker(false);
  };

  // Handle the Background Color Change
  const handleBackColorChange = (color: any) => {
    setBackColor(color.rgb);
    setMyProps({
      ...myProps,
      bgColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
    });
  };
  // Handle the Eye Color Change
  const handleEyeColorChange = (color: any) => {
    setEyeColor(color.rgb);
    setMyProps({
      ...myProps,
      eyeColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
    });
  };

  // Handle clicking on the Eye Color Picker
  const handleEyeColorClick = () => {
    setDisplayEyeColorPicker(!displayEyeColorPicker);
  };

  // Handle closing the Eye Color Picker
  const handleEyeColorClose = () => {
    setDisplayEyeColorPicker(false);
  };

  const updateAspectRatio = (
    event: React.ChangeEvent<HTMLInputElement>,
    setting: string
  ) => {
    console.log('Logo Size: ', event.target.value);
    if (isLocked) {
      setMyProps({
        ...myProps,
        logoHeight: parseInt(event.target.value, 10),
        logoWidth: parseInt(event.target.value, 10),
      });
    } else if (setting === 'logoHeight') {
      setMyProps({
        ...myProps,
        logoHeight: parseInt(event.target.value, 10),
      });
    } else {
      setMyProps({
        ...myProps,
        logoWidth: parseInt(event.target.value, 10),
      });
    }
  };

  return (
    <div className="content">
      <div className="aside-column">
        <SideNav showConfig={editConfig} callback={setEditConfig} />
      </div>
      <div className="main-column">
        <MainHeader />
        <div>
          <QCode
            QRProps={myProps}
            ext="PNG"
            topRight={topRightEye}
            topLeft={topLeftEye}
            bottomLeft={bottomLeftEye}
            forceUpdate={forceUpdate}
          />
        </div>
        <p />
        <div>
          <FloatingLabel
            controlId="floatingInput"
            label="Enter Information to Encode"
            className="mb-3"
          >
            <Form.Control type="text" onChange={updateLink} />
          </FloatingLabel>
          <h1 style={{ textAlign: 'center' }}>QR Code Options</h1>
          <Accordion defaultActiveKey="0">
            {/* QR Code Size */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>QR Code Size</Accordion.Header>
              <Accordion.Body id="0">
                {/* QR Code Size */}
                <Form.Group as={Row}>
                  <Col lg="4">
                    <Form.Label>QRCode Size</Form.Label>
                  </Col>
                  <Col lg="2">
                    <Form.Control
                      defaultValue={myProps.size}
                      onChange={(e) => {
                        setMyProps({
                          ...myProps,
                          size: parseInt(e.target.value, 10),
                        });
                      }}
                    />
                  </Col>
                  <Col lg="6">
                    <RangeSlider
                      value={myProps.size}
                      min={50}
                      max={300}
                      onChange={(e) => {
                        setMyProps({
                          ...myProps,
                          size: parseInt(e.target.value, 10),
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            {/* QR Code Colors */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>QR Code Colors</Accordion.Header>
              <Accordion.Body id="1">
                {/* QR Code Foreground Color */}
                <Form.Group as={Row}>
                  <Col lg="6">
                    <Form.Label>Foreground Color</Form.Label>
                  </Col>
                  <Col lg="4">
                    <div style={styles.swatch} onClick={handleForeColorClick}>
                      <div style={styles.foreground.color} />
                    </div>
                    {displayForeColorPicker ? (
                      <div style={styles.popover}>
                        <div
                          style={styles.cover}
                          onClick={handleForeColorClose}
                        />
                        <SketchPicker
                          color={foreColor}
                          onChange={handleForeColorChange}
                        />
                      </div>
                    ) : null}
                  </Col>
                </Form.Group>
                <p />
                {/* QR Code Background Color */}
                <Form.Group as={Row}>
                  <Col lg="6">
                    <Form.Label>Background Color</Form.Label>
                  </Col>
                  <Col lg="4">
                    <div style={styles.swatch} onClick={handleBackColorClick}>
                      <div style={styles.background.color} />
                    </div>
                    {displayBackColorPicker ? (
                      <div style={styles.popover}>
                        <div
                          style={styles.cover}
                          onClick={handleBackColorClose}
                        />
                        <SketchPicker
                          color={backColor}
                          onChange={handleBackColorChange}
                        />
                      </div>
                    ) : null}
                  </Col>
                </Form.Group>
                <p />
                {/* QR Code Eye Color */}
                <Form.Group as={Row}>
                  <Col lg="6">
                    <Form.Label>Eye Color</Form.Label>
                  </Col>
                  <Col lg="4">
                    <div style={styles.swatch} onClick={handleEyeColorClick}>
                      <div style={styles.eye.color} />
                    </div>
                    {displayEyeColorPicker ? (
                      <div style={styles.popover}>
                        <div
                          style={styles.cover}
                          onClick={handleEyeColorClose}
                        />
                        <SketchPicker
                          color={eyeColor}
                          onChange={handleEyeColorChange}
                        />
                      </div>
                    ) : null}
                  </Col>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            {/* QR Code Styles */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>QR Code Styles</Accordion.Header>
              <Accordion.Body id="2">
                {/* QR Code Style */}
                <Form.Group as={Row}>
                  <Col lg="4">
                    <Form.Label>Style</Form.Label>
                  </Col>
                  <Col lg="6">
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => {
                        const style =
                          e.target.value === 'dots' ? 'dots' : 'squares';
                        setMyProps({
                          ...myProps,
                          qrStyle: style,
                        });
                      }}
                    >
                      <option value="dots">Dots</option>
                      <option value="squares">Squares</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            {/* QR Code Eye Styles */}
            <Accordion.Item eventKey="3">
              <Accordion.Header>QR Code Eye Styles</Accordion.Header>
              <Accordion.Body id="3">
                {/* QR Code Eye Style */}
                <Form.Group as={Row}>
                  <Col lg="3" />
                  <Col lg="6">
                    <h3 style={{ textAlign: 'center' }}>Eye Styles</h3>
                  </Col>
                  <Col lg="3" />
                </Form.Group>
                <Form.Group as={Row}>
                  <Col lg="6">
                    <Form.Label>Upper Left Corner</Form.Label>
                  </Col>
                  <Col lg="6">
                    <Form.Label>Upper Right Corner</Form.Label>
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Col lg="6">
                    <SquareAdjust
                      square={topLeftEye}
                      returnValue={updateTopLeftEye}
                    />
                  </Col>
                  <Col lg="6">
                    <SquareAdjust
                      square={topRightEye}
                      returnValue={updateTopRightEye}
                    />
                  </Col>
                </Form.Group>
                <p />
                <Form.Group as={Row}>
                  <Col lg="6">
                    <Form.Label>Lower Left Corner</Form.Label>
                  </Col>
                  <Col lg="6" />
                </Form.Group>
                <Form.Group as={Row}>
                  <Col lg="6">
                    <SquareAdjust
                      square={bottomLeftEye}
                      returnValue={updateBottomLeftEye}
                    />
                  </Col>
                  <Col lg="6" />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            {/* QR Code Error Correction */}
            <Accordion.Item eventKey="4">
              <Accordion.Header>QR Code Error Correction</Accordion.Header>
              <Accordion.Body id="4">
                {/* QR Code Error Correction */}
                <Form.Group as={Row}>
                  <Col lg="4">
                    <Form.Label>Error Correction</Form.Label>
                  </Col>
                  <Col lg="6">
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => {
                        const eq = e.target.value;
                        setMyProps({
                          ...myProps,
                          ecLevel: eq,
                        });
                      }}
                    >
                      <option value="L">L</option>
                      <option value="M">M</option>
                      <option value="Q">Q</option>
                      <option value="H">H</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            {/* QR Code Quiet Zone */}
            <Accordion.Item eventKey="5">
              <Accordion.Header>QR Code Quiet Zone</Accordion.Header>
              <Accordion.Body id="5">
                {/* Quiet Zone */}
                <Form.Group as={Row}>
                  <Col lg="4">
                    <Form.Label>Quiet Zone</Form.Label>
                  </Col>
                  <Col lg="6">
                    <NumberSpinner
                      min={0}
                      max={50}
                      step={1}
                      value={myProps.quietZone}
                      style={}
                      callback={(value: number) => {
                        setMyProps({
                          ...myProps,
                          quietZone: value,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            {/* QR Code Logo */}
            <Accordion.Item eventKey="6">
              <Accordion.Header>QR Code Logo Settings</Accordion.Header>
              <Accordion.Body id="6">
                {/* Logo */}
                {/* <Form.Group as={Row}>
                  <Col lg="4">
                    <Form.Label>Logo</Form.Label>
                  </Col>
                  <Col lg="6">
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => {
                        const logo = e.target.value;
                        setMyProps({
                          ...myProps,
                          logo: logo,
                        });
                      }}
                    >
                      <option value="none">None</option>
                      <option value="logo">Logo</option>
                    </Form.Select>
                  </Col>
                </Form.Group> */}
                {/* Logo Size */}
                <Form.Group as={Row}>
                  <Col lg="2">
                    <Form.Label>Logo Height</Form.Label>
                  </Col>
                  <Col lg="2">
                    <Form.Control
                      defaultValue={myProps.logoHeight}
                      value={myProps.logoHeight}
                      onChange={(e) => {
                        updateAspectRatio(e, 'logoWidth');
                      }}
                    />
                  </Col>
                  <Col lg="6">
                    <RangeSlider
                      value={myProps.logoHeight}
                      min={50}
                      max={300}
                      onChange={(e) => {
                        updateAspectRatio(e, 'logoHeight');
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Col lg="8" />
                  <Col lg="4">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Lock Aspect Ratio</Tooltip>}
                    >
                      <Button
                        variant="outline-secondary"
                        style={{ width: '20%' }}
                        onClick={setLockAspectRatio}
                      >
                        {isLocked ? locked : unlocked}
                      </Button>
                    </OverlayTrigger>
                  </Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Col lg="2">
                    <Form.Label>Logo Width</Form.Label>
                  </Col>
                  <Col lg="2">
                    <Form.Control
                      defaultValue={myProps.logoWidth}
                      value={myProps.logoWidth}
                      onChange={(e) => {
                        updateAspectRatio(e, 'logoWidth');
                      }}
                    />
                  </Col>
                  <Col lg="6">
                    <RangeSlider
                      value={myProps.logoWidth}
                      min={50}
                      max={300}
                      onChange={(e) => {
                        updateAspectRatio(e, 'logoWidth');
                      }}
                    />
                  </Col>
                </Form.Group>
                {/* Logo Opacity */}
                <Form.Group as={Row}>
                  <Col lg="4">
                    <Form.Label>Logo Opacity</Form.Label>
                  </Col>
                  <Col lg="6">
                    <RangeSlider
                      value={myProps.logoOpacity * 10}
                      min={0}
                      max={10}
                      onChange={(e) => {
                        setMyProps({
                          ...myProps,
                          logoOpacity: parseInt(e.target.value, 10) / 10,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
                {/* Hide QR Behind Logo */}
                <Form.Group as={Row}>
                  <Col lg="4">
                    <Form.Label>Hide QR Behind Logo</Form.Label>
                  </Col>
                  <Col lg="6">
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label=""
                      checked={myProps.removeQrCodeBehindLogo}
                      onChange={(e) => {
                        setMyProps({
                          ...myProps,
                          removeQrCodeBehindLogo: e.target.checked,
                        });
                      }}
                    />
                  </Col>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>{' '}
        {/* End of QR Code Settings */}
        <p />
        <div
          style={{
            alignContent: 'center',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button
            variant="primary"
            value="Save Configuration"
            onClick={saveConfiguration}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
