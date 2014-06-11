# Hello World PhoneGap Application

> A Hello World application built with PhoneGap

## Usage

### Desktop

In your browser, open the file:

    /www/index.html

### PhoneGap CLI

This repository is automatically downloaded by [phonegap-cli][phonegap-cli-url].

### PhoneGap Build

Create a new app with the following repository:

    https://github.com/phonegap/phonegap-start.git

### nitrous.io

[Setup nitrous.io][nitrous].

Then run the following commands in the nitrous.io terminal:

1. `cd ~/workspace/phonegap-start`
2. `npm install -g phonegap`
3. `phonegap remote build android`

The last command requires an Adobe ID and will build your app on PhoneGap Build.

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
[nitrous-url]: https://d3o0mnbgv6k92a.cloudfront.net/assets/hack-l-v1-3cc067e(https://www.nitrous.io/hack_button?source=embed&runtime=nodejs&repo=phonegap%2Fphonegap-start&file_to_open=README.md

