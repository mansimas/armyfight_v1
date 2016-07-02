class TranslationsController < ApplicationController
    before_action :check_if_admin

	def index
	end

    def change_value
        $redis.hset params[:lang], params[:key], params[:value]
        render :json => { :status => :ok }
    end

    def delete_key
    	($redis.hkeys 'languages').each do |lang|
    		$redis.hdel lang, params[:key]
    	end
    	render :json => { :status => :ok }
    end

    def add_language
    	$redis.hset 'languages', params[:lang], ''
    	I18n.config.available_locales = $redis.hkeys 'languages'
    	Rails.application.reload_routes!
    	render :json => { :status => :ok }
    end

    def delete_locale
    	$redis.hdel 'languages', params[:loc]
    	$redis.del params[:loc]
    	render :json => { :status => :ok }
    end

    private
    def check_if_admin
        if current_user && current_user.nickname == 'mansim'
            #its ok
        else
            redirect_to root_path
        end
    end

 end