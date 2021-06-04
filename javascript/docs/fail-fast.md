# fail fast

uncaught exceptionを`process.on('uncaughtException',cbFn)`によって補足したときは以下のように終了させるべきである。

```javascript
process.on('uncaughtException', (err) => {
  console.error(`${err.message}`)
  // Terminates the application with 1 (error) as exit code.
  // Without the following line, the application would continue
  process.exit(1)
})
```

必要に応じて、終了させる前にログを残したり、superviser processに再起動させたりすると良い。
