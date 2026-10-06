module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['features/support/**/*.js', 'features/step_definitions/**/*.js'],
    format: ['progress', 'html:reports/cucumber.html', 'json:reports/cucumber.json'],
    parallel: 0,
    retry: 0,
    worldParameters: {
      loginUrl: process.env.LOGIN_URL || 'http://www.cs.uns.edu.ar/~mll/temp/testing/hogwarts/login.html',
      headless: process.env.HEADED !== '1'
    }
  }
};
