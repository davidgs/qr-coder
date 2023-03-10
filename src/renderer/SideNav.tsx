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
import { useState, useEffect } from 'react';
import { Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import icon from '../../assets/images/profile-pic.png';

export default function SideNav({
  showConfig,
  callback,
}: {
  showConfig: boolean;
  callback: (value: boolean) => void;
}) {
  const [enableConfig, setEnableConfig] = useState(showConfig);

  useEffect(() => {
    setEnableConfig(showConfig);
  }, [showConfig]);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      <aside className="theme-base-09 sidebar">
        <p />
        <p />
        <a
          href="https://startree.ai/"
          target="_blank"
          rel="qr_config noreferrer"
        >
          <img src={icon} alt="David G. Simmons" width="80px" height="80px" />
        </a>
        <div className="container sidebar-sticky">
          <div className="sidebar-about">
            <p className="lead">A QR Code Styler</p>
            <p className="lead">Brought to you by</p>
            <p>
              <a href="mailto:davidgs@davidgs.com">David G. Simmons</a>
            </p>
          </div>
          <nav>
            <ul className="sidebar-nav">
              <li>
                <a href="https://davidgs.com">Home</a>{' '}
              </li>
              <li>
                <a href="https://github.com/davidgs/"> Github </a>
              </li>
            </ul>
          </nav>
          <p>&copy; David G. Simmons 2022</p>
          <p>All rights reserved</p>
          <Form>
            <Row>
              <Col>
                {/* <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="config-tooltip">
                      Edit the Configuration
                    </Tooltip>
                  }
                >
                  <Form.Check
                    type="switch"
                    className="configSwitch"
                    id="custom-switch"
                    key="config-switch"
                    label="Edit Configuration"
                    aria-label="Edit Configuration"
                    checked={enableConfig}
                    onChange={(e) => {
                      callback(e.target.checked);
                    }}
                  />
                </OverlayTrigger> */}
              </Col>
            </Row>
          </Form>
        </div>
      </aside>
    </div>
  );
}
