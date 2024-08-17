import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ copyrightText }) => (
    <footer className="footer mt-4">
        <div className="container">
            <span className="text-muted">{copyrightText}</span>
        </div>
    </footer>
);

Footer.propTypes = {
    copyrightText: PropTypes.string,
};

Footer.defaultProps = {
    copyrightText: '© Copyright - 2024 Daniel Obuchowicz',
};

export default Footer;
