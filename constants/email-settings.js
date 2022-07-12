const config_env = JSON.parse(process.env.CONFIG);
 
 MAIL_SETTINGS = {
    service: 'gmail',
    auth: {
      user:  config_env.MAIL_EMAIL,
      pass:  config_env.MAIL_PASSWORD,
    },
  }

module.exports = {
    MAIL_SETTINGS: MAIL_SETTINGS
}