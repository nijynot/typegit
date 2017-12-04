import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class MetaPortal extends React.Component {
  constructor(props) {
    super(props);
    const el = document.createElement('div');
    el.className = 'clearfix';
    this.el = el;
  }
  componentDidMount() {
    const modalRoot = document.getElementById('header-portal');
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    const modalRoot = document.getElementById('header-portal');
    modalRoot.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

MetaPortal.propTypes = {

};

module.exports = MetaPortal;
