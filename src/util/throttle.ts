export default function throttle(func: Function, delay: number = 50): Function {
  let timer: number = 0;
  return function(event: Event): void {
    if (timer != 0) {
      return;
    }
    timer = setTimeout(() => {
      func(event);
      timer = 0;
    }, delay);
  };
}
