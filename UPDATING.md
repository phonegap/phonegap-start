# Upgrading the Application

The application is based on the Apache Cordova Hello World example.

## Upgrading

### Update the Source

    cp /incubator-cordova-app-hello-world/www www/

Do not replace `www/config.xml`.
Do not replace `www/img/logo.png`.

### Update the HTML

    vim www/index.html

Replace `<h1>Apache Cordova</h1>` with `<h1>PhoneGap</h1>`.

