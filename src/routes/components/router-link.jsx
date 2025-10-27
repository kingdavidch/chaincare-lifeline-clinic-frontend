import { Link } from 'react-router-dom';

import { forwardRef } from 'react';

import PropTypes from 'prop-types';

const RouterLink = forwardRef(({ href, ...other }, ref) => <Link ref={ref} to={href} {...other} />);

RouterLink.propTypes = {
  href: PropTypes.string,
};

export default RouterLink;
