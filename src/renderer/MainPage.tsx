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
import React, { useState, SyntheticEvent } from 'react';
import {
  FloatingLabel,
  Form,
  Col,
  Row,
  Accordion,
  OverlayTrigger,
  Tooltip,
  Button,
} from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import { IProps } from 'react-qrcode-logo';
import { SketchPicker } from 'react-color';
import QCode from './QRCode';
import SideNav from './SideNav';
import MainHeader from './MainHeader';
import SquareAdjust from './components/SquareAdjust';
import icon from '../../assets/images/profile-pic.png';
import NumberSpinner from './components/NumberSpinner';

export default function MainPage() {
  const [editConfig, setEditConfig] = useState(false);
  const [myProps, setMyProps] = useState<IProps>({
    value: 'https://google.com/',
    ecLevel: 'H',
    size: 175,
    quietZone: 0,
    enableCORS: true,
    bgColor: '#FFFFFF',
    fgColor: '#68248B',
    logoImage: icon,
    logoWidth: 40,
    logoHeight: 40,
    logoOpacity: 10,
    removeQrCodeBehindLogo: false,
    qrStyle: 'dots',
    eyeColor: '#68248B',
    eyeRadius: [
      [30, 30, 0, 30], // top/left eye
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

  const [logoImage, setLogoImage] = useState(myProps.logoImage);
  const [showLogo, setShowLogo] = useState(false);


  const loadConfiguration = () => {
    const dialogConfig = {
      properties: ['openFile'],
      filters: [
        {
          name: 'JSON',
          extensions: ['json'],
        },
      ],
    };
    window.electronAPI
      .openDialog(JSON.stringify(dialogConfig))
      // eslint-disable-next-line promise/always-return
      .then((result) => {
        const fName = result.filePaths[0];
        window.electronAPI
          .readFile(fName)
          .then((response) => {
            const config = JSON.parse(response);
            setMyProps({
              ...myProps,
              ...config,
            });
            return '';
          })
          .catch((error: unknown) => {
            console.log(`Error: ${error}`);
            return '';
          });
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };
  const setFileName = (result: SyntheticEvent) => {
    const read = new FileReader();
    read.readAsDataURL(result.target.files[0]);
    read.onloadend = () => {
      setMyProps({
        ...myProps,
        logoImage: read.result as string,
      });
    };
  };

  const saveConfiguration = () => {
    window.electronAPI
      .saveConfig(JSON.stringify(myProps))
      .then((response: string) => {
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
    setTopLeftEye(val);
    setMyProps({
      ...myProps,
      eyeRadius: [val, topRightEye, bottomLeftEye],
    });
    setForceUpdate(!forceUpdate);
  };

  const updateTopRightEye = (val: number[]) => {
    setTopRightEye(val);
    setMyProps({
      ...myProps,
      eyeRadius: [topLeftEye, val, bottomLeftEye],
    });
    setForceUpdate(!forceUpdate);
  };

  const updateBottomLeftEye = (val: number[]) => {
    setBottomLeftEye(val);
    setMyProps({
      ...myProps,
      eyeRadius: [topLeftEye, topRightEye, val],
    });
    setForceUpdate(!forceUpdate);
  };

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
            ext="png"
            topRight={topRightEye}
            topLeft={topLeftEye}
            bottomLeft={bottomLeftEye}
            forceUpdate={forceUpdate}
            showQRLogo={showLogo}
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
                      value={myProps.size}
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
                <Row>
                  <Col sm={8}>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Choose Image</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={setFileName}
                        accept=".png,.jpg,.jpeg"
                      />
                    </Form.Group>
                  </Col>
                  {showLogo ? (<Col sm={4}>
                     <img
                      src={myProps.logoImage}
                      alt="logo"
                      style={{ width: '100px', height: '100px' }}
                    />
                  </Col>) : null}
                </Row>
                <Form.Group as={Row}>
                  <Col lg="2">
                    <Form.Label>Show Logo</Form.Label>
                  </Col>
                  <Col lg="2">
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label=""
                      checked={showLogo}
                      onChange={(e) => {
                        setLogoImage(e.target.checked ? myProps.logoImage : '');
                        setShowLogo(e.target.checked);
                      }}
                    />
                  </Col>
                  <Col lg="8" />
                </Form.Group>

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
                      enabled={showLogo}
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
                      enabled={showLogo}
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
                        enabled={showLogo}
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
                      enabled={showLogo}
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
                      enabled={showLogo}
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
                      enabled={showLogo}
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
                      enabled={showLogo}
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

          <Row>
            <Col sm={2} />
            <Col sm={4}>
              <Button
                variant="success"
                size="sm"
                value="Load Configuration"
                onClick={loadConfiguration}
              >
                Load File
              </Button>
            </Col>
            <Col sm={4}>
              <Button
                variant="success"
                value="Save Configuration"
                size="sm"
                onClick={saveConfiguration}
              >
                Save File
              </Button>
            </Col>
            <Col sm={2} />
          </Row>
          <p />
          {/* <Button variant="primary" value="Get Image" onClick={getNewImage}>
            Get Image
          </Button> */}
      </div>
    </div>
  );
}
