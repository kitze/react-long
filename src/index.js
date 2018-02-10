import React, {Component} from 'react';

class LongPress extends Component {
  shouldShortPress = true;
  moved = false;

  static defaultProps = {
    time: 500
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

  render() {
    const {children, disabled} = this.props;

    const props = {
      ref: this.setRef,
      onTouchStart: () => {
        this.shouldShortPress = true;
        this.moved = false;
        this.startTimeout();
      },
      onTouchEnd: this.cancelTimeout,
      onContextMenu: e => e.preventDefault(),
      onTouchMove: () => {
        this.moved = true;
      },
      style: {
        ...children.props.style,
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }
    };

    return React.cloneElement(children, disabled ? children.props: {...children.props, ...props});
  }
}

export default LongPress;
