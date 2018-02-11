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
      console.error(
        'The LongPress component can be used only with touch devices.'
      );
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

  setRef = ref => (this.ref = ref);

  onTouchStart = () => {
    this.shouldShortPress = true;
    this.moved = false;
    this.startTimeout();
  };

  onTouchEnd = () => {
    this.cancelTimeout();
    if (this.props.onPress && this.shouldShortPress && this.moved === false) {
      this.props.onPress();
    }
  };

  onMove = () => {
    this.moved = true;
  };

  render() {
    const {children, disabled} = this.props;
    const {touch} = this.state;

    if (!touch || disabled) {
      return children;
    }

    const props = {
      ref: this.setRef,
      onContextMenu: e => e.preventDefault(),
      onTouchStart: this.onTouchStart,
      onTouchEnd: this.onTouchEnd,
      onTouchMove: this.onMove,
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
