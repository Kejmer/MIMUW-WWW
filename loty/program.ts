let fibMem = {};
export function fib(i: number) : number {
  if (i in fibMem)
    return fibMem[i];
  if (i <= 2)
    return i-1;
  fibMem[i] = fib(i-1) + fib(i-2);
  return fibMem[i];
}