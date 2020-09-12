const App =  require('./app');

const MAX_RETRY = 20;

const { PORT = 3000 } = process.env;

const startApplication = async (retryCount) => {
  try {
    App.listen(PORT, () => {
    console.log(`Application started at http://localhost:${PORT}`);
    });

  } catch (e) {
    const nextRetryCount = retryCount - 1;
    if (nextRetryCount > 0) {
      setTimeout(async () => await startApplication(nextRetryCount), 3000);
      return;
    }

    console.log('Unable to start application')
  }
};

startApplication(MAX_RETRY);
