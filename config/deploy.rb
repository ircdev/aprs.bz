set :application, "aprs"
set :scm,         :git
set :repository,  "git://github.com/gmcintire/aprs.bz.git"
set :branch,      "master"
set :deploy_via,  :remote_cache
set :deploy_to,   "/home/deploy/#{application}"
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
    run <<-CMD
      rm -rf #{latest_release}/log #{latest_release}/node_modules &&
      ln -s #{shared_path}/log #{latest_release}/log &&
      ln -s #{shared_path}/node_modules #{latest_release}/node_modules
    CMD
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
    run <<-CMD
      cd #{latest_release} &&
      npm install 
    CMD
  end
  
  task :write_upstart_script, :roles => :app do
    upstart_script = %q{
description "#{application} upstart script"
start on (local-filesystem and net-device-up)
stop on shutdown
respawn
respawn limit 5 60
script
  chdir #{current_path}
  exec sudo -u #{user} NODE_ENV="production" #{node_bin} #{node_script} >> log/production.log 2>&1
end script}
    
    put upstart_script "/tmp/#{application}.conf"
    run "#{sudo} mv /tmp/#{application}.conf /etc/init"
  end
end

after 'deploy:setup', 'deploy:write_upstart_script'
after 'deploy:finalize_update', 'deploy:npm'
