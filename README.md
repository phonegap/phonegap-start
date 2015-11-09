# Hello World PhoneGap Application [![bitHound Score][bithound-img]][bithound-url]

> A Hello World application built with PhoneGap

## Usage

### Desktop

In your browser, open the file:

    /www/index.html

### PhoneGap CLI

This repository is automatically downloaded by [phonegap-cli][phonegap-cli-url]
when you create a new application.

### PhoneGap Build

Create a new app with the following repository:

    https://github.com/phonegap/phonegap-start.git

## Contributors

### Updating the Application

The application is based on the [Apache Cordova Hello World][cordova-app] app.

#### 1. Update the Source

    cp cordova-app-hello-world/www www/

__Do not replace `www/config.xml`.__

__Do not replace `www/img/logo.png`.__

#### 2. Update index.html

Replace `<h1>Apache Cordova</h1>` with `<h1>PhoneGap</h1>`.

#### 3. Update PhoneGap Version

    <preference name="phonegap-version" value="x.x.x" />

#### 4. Commit

    $ git commit -am "Version x.x.x"

#### 5. Tag

    $ git tag x.x.x

[phonegap-cli-url]: http://github.com/phonegap/phonegap-cli
[cordova-app]: http://github.com/apache/cordova-app-hello-world
[bithound-img]: https://www.bithound.io/github/phonegap/phonegap-start/badges/score.svg
[bithound-url]: https://www.bithound.io/github/phonegap/phonegap-start

