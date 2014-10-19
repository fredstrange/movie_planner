[![Build Status](https://travis-ci.org/fredstrange/movie_planner.svg?branch=master)](https://travis-ci.org/fredstrange/movie_planner)
Film Festival Planner
=====================

A social web application for planning movies at the Stockholm Film festival.

Todo
===============

* ~~Friends~~
  * ~~List friends~~
  * ~~Invite friends~~
  * ~~direct messages to friends~~
  * ~~Delete Messages~~
* ~~Post on Twitter, Facebook and G+~~
* Profile page
 * ~~Fix the native user account~~
 * Profile picture - Needs to update link url
 * General Cleanup
* Dedicated mobile and tablet ui
* Flagging comments
* Admin page
* Clean up UI
* ~~Dedicated "My program" page~~
* ~~path to movie~~
* ~~Direct integration with SFF's API~~
* Save schedule as PDF
* ~Show movies by day in movie list and schedule.~~
 * ~~Add side menu to movie pane~
 * Add side menu to schedule pane
 * ~~Button on the center of the left side to toggle side menu~~
 * Swipe events for opening and closing menu.
 * ~~Update router to default to today's movies or the first day of the festival.~
* Search field for movies
* Set the position when navigating back and forth in movie list.
* Cache the Google maps pages so that my limit does not expire.
* ~~Fix Schedule rendering~~
* ~~List to other viewings of the Movie~~
* ~~Deployment configuration~~
* Start page
* ~~Mark active page~~
* navigate back in history
* add the day menus in the compressed view.
* fix the side menu in the compressed view.
* browser-policy package
* add andruschka:scroll-to-fixed?
* ~~Refactor messages.~
 *~~Message counter broken?~~
 * ~~Date since broken?~~
* There seems to be a delay in the "selected" object sometimes
 * this seems to be cause by the delay of the rendered sub object and the data. Fix this by breaking the dropdown into its own partial with its own rendered function.


Install
=======

To run this application you need Node and Npm installed. You can download the installer here: http://nodejs.org/download/

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

