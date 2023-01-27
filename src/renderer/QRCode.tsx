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
import { useEffect, useState, useRef, SyntheticEvent } from 'react';
import PropTypes from 'prop-types';
import { QRCode, IProps } from 'react-qrcode-logo';
import {
  Button,
  OverlayTrigger,
  Tooltip,
  Dropdown,
  DropdownButton,
  Row,
  Col,
} from 'react-bootstrap';
import { ClipboardData, Clipboard2CheckFill } from 'react-bootstrap-icons';

import './hyde.css';

export default function QCode({
  QRProps,
  ext,
  topRight,
  topLeft,
  bottomLeft,
  forceUpdate,
}: {
  QRProps: IProps;
  ext: string;
  topRight: number[];
  topLeft: number[];
  bottomLeft: number[];
  forceUpdate: boolean;
}) {
  const [copied, setCopied] = useState<boolean>(false);
  const [imageProps, setImageProps] = useState<IProps>({} as IProps);
  const [fileExt, setFileExt] = useState<string>(ext);
  const [myTopRight, setTopRight] = useState<number[]>(topRight);
  const [myTopLeft, setTopLeft] = useState<number[]>(topLeft);
  const [myBottomLeft, setBottomLeft] = useState<number[]>(bottomLeft);
  const [show, setShow] = useState<boolean>(false);
  const [myQCode, setQrCode] = useState<QRCode>(null);
  const ref = useRef(null);

  const onExtensionChange = (event: SyntheticEvent) => {
    const ev = event.target as HTMLInputElement;
    setFileExt(ev?.id);
  };

  // const qrCode = new QRCode({
  //   ...imageProps,
  //   eyeRadius: [myTopLeft, myTopRight, myBottomLeft],
  //   logoImage: imageProps?.logoImage,
  //   logoWidth: imageProps?.logoWidth,
  //   logoHeight: imageProps?.logoHeight,
  //   logoOpacity: imageProps?.logoOpacity,
  //   quietZone: imageProps?.quietZone,
  //   size: imageProps?.size,
  //   value: imageProps?.value,
  //   id: 'react-qrcode-logo',
  // });
  useEffect(() => {
    console.log('image props changed');
    console.log('topLeft: ', topLeft);
    console.log('topRight: ', topRight);
    console.log('bottomLeft: ', bottomLeft);
    setImageProps({ ...QRProps });
    const p = { ...QRProps };
    const er = p?.eyeRadius;
    setTopRight(er[1]);
    setTopLeft(er[0]);
    setBottomLeft(er[2]);
    setQrCode(
      new QRCode({
        ...imageProps,
      })
    );
  }, [QRProps, topRight, topLeft, bottomLeft]);

  useEffect(() => {
    setShow(forceUpdate);
  }, [forceUpdate]);

  useEffect(() => {
    console.log('bottom left props changed');
    setBottomLeft(bottomLeft);
  }, [bottomLeft]);

  useEffect(() => {
    console.log('top left props changed');
    setTopLeft(topLeft);
  }, [topLeft]);

  useEffect(() => {
    console.log('top right props changed');
    setTopRight(topRight);
  }, [topRight]);

  useEffect(() => {
    setFileExt(ext);
  }, [ext]);

  const onDownloadClick = () => {
    const canvas = document.getElementById(
      'react-qrcode-logo'
    ) as HTMLCanvasElement;

    const dataURL = canvas?.toDataURL(`image/${fileExt}`);
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `qrcode.${fileExt}`;
    a.click();
  };

  // Copy link to the clipboard and change the icon to a checkmark
  function copyMe(): void {
    setCopied(!copied);
    navigator.clipboard
      .writeText(imageProps.value || '')
      .then(null, null)
      // eslint-disable-next-line no-console
      .catch((err) => console.error('Error: ', err));
  }

  return (
    <div>
      <div className="alert-columns">
        <div className="alert-column1">
          {/* {copied && (
            <OverlayTrigger
              delay={{ show: 250, hide: 400 }}
              rootClose
              overlay={
                <Tooltip id="alert-tooltip">
                  You have successfully copied the link!
                </Tooltip>
              }
            >
              <Clipboard2CheckFill
                className="copy-icon header-stuff"
                style={{
                  fontSize: '2rem',
                  color: '#0B263E',
                }}
              />
            </OverlayTrigger>
          )}
          {!copied && (
            <OverlayTrigger
              placement="auto"
              delay={{ show: 250, hide: 400 }}
              rootClose
              overlay={
                <Tooltip id="alert-tooltip">
                  Click here to copy your link!
                </Tooltip>
              }
            >
              <ClipboardData
                className="copy-icon header-stuff"
                tabIndex={0}
                cursor="pointer"
                role="button"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={copyMe}
                // eslint-disable-next-line react/jsx-no-bind
                onKeyPress={copyMe}
                title="Click to copy your link!"
              />
            </OverlayTrigger>
          )} */}
        </div>
        <div className="alert-column2">
          {/* <OverlayTrigger
            placement="auto"
            delay={{ show: 250, hide: 400 }}
            rootClose
            overlay={
              <Tooltip id="alert-tooltip">
                Click here to copy your QR Code!
              </Tooltip>
            }
          >
            <div onClick={copyMe} onKeyDown={copyMe} role="button" tabIndex={0}>
              <strong style={{ cursor: 'pointer' }} className="header-stuff">
                {' '}
                {imageProps.value}{' '}
              </strong>
            </div>
          </OverlayTrigger> */}
        </div>
        <div className="alert-column3">
          <Row>
            <div>
              {myQCode?.render}
              {/* <QRCode
                id="react-qrcode-logo"
                value={imageProps.value || ''}
                ecLevel={imageProps.ecLevel || 'L'}
                size={imageProps.size || 200}
                quietZone={imageProps.quietZone || 0}
                enableCORS={imageProps.enableCORS || true}
                bgColor={imageProps.bgColor || '#FFFFFF'}
                fgColor={imageProps.fgColor || '#000000'}
                logoImage={imageProps.logoImage || ''}
                logoWidth={imageProps.logoWidth || 100}
                logoHeight={imageProps.logoHeight || 100}
                logoOpacity={imageProps.logoOpacity || 10}
                removeQrCodeBehindLogo={
                  imageProps.removeQrCodeBehindLogo || false
                }
                qrStyle={imageProps.qrStyle || 'squares'}
                eyeColor={imageProps.eyeColor || '#000000'}
                eyeRadius={[
                  myTopLeft, // top/left eye
                  myTopRight, // top/right eye
                  myBottomLeft, // bottom/left
                ]}
              /> */}
            </div>
          </Row>
          {/* <Row>
            <Col sm="6">
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>Choose image Format</Tooltip>}
              >
                <DropdownButton
                  id="dropdown-basic-button"
                  title={fileExt.toUpperCase()}
                  size="sm"
                  flip
                >
                  <Dropdown.Item
                    style={{ color: '#000000' }}
                    id="png"
                    onClick={onExtensionChange}
                  >
                    PNG
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{ color: '#000000' }}
                    id="jpeg"
                    onClick={onExtensionChange}
                  >
                    JPEG
                  </Dropdown.Item>
                </DropdownButton>
              </OverlayTrigger>
            </Col>
            <Col sm="6">
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>Download your QR Code</Tooltip>}
              >
                <Button size="sm" onClick={onDownloadClick}>
                  Download
                </Button>
              </OverlayTrigger>
            </Col>
          </Row> */}
        </div>
      </div>
    </div>
  );
}

QCode.propTypes = {
  QRProps: PropTypes.shape({
    value: PropTypes.string.isRequired,
    ecLevel: PropTypes.oneOf(['L', 'M', 'Q', 'H']).isRequired,
    enableCORS: PropTypes.bool.isRequired,
    size: PropTypes.number.isRequired,
    quietZone: PropTypes.number.isRequired,
    bgColor: PropTypes.string.isRequired,
    fgColor: PropTypes.string.isRequired,
    logoImage: PropTypes.string,
    logoWidth: PropTypes.number,
    logoHeight: PropTypes.number,
    logoOpacity: PropTypes.number,
    removeQrCodeBehindLogo: PropTypes.bool,
    eyeRadius: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number),
    ]),
    eyeColor: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    qrStyle: PropTypes.oneOf(['squares', 'dots']),
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.object,
    id: PropTypes.string,
  }).isRequired,
  ext: PropTypes.string.isRequired,
};
