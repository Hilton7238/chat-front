export default function debounce(func: Function, delay: number = 50): Function {
  let timer: number;
  return function(event: Event): void {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(event);
    }, delay);
  };
}
