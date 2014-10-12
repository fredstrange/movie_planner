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
  * Delete Messages
* ~~Post on Twitter, Facebook and G+~~
* Profile page
 * ~~Fix the native user account~~
 * Profile picture - Needs to update link url
* Dedicated mobile and tablet ui
* Flagging comments
* Admin page
* Clean up UI
* ~~Dedicated "My program" page~~
* ~~path to movie~~
* ~~Direct integration with SFF's API~~
* Save schedule as PDF
* Show movies but day in movie list and schedule.
* Search field for movies
* Set the position when navigating back and forth in movie list.
* Cache the Google maps pages so that my limit does not expire.

Install
=======

To run this application you need Node and Npm installed. You can download the installer here: http://nodejs.org/download/

This application is build using Meteor. Run this command to install Meteor on your computer:

```
 $ curl https://install.meteor.com/ | sh
```

Meteorite is the Meteor package manger. Install Meteorite with Npm:

```
$ npm install -g meteorite
```

Start the application with Meteorite to make sure that the packages are installed.

```
$ mrt
```

When the application runs for the first time, it seed the database with Movie and Cinema data.
This data needs to be processed to determine walking distance and clashing play times. To generate this information, navigate to http://[host]/adminView
and press GO on configureCinemaDistances. This process takes about 2-3 minutes to complete and then you are good to go.

