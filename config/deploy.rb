set :application, "aprs.bz"
set :repository,  "git://github.com/gmcintire/aprs.bz.git"
set :user, "deploy"

set :scm, :git
set :deploy_to,   "/home/deploy/#{application}"

role :web, "72.34.190.3"
role :app, "72.34.190.3"
role :db,  "72.34.190.3", :primary => true
role :db,  "72.34.190.3"

