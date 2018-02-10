import {React, Component} from 'react';

const TOUCH_START = 'touchstart';
const TOUCH_END = 'touchend';

class LongPress extends Component {
  shouldShortPress = true;

  componentDidMount() {
    this.listenForTouch();
  }

  componentWillUnmount() {
    this.stopListening();
  }

  startInterval = () => {
    this.timeout = setTimeout(this.longPressed, this.props.time);
  };

  longPressed = () => {
    this.shouldShortPress = false;

    if (this.props.onLongPress) {
      this.props.onLongPress();
      this.cancelInterval();
    }
  };

  cancelInterval = () => {
    clearTimeout(this.timeout);
    if (this.props.onPress && this.shouldShortPress) {
      this.props.onPress();
    }
  };

  setRef = ref => (this.ref = ref);

  listenForTouch = () => {
    if (this.ref) {
      this.listenerStart = this.ref.addEventListener(TOUCH_START, e => {
        e.preventDefault();
        this.shouldShortPress = true;
        this.startInterval();
      });
      this.listenerEnd = this.ref.addEventListener(TOUCH_END, e => {
        e.preventDefault();
        this.cancelInterval();
      });
    }
  };

  stopListening = () => {
    this.ref.removeEventListener(TOUCH_START, this.listenerStart);
    this.ref.removeEventListener(TOUCH_END, this.listenerEnd);
  };

  render() {
    return this.props.render(this.setRef);
  }
}

export default LongPress;