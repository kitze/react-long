import React, {Component} from 'react';

class LongPress extends Component {
  shouldShortPress = true;
  moved = false;

  state = {
    touch: true
  };

  static defaultProps = {
    time: 500
  };

  componentDidMount() {
    try {
      document.createEvent('TouchEvent');
    } catch (e) {
      // touch is not available, disable handlers
      this.setState({touch: false});
    }
  }

  componentWillUnmount() {
    this.cancelTimeout();
  }

  startTimeout = () => {
    this.timeout = setTimeout(this.longPressed, this.props.time);
  };

  longPressed = () => {
    this.shouldShortPress = false;
    if (this.props.onLongPress && this.moved === false) {
      this.props.onLongPress();
    }
  };

  cancelTimeout = () => {
    clearTimeout(this.timeout);
  };

  onTouchStart = e => {
    this.shouldShortPress = true;
    this.moved = false;
    this.startTimeout();
    if (typeof this.props.onTouchStart === 'function') {
      this.props.onTouchStart(e);
    }
  };

  onTouchEnd = e => {
    this.cancelTimeout();
    if (this.props.onPress && this.shouldShortPress && this.moved === false) {
      this.props.onPress();
    }
    if (typeof this.props.onTouchEnd === 'function') {
      this.props.onTouchEnd(e);
    }
  };

  onTouchCancel = e => {
    this.cancelTimeout();
    if (typeof this.props.onTouchCancel === 'function') {
      this.props.onTouchCancel(e);
    }
  };

  onMove = e => {
    this.moved = true;
    if (typeof this.props.onTouchMove === 'function') {
      this.props.onTouchMove(e);
    }
  };

  render() {
    const {children, disabled} = this.props;
    const {touch} = this.state;

    if (!touch || disabled) {
      return children;
    }

    const props = {
      onContextMenu: e => e.preventDefault(),
      onTouchStart: this.onTouchStart,
      onTouchEnd: this.onTouchEnd,
      onTouchMove: this.onMove,
      onTouchCancel: this.onTouchCancel,
      style: {
        ...children.props.style,
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }
    };

    return React.cloneElement(children, {...children.props, ...props});
  }
}

export default LongPress;
