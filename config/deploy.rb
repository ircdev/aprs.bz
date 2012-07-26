set :application, "aprs"
set :scm,         :git
set :repository,  "git://github.com/gmcintire/aprs.bz.git"
set :branch,      "master"
set :deploy_via,  :remote_cache
set :deploy_to,   "/home/deploy/apps/#{application}"
set :node_bin,   "/usr/local/bin/coffee"
set :node_script, "app.coffee"
set :user, "deploy"
set :use_sudo, true
set :default_run_options, :pty => true
set :shared_children, %w(log node_modules)
role :app, "72.34.190.3"

namespace :deploy do
  task :default do
    update
    start
  end

  task :cold do
    update
    start
  end
  
  task :setup, :expect => { :no_release => true } do
    dirs  = [deploy_to, releases_path, shared_path]
    dirs += shared_children.map { |d| File.join(shared_path, d) }
    run "mkdir -p #{dirs.join(' ')}"
    run "chmod g+w #{dirs.join(' ')}" if fetch(:group_writable, true)
  end
  
  task :finalize_update, :except => { :no_release => true } do
    run "chmod -R g+w #{latest_release}" if fetch(:group_writable, true)
    run "rm -rf #{latest_release}/log #{latest_release}/node_modules && ln -s #{shared_path}/log #{latest_release}/log"
    #ln -s #{shared_path}/node_modules #{latest_release}/node_modules
  end
  
  task :start, :roles => :app do
    run "#{sudo} restart #{application} || #{sudo} start #{application}"
  end

  task :stop, :roles => :app do
    run "#{sudo} stop #{application}"
  end

  task :restart, :roles => :app do
    start
  end
  
  task :npm, :roles => :app do
    run "cd #{latest_release} && npm install"
  end
  
end

after 'deploy:finalize_update', 'deploy:npm'
