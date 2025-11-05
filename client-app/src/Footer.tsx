import React from 'react';
import { Container, Icon, Segment } from 'semantic-ui-react';

const Footer: React.FC = () => {
  return (
    <Segment
      inverted
      vertical
      textAlign="center"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '1em 0',
        zIndex: 1000,
        background: '#1b1c1d', // mismo color que "inverted"
        borderRadius: 0
      }}
    >
      <Container>
        <p style={{ marginBottom: '0.3em' }}>
          © {new Date().getFullYear()} Matias Chedas — All rights reserved.
        </p>
        <div>
          <a href="https://github.com/matiaschedas" target="_blank" rel="noopener noreferrer">
            <Icon name="github" size="large" inverted link />
          </a>
          <a href="https://linkedin.com/in/matias-chedas/" target="_blank" rel="noopener noreferrer">
            <Icon name="linkedin" size="large" inverted link />
          </a>
          <a href="mailto:matias.chedas@hotmail.com">
            <Icon name="mail" size="large" inverted link />
          </a>
        </div>
      </Container>
    </Segment>
  );
};

export default Footer;