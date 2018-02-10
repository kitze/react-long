import React, {Component} from 'react';

class LongPress extends Component {
  shouldShortPress = true;
  moved = false;

  static defaultProps = {
    time: 500,
    mobileOnly: false,
    desktopOnly: false
  };

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
    if (this.props.onPress && this.shouldShortPress && this.moved === false) {
      this.props.onPress();
    }
  };

  setRef = ref => (this.ref = ref);

  onTouchStart = () => {
    this.shouldShortPress = true;
    this.moved = false;
    this.startTimeout();
  };

  onMove = () => {
    this.moved = true;
  };

  render() {
    const {children, disabled, mobileOnly, desktopOnly} = this.props;

    const props = {
      ref: this.setRef,
      onContextMenu: e => e.preventDefault(),
      ...(!desktopOnly && {
        onTouchStart: this.onTouchStart,
        onTouchEnd: this.cancelTimeout,
        onTouchMove: this.onMove
      }),
      ...(!mobileOnly && {
        onMouseDown: this.onTouchStart,
        onMouseUp: this.cancelTimeout,
        onMouseMove: this.onMove
      }),
      style: {
        ...children.props.style,
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }
    };

    return React.cloneElement(
      children,
      disabled ? children.props : {...children.props, ...props}
    );
  }
}

export default LongPress;
