# Upgrading the Application

The application is based on the Apache Cordova Hello World example.

### 1. Update the Source

    cp /incubator-cordova-app-hello-world/www www/

__Do not replace `www/config.xml`.__

__Do not replace `www/img/logo.png`.__

### 2. Update index.html

Replace `<h1>Apache Cordova</h1>` with `<h1>PhoneGap</h1>`.

### 3. Update config.xml

1. Update app version to latest PhoneGap version.

        <widget xmlns     = "http://www.w3.org/ns/widgets"
            xmlns:gap = "http://phonegap.com/ns/1.0"
            id        = "com.phonegap.hello-world"
            version   = "2.2.0">

2. Update PhoneGap version.

        <preference name="phonegap-version" value="x.x.x" />

### 4. Commit

    $ git commit -am "[app] Version x.x.x"

## 5. Tag

    $ git tag x.x.x
