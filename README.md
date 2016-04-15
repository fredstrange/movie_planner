[![bitHound Overall Score](https://www.bithound.io/github/fredstrange/movie_planner/badges/score.svg)](https://www.bithound.io/github/fredstrange/movie_planner)

Film Festival Planner
=====================

A social web application for planning movies at the Stockholm Film festival.

Todo
===============

* Profile page
 * Profile picture - Needs to update link url
 * General Cleanup
* Dedicated mobile and tablet ui
* Flagging comments
* Admin page
* Clean up UI
* Save schedule as PDF
 * Swipe events for opening and closing menu.
* Search field for movies
* Set the position when navigating back and forth in movie list.
* ~~Cache the Google maps pages so that my limit does not expire.~~
* Start page
* navigate back in history
* add the day menus in the compressed view.
* fix the side menu in the compressed view.
* browser-policy package
* add andruschka:scroll-to-fixed?
* replace the mobile lib.


Install
=======

This application is build using Meteor. Run this command to install Meteor on your computer:

```
 $ curl https://install.meteor.com/ | sh
```


Start the application.

```
$ meteor
```

When the application runs for the first time, it does not have any data. You need to manually trigger the loading of the different sources.
This application is designed for The Stockholm film festival and expects an API key from the festival site. This project is built so that it could mapped to other festivals. 

